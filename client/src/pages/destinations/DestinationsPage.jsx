import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/destinations')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDestinations(data);

                    // Extract unique categories for the filter dropdown
                    const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
                    setCategories(uniqueCategories);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching destinations:', err);
                setLoading(false);
            });
    }, []);

    const filteredDestinations = destinations.filter(dest => {
        const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.district.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? dest.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    const pageStyles = `
        .dest-layout { min-height: 100vh; background: #F3F4F6; }
        .hero { background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1546708973-51eb0c8004aa?auto=format&fit=crop&q=80'); background-size: cover; background-position: center; color: white; padding: 100px 20px; text-align: center; }
        .hero h1 { font-family: 'DM Sans', sans-serif; font-size: 3.5rem; margin-bottom: 20px; }
        .hero p { font-size: 1.2rem; max-width: 600px; margin: 0 auto; color: #E5E7EB; }
        
        .filters-bar { background: white; padding: 20px; border-radius: 12px; margin: -30px auto 40px; max-width: 900px; display: flex; gap: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); position: relative; z-index: 10; flex-wrap: wrap; }
        .filter-input { flex: 1; min-width: 250px; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 1rem; outline: none; transition: border-color 0.2s; }
        .filter-input:focus { border-color: #10B981; }
        .filter-select { padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 1rem; outline: none; background: white; cursor: pointer; min-width: 150px; }

        .dest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; padding: 0 40px 60px; max-width: 1400px; margin: 0 auto; }
        .dest-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
        .dest-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
        .dest-img-container { height: 220px; background: #E5E7EB; position: relative; }
        .dest-img-container iframe { width: 100%; height: 100%; border: 0; }
        .category-badge { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.9); padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; color: #10B981; backdrop-filter: blur(4px); box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        
        .dest-content { padding: 24px; flex-grow: 1; display: flex; flex-direction: column; }
        .dest-title { font-family: 'DM Sans', sans-serif; font-size: 1.6rem; color: #111827; margin-bottom: 8px; }
        .dest-district { color: #6B7280; font-size: 0.95rem; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; }
        .dest-desc { color: #4B5563; line-height: 1.6; font-size: 0.95rem; margin-bottom: 24px; flex-grow: 1; }
        
        .btn-plan { background: #10B981; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; text-align: center; transition: background 0.2s; width: 100%; }
        .btn-plan:hover { background: #059669; }

        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .logo { font-size: 1.5rem; font-weight: 700; color: #1F2937; text-decoration: none; }
        .logo span { color: #10B981; }
        .nav-links { display: flex; gap: 30px; align-items: center; }
        .nav-link { text-decoration: none; color: #4B5563; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #10B981; }
        .btn-login { background: #10B981; color: white; padding: 8px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.2s; }
        .btn-login:hover { background: #059669; }
    `;

    return (
        <div className="dest-layout">
            <style>{pageStyles}</style>

            {/* Reuse Navbar */}
            <nav className="navbar">
                <a href="/" className="logo">🌿 Suranga<span>Tours</span></a>
                <div className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/destinations" className="nav-link" style={{ color: '#10B981' }}>Destinations</a>
                    <a href="/login" className="btn-login">Partner Login</a>
                </div>
            </nav>

            <div className="hero">
                <h1>Explore Sri Lanka</h1>
                <p>Discover breathtaking landscapes, historic ruins, and golden beaches. Plan your perfect journey today.</p>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Search destinations by name or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>Loading amazing places...</div>
            ) : (
                <div className="dest-grid">
                    {filteredDestinations.length > 0 ? filteredDestinations.map(dest => (
                        <div className="dest-card" key={dest.id}>
                            <div className="dest-img-container">
                                {dest.lat && dest.lng ? (
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${dest.lat},${dest.lng}&z=13&output=embed`}
                                        title={`${dest.name} Map`}
                                        loading="lazy"
                                    ></iframe>
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', background: '#F3F4F6' }}>
                                        No map data available
                                    </div>
                                )}
                                <div className="category-badge">{dest.category}</div>
                            </div>
                            <div className="dest-content">
                                <h3 className="dest-title">{dest.name}</h3>
                                <div className="dest-district">📍 {dest.district}</div>
                                <p className="dest-desc">{dest.description || 'No description provided.'}</p>
                                <button className="btn-plan" onClick={() => navigate('/login')}>Add to Trip Plan</button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', color: '#6B7280' }}>
                            We couldn't find any destinations matching your filters.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DestinationsPage;
