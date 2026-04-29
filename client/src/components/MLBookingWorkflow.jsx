import React, { useState, useEffect } from 'react';
import TravelMap from './TravelMap';

export default function MLBookingWorkflow({ user, vehicles: initialVehicles, editingTrip, onClose, onConfirmed }) {
  const [vehicles, setVehicles] = useState(initialVehicles || []);
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState({ Likes_Beach:0, Likes_Mountain:0, Likes_Culture:0, Likes_Adventure:0, Budget:2 });
  const [dates, setDates] = useState({ startDate:'', endDate:'', groupSize:1 });
  const [mlResult, setMlResult] = useState({ main:[], suggestions:[] });
  const [mlLimit, setMlLimit] = useState(1);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [clusterPlaces, setClusterPlaces] = useState({});
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itinLoading, setItinLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const H = { 'Content-Type':'application/json', Authorization:`Bearer ${user.token}` };
  const allPlaces = Object.values(clusterPlaces).flat();

  // Check if at least one place is selected from each selected cluster
  const hasPlaceFromEveryCluster = selectedClusters.length > 0 &&
    selectedClusters.every(c => clusterPlaces[c.cluster] && clusterPlaces[c.cluster].length > 0);


  const totalDays = dates.startDate && dates.endDate
    ? Math.max(1, Math.ceil((new Date(dates.endDate) - new Date(dates.startDate)) / 86400000))
    : 0;

  useEffect(() => {
    if (editingTrip) {
      setDates({ startDate: editingTrip.start_date?.split('T')[0]||'', endDate: editingTrip.end_date?.split('T')[0]||'', groupSize: editingTrip.group_size||1 });
      setPrefs({
        Likes_Beach: editingTrip.likes_beach || 0,
        Likes_Mountain: editingTrip.likes_mountain || 0,
        Likes_Culture: editingTrip.likes_culture || 0,
        Likes_Adventure: editingTrip.likes_adventure || 0,
        Budget: editingTrip.budget_tier || 2
      });
    }
  }, [editingTrip]);

  useEffect(() => {
    // Always fetch fresh vehicles to ensure we have the latest booking statuses
    fetch('http://localhost:5000/api/vehicles/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVehicles(data);
      })
      .catch(e => console.error("Failed to fetch fresh vehicles:", e));
  }, []);

  const getAvailableVehicles = () => {
    return (vehicles || []).filter(v =>
      v.status === 'active' &&
      Number(v.capacity) >= Number(dates.groupSize) &&
      !(v.Bookings && v.Bookings.some(b => b.status === 'accepted'))
    ).sort((a, b) => a.price_per_day - b.price_per_day);
  };

  useEffect(() => {
    if (step === 4) {
      const available = (vehicles || []).filter(v =>
        v.status === 'active' &&
        Number(v.capacity) >= Number(dates.groupSize) &&
        !(v.Bookings && v.Bookings.some(b => b.status === 'accepted'))
      ).sort((a, b) => a.price_per_day - b.price_per_day);
      
      if (available.length > 0 && !selectedVehicle) {
        setSelectedVehicle(available[0]); // Default to cheapest matching
      }
    }
  }, [step, dates.groupSize, vehicles, selectedVehicle]);

  const togglePref = k => setPrefs(p => ({ ...p, [k]: p[k] ? 0 : 1 }));

  const toggleCluster = c => {
    const has = selectedClusters.find(x => x.cluster === c.cluster);
    if (has) setSelectedClusters(selectedClusters.filter(x => x.cluster !== c.cluster));
    else if (selectedClusters.length < mlLimit) setSelectedClusters([...selectedClusters, c]);
  };

  const togglePlace = (cName, p) => {
    const cur = clusterPlaces[cName]||[];
    const has = cur.find(x => x.place === p.place);
    setClusterPlaces({ ...clusterPlaces, [cName]: has ? cur.filter(x=>x.place!==p.place) : cur.length<3 ? [...cur, p] : cur });
  };

  const handleML = async () => {
    if (!prefs.Likes_Beach && !prefs.Likes_Mountain && !prefs.Likes_Culture && !prefs.Likes_Adventure) { setError('Select at least one travel interest.'); return; }
    if (!dates.startDate || !dates.endDate) { setError('Please select start and end dates.'); return; }
    if (totalDays < 1) { setError('End date must be after start date.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ml/recommend', { method:'POST', headers:H, body:JSON.stringify({ ...prefs, Total_Days: totalDays }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message||'ML failed');
      const data = d.data||{ main:[], suggestions:[] };
      setMlResult(data); setMlLimit(data.limit||1); setSelectedClusters(data.main||[]); setStep(2);
    } catch(e) { setError(e.message); } finally { setLoading(false); }
  };

  const handleDayPlan = async () => {
    if (!allPlaces.length) return;
    setItinLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/generate-itinerary', { method:'POST', headers:H, body:JSON.stringify({ selectedPlaces: allPlaces.map(p=>({ name:p.place, district:p.city, category:p.category })), duration:totalDays||1, startDate:dates.startDate }) });
      setItinerary(await res.json());
    } catch(e) { console.error(e); } finally { setItinLoading(false); }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Match selected places to DB destinations by name
      let destinations = [];
      try {
        const destsRes = await fetch('http://localhost:5000/api/destinations');
        const allDests = await destsRes.json();
        destinations = allPlaces.map((p, i) => {
          const match = Array.isArray(allDests) && allDests.find(d =>
            d.name?.toLowerCase() === p.place?.toLowerCase()
          );
          return match ? { destination_id: match.id, day_number: Math.floor(i/2)+1, visit_order: i+1 } : null;
        }).filter(Boolean);
      } catch(_) { /* proceed without destinations if lookup fails */ }

      const url = editingTrip ? `http://localhost:5000/api/trips/${editingTrip.id}` : 'http://localhost:5000/api/trips';
      const tr = await fetch(url, {
        method: editingTrip ? 'PUT' : 'POST',
        headers: H,
        body: JSON.stringify({
          start_date: dates.startDate,
          end_date: dates.endDate,
          group_size: parseInt(dates.groupSize) || 1,
          destinations,
          prefs,
          status: 'planned'
        })
      });
      if (!tr.ok) {
        const errBody = await tr.json().catch(()=>({}));
        throw new Error(errBody.message || `Save failed (${tr.status})`);
      }
      const savedTrip = await tr.json();

      // Create Booking (If new or needed)
      if (selectedVehicle) {
        await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: H,
          body: JSON.stringify({
            trip_id: savedTrip.id,
            vehicle_id: selectedVehicle.id
          })
        });
      }

      onConfirmed();
    } catch(e) { setError(e.message); } finally { setLoading(false); }
  };

  const VIBES = [{ k:'Likes_Beach', i:'🏖️', l:'Beach' },{ k:'Likes_Mountain', i:'⛰️', l:'Mountain' },{ k:'Likes_Culture', i:'🛕', l:'Culture' },{ k:'Likes_Adventure', i:'🧗', l:'Adventure' }];
  const BUDGETS = [{ l:'Low', v:1 },{ l:'Medium', v:2 },{ l:'High', v:3 }];
  const mapSelectedPlaces = Object.fromEntries(Object.entries(clusterPlaces).filter(([,v])=>v.length>0));
  const TOTAL_STEPS = 5;

  const ClusterCard = ({ c, index, badge }) => {
    const sel = !!selectedClusters.find(x => x.cluster === c.cluster);
    const atLimit = !sel && selectedClusters.length >= mlLimit;
    return (
      <div onClick={()=>!atLimit && toggleCluster(c)}
        style={{ padding:'20px', borderRadius:'20px', border:`2px solid ${sel?'var(--primary)':'var(--outline-variant)'}`, background:sel?'rgba(27,109,46,0.05)':'white', cursor:atLimit?'not-allowed':'pointer', opacity:atLimit?0.5:1, transition:'all 0.2s', position:'relative' }}>
        {sel && <div style={{ position:'absolute', top:'12px', right:'12px', width:'24px', height:'24px', background:'var(--primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}><span className="material-symbols-outlined" style={{ fontSize:'14px', color:'white' }}>check</span></div>}
        {badge && <div style={{ display:'inline-block', padding:'4px 12px', background: badge==='TOP PICK'?'var(--primary)':'#6366f1', color:'white', borderRadius:'50px', fontSize:'0.7rem', fontWeight:700, marginBottom:'10px' }}>{badge==='TOP PICK'?'⭐ TOP PICK':'💡 SUGGESTED'}</div>}
        <h4 style={{ fontWeight:700, fontSize:'1.05rem', marginBottom:'6px' }}>{c.cluster}</h4>
        <div style={{ fontSize:'0.85rem', color:'#64748b' }}>Score: <strong style={{ color:'var(--primary)' }}>{c.score?.toFixed(1)}</strong></div>
        <div style={{ fontSize:'0.8rem', color:'#94a3b8', marginTop:'4px' }}>{c.places?.length||0} places</div>
      </div>
    );
  };

  const canGoToStep = (targetStep) => {
    if (targetStep <= step) return true;
    for (let i = step; i < targetStep; i++) {
      if (i === 1 && (!dates.startDate || !dates.endDate || !dates.groupSize || !mlResult.suggestions?.length)) return false;
      if (i === 2 && !selectedClusters.length) return false;
      if (i === 3 && !hasPlaceFromEveryCluster) return false;
      if (i === 3 && !allPlaces.length) return false;
      if (i === 4 && (!selectedVehicle && getAvailableVehicles().length > 0)) return false;
    }
    return true;
  };

  return (
    <div className="planning-surface">
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'40px' }}>
          <button onClick={onClose} style={{ background:'white', border:'none', width:'48px', height:'48px', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {[1,2,3,4,5].map(n=>{
              const clickable = canGoToStep(n);
              return (
              <React.Fragment key={n}>
                <div 
                  className={`step-dot ${step>=n?'active':''}`} 
                  onClick={() => { if (clickable) setStep(n); }} 
                  style={{ cursor: clickable ? 'pointer' : 'not-allowed', opacity: clickable ? 1 : 0.6 }}
                >
                  {n}
                </div>
                {n<5 && <div style={{ width:'24px', height:'2px', background:step>n?'var(--primary)':'var(--surface-container)' }}/>}
              </React.Fragment>
            )})}
          </div>
          <span style={{ marginLeft:'auto', fontSize:'0.85rem', color:'#64748b', fontWeight:600 }}>Step {step} of {TOTAL_STEPS}</span>
        </div>

        <div className="glass-card">
          {error && <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'12px 20px', borderRadius:'12px', marginBottom:'24px', fontWeight:600, fontSize:'0.9rem' }}>⚠️ {error}</div>}

          {/* ── STEP 1 ── */}
          {step===1 && (
            <div className="fade-in">
              <header className="step-header">
                <h2 className="step-title">🧠 Discover Your Perfect Trip</h2>
                <p className="subheading">Our ML model will find the best Sri Lanka regions for your travel style.</p>
              </header>

              <div style={{ marginBottom:'28px' }}>
                <label style={{ display:'block', fontWeight:700, marginBottom:'14px', fontSize:'1.05rem' }}>What's your island vibe?</label>
                <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                  {VIBES.map(v=>(
                    <button key={v.k} type="button" onClick={()=>togglePref(v.k)}
                      style={{ padding:'12px 22px', borderRadius:'50px', border:`2px solid ${prefs[v.k]?'var(--primary)':'var(--outline-variant)'}`, background:prefs[v.k]?'rgba(27,109,46,0.08)':'white', color:prefs[v.k]?'var(--primary)':'#64748b', fontWeight:700, cursor:'pointer', fontSize:'0.95rem', display:'flex', alignItems:'center', gap:'8px', transition:'all 0.2s' }}>
                      <span style={{ fontSize:'1.2rem' }}>{v.i}</span>{v.l}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'28px' }}>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:'12px' }}>💰 Budget Level</label>
                  <div style={{ display:'flex', gap:'10px' }}>
                    {BUDGETS.map(b=>(
                      <button key={b.v} type="button" onClick={()=>setPrefs(p=>({...p,Budget:b.v}))}
                        style={{ flex:1, padding:'12px', borderRadius:'14px', border:`2px solid ${prefs.Budget===b.v?'var(--primary)':'var(--outline-variant)'}`, background:prefs.Budget===b.v?'rgba(27,109,46,0.08)':'white', color:prefs.Budget===b.v?'var(--primary)':'#64748b', fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
                        {b.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:'12px' }}>👥 Travelers</label>
                  <input type="number" className="input-field" min="1" max="20" value={dates.groupSize} onChange={e=>setDates(d=>({...d,groupSize:e.target.value}))} />
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:'12px' }}>📅 Start Date</label>
                  <input type="date" className="input-field" value={dates.startDate} min={new Date().toISOString().split('T')[0]}
                    onChange={e=>setDates(d=>({...d,startDate:e.target.value,endDate:d.endDate&&d.endDate<e.target.value?'':d.endDate}))} />
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:'12px' }}>📅 End Date</label>
                  <input type="date" className="input-field" value={dates.endDate} min={dates.startDate||new Date().toISOString().split('T')[0]}
                    onChange={e=>setDates(d=>({...d,endDate:e.target.value}))} />
                </div>
              </div>

              {totalDays > 0 && (
                <div style={{ padding:'14px 20px', background:'rgba(27,109,46,0.06)', borderRadius:'14px', marginBottom:'24px', display:'flex', alignItems:'center', gap:'10px', fontWeight:600, color:'var(--primary)' }}>
                  <span className="material-symbols-outlined">calendar_today</span>
                  {totalDays} day{totalDays>1?'s':''} trip · {dates.startDate} → {dates.endDate}
                </div>
              )}

              <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:'24px', borderTop:'1px solid var(--outline-variant)' }}>
                <button className="btn-primary" onClick={handleML} disabled={loading} style={{ padding:'16px 48px', fontSize:'1.05rem' }}>
                  {loading ? 'Analyzing...' : '🚀 Find My Trip'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step===2 && (
            <div className="fade-in">
              <header className="step-header">
                <h2 className="step-title">📍 Your Recommended Regions</h2>
                <p className="subheading">
                  Select up to <strong>{mlLimit}</strong> region{mlLimit>1?'s':''} for your {totalDays}-day trip.
                  <span style={{ marginLeft:'12px', padding:'4px 12px', background:'var(--surface-container)', borderRadius:'50px', fontSize:'0.85rem', fontWeight:700 }}>{selectedClusters.length}/{mlLimit} selected</span>
                </p>
              </header>

              {/* All clusters in one grid: main + suggestions with divider */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'16px', marginBottom:'24px' }}>
                {mlResult.main.map((c,i)=><ClusterCard key={c.cluster} c={c} index={i} badge={i===0?'TOP PICK':null}/>)}
                {mlResult.suggestions?.length>0 && (
                  <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', gap:'12px', margin:'4px 0' }}>
                    <div style={{ flex:1, height:'1px', background:'var(--outline-variant)' }}/>
                    <span style={{ fontSize:'0.8rem', color:'#94a3b8', fontWeight:600, whiteSpace:'nowrap' }}>💡 You might also like · counts toward {mlLimit}-cluster limit</span>
                    <div style={{ flex:1, height:'1px', background:'var(--outline-variant)' }}/>
                  </div>
                )}
                {mlResult.suggestions?.map((s,i)=><ClusterCard key={s.cluster} c={s} index={i} badge="SUGGESTED"/>)}
              </div>

              {/* Inline Map */}
              <TravelMap clusters={selectedClusters} selectedPlaces={mapSelectedPlaces} suggestions={[]} />

              <div className="workflow-nav">
                <button className="btn-white" onClick={()=>setStep(1)}>Back</button>
                <button className="btn-primary" onClick={()=>setStep(3)} disabled={!selectedClusters.length} style={{ padding:'16px 48px' }}>Select Places ➜</button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step===3 && (
            <div className="fade-in">
              <header className="step-header">
                <h2 className="step-title">🏝️ Pick Your Places</h2>
                <p className="subheading">Choose up to 3 places per region. Optionally generate an AI day plan.</p>
              </header>

              {selectedClusters.map(c=>{
                const sel = clusterPlaces[c.cluster]||[];
                return (
                  <div key={c.cluster} style={{ marginBottom:'28px', background:'white', borderRadius:'24px', padding:'24px', border:'1px solid var(--outline-variant)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                      <h4 style={{ fontWeight:700, fontSize:'1.1rem' }}>📍 {c.cluster}</h4>
                      <span style={{ padding:'5px 14px', background:'var(--surface-container)', borderRadius:'50px', fontSize:'0.8rem', fontWeight:700 }}>{sel.length}/3</span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                      {(c.places||[]).map((p,i)=>{
                        const picked = !!sel.find(x=>x.place===p.place);
                        return (
                          <div key={i} onClick={()=>togglePlace(c.cluster,p)}
                            style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 18px', borderRadius:'12px', border:`1.5px solid ${picked?'var(--primary)':'var(--surface-container-high)'}`, background:picked?'rgba(27,109,46,0.04)':'white', cursor:'pointer', transition:'all 0.15s' }}>
                            <div>
                              <div style={{ fontWeight:700, marginBottom:'2px' }}>{p.place}</div>
                              <div style={{ fontSize:'0.8rem', color:'#64748b' }}>{p.city} · {p.category}</div>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                              <span style={{ fontSize: '1.2rem', filter: 'grayscale(0.2)' }}>
                                {p.category?.toLowerCase().match(/beach|sea|coast|ocean/) ? '🏖️' :
                                 p.category?.toLowerCase().match(/mountain|hiking|hill|peak|rock/) ? '⛰️' :
                                 p.category?.toLowerCase().match(/nature|garden|park|forest|wildlife|animal|safari/) ? '🌿' :
                                 p.category?.toLowerCase().match(/religi|temple|church|mosque|shrine/) ? '🛕' :
                                 p.category?.toLowerCase().match(/histor|culture|ruin|heritage|fort|museum/) ? '🏛️' :
                                 p.category?.toLowerCase().match(/adventur|sport|surf/) ? '🧗' :
                                 p.category?.toLowerCase().match(/waterfall|river|lake|stream/) ? '🌊' : '📍'}
                              </span>
                              {picked && <div style={{ width:'20px', height:'20px', background:'var(--primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}><span className="material-symbols-outlined" style={{ fontSize:'12px', color:'white' }}>check</span></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {hasPlaceFromEveryCluster && !itinerary && (
                <div style={{ textAlign:'center', padding:'24px', background:'linear-gradient(135deg,rgba(27,109,46,0.05),rgba(45,158,79,0.08))', borderRadius:'20px', marginBottom:'24px' }}>
                  <p style={{ fontWeight:600, marginBottom:'14px', color:'#334155' }}>✨ Want a day-by-day itinerary for your {allPlaces.length} selected places?</p>
                  <button className="btn-primary" onClick={handleDayPlan} disabled={itinLoading} style={{ padding:'12px 32px' }}>
                    {itinLoading ? 'Generating...' : '✨ Generate Day Plan'}
                  </button>
                </div>
              )}

              {itinerary?.itinerary && (
                <div style={{ background:'white', borderRadius:'24px', padding:'24px', border:'1px solid var(--outline-variant)', marginBottom:'24px' }}>
                  <h4 style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'16px', color:'var(--primary)' }}>✨ Your AI Day Plan</h4>
                  {itinerary.itinerary.map((day,i)=>(
                    <div key={i} style={{ padding:'14px 18px', background:'var(--surface-container-low)', borderRadius:'12px', marginBottom:'8px' }}>
                      <div style={{ fontWeight:700, marginBottom:'4px' }}>Day {day.day} · {day.places?.join(', ')}</div>
                      <div style={{ fontSize:'0.85rem', color:'#64748b' }}>{day.activities}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Map with itinerary day colors */}
              <TravelMap clusters={selectedClusters} selectedPlaces={mapSelectedPlaces} suggestions={[]} itinerary={itinerary} />

              <div className="workflow-nav">
                <button className="btn-white" onClick={()=>setStep(2)}>Back</button>
                <button className="btn-primary" onClick={()=>setStep(4)} disabled={!hasPlaceFromEveryCluster} style={{ padding:'16px 48px' }}>Select Transport ➜</button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Transport ── */}
          {step===4 && (
            <div className="fade-in">
              <header className="step-header">
                <h2 className="step-title">🚘 Island Transport</h2>
                <p className="subheading">Choose from our fleet of driver-owned vehicles that fit your group.</p>
              </header>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {getAvailableVehicles().map(vehicle => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    style={{ padding: '24px', borderRadius: '32px', background: selectedVehicle?.id === vehicle.id ? 'var(--surface-container-low)' : 'white', border: `2px solid ${selectedVehicle?.id === vehicle.id ? 'var(--primary)' : 'var(--outline-variant)'}`, cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                  >
                    {selectedVehicle?.id === vehicle.id && (
                      <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <div style={{ width: '160px', height: '110px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={vehicle.image_url ? `http://localhost:500${vehicle.image_url}` : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400"}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          alt={vehicle.type}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>{vehicle.type}</h3>
                        <div style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '0.85rem', marginBottom: '12px' }}>
                          <span>👥 {vehicle.capacity} Seats</span>
                          <span>•</span>
                          <span>{vehicle.condition}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>LKR {parseFloat(vehicle.price_per_day).toLocaleString()}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', paddingBottom: '2px' }}>/ day</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {getAvailableVehicles().length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', background: 'white', borderRadius: '32px', color: '#64748b' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>directions_car</span>
                    <p style={{ fontWeight: 600 }}>No vehicles found fitting your group size of {dates.groupSize}.</p>
                  </div>
                )}
              </div>

              {getAvailableVehicles().length > 0 && selectedVehicle && (
                <div style={{ padding: '24px', background: 'var(--tertiary-fixed)', borderRadius: '24px', color: 'var(--on-tertiary-fixed)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>info</span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>You've selected a {selectedVehicle.type}. Total transport cost for {totalDays} days will be LKR {(selectedVehicle.price_per_day * totalDays).toLocaleString()}.</p>
                </div>
              )}

              <div className="workflow-nav">
                <button className="btn-white" onClick={() => setStep(3)}>Back</button>
                <button className="btn-primary" disabled={!selectedVehicle && getAvailableVehicles().length > 0} onClick={() => setStep(5)} style={{ padding: '16px 48px' }}>Review & Confirm ➜</button>
              </div>
            </div>
          )}

          {/* ── STEP 5: Confirm ── */}
          {step===5 && (
            <div className="fade-in">
              <header className="step-header" style={{ textAlign:'center' }}>
                <div style={{ width:'80px', height:'80px', background:'rgba(27,109,46,0.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'40px', color:'var(--primary)' }}>celebration</span>
                </div>
                <h2 className="step-title">Almost There!</h2>
                <p className="subheading">Review your ML-curated journey before confirming.</p>
              </header>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px', marginBottom:'40px' }}>
                <div>
                  <h4 style={{ fontWeight:700, marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}><span className="material-symbols-outlined" style={{ color:'var(--primary)' }}>map</span> Regions & Places</h4>
                  {selectedClusters.map(c=>(
                    <div key={c.cluster} style={{ marginBottom:'14px', padding:'16px', background:'var(--surface-container-low)', borderRadius:'16px' }}>
                      <div style={{ fontWeight:700, marginBottom:'6px' }}>📍 {c.cluster}</div>
                      {(clusterPlaces[c.cluster]||[]).map((p,i)=>(
                        <div key={i} style={{ fontSize:'0.85rem', color:'#64748b', marginLeft:'12px' }}>• {p.place}</div>
                      ))}
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ fontWeight:700, marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}><span className="material-symbols-outlined" style={{ color:'var(--primary)' }}>calendar_today</span> Trip Info</h4>
                  <div style={{ padding:'20px', background:'var(--surface-container-low)', borderRadius:'16px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}><span style={{ color:'#64748b' }}>Start</span><strong>{dates.startDate}</strong></div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}><span style={{ color:'#64748b' }}>End</span><strong>{dates.endDate}</strong></div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}><span style={{ color:'#64748b' }}>Duration</span><strong>{totalDays} days</strong></div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'#64748b' }}>Travelers</span><strong>{dates.groupSize}</strong></div>
                  </div>
                  <h4 style={{ fontWeight:700, marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px', marginTop:'24px' }}><span className="material-symbols-outlined" style={{ color:'var(--primary)' }}>directions_car</span> Vehicle</h4>
                  {selectedVehicle ? (
                    <div style={{ padding:'20px', background:'var(--surface-container-low)', borderRadius:'16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700 }}>{selectedVehicle.type}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>LKR {selectedVehicle.price_per_day.toLocaleString()} / day</span>
                    </div>
                  ) : (
                    <div style={{ padding:'16px', background:'rgba(27,109,46,0.05)', border:'1px solid rgba(27,109,46,0.2)', borderRadius:'16px', fontSize:'0.9rem', color:'#475569' }}>
                      <span className="material-symbols-outlined" style={{ fontSize:'18px', color:'var(--primary)', verticalAlign:'middle', marginRight:'8px' }}>info</span>
                      Vehicle booking can be done later from My Trips.
                    </div>
                  )}
                </div>
              </div>

              <div className="workflow-nav" style={{ justifyContent:'center', gap:'24px', border:'none' }}>
                <button className="btn-white" onClick={()=>setStep(4)} style={{ padding:'16px 32px' }}>Back</button>
                <button className="btn-primary" onClick={handleConfirm} disabled={loading} style={{ padding:'16px 56px', fontSize:'1.1rem' }}>
                  {loading ? 'Finalizing...' : '✅ Confirm Journey'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
