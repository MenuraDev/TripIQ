// client\src\pages\HomePage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageToggle from '../components/PageToggle';

const NAV_LINKS = ["Vehicles", "About", "Reviews", "Contact"];

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Smart Itinerary",
    desc: "Automatically generate personalized travel plans based on your interests, budget, and time.",
    color: "#e8f5e9",
  },
  {
    icon: "🚗",
    title: "Vehicle Booking",
    desc: "Book cars, vans, or minibuses easily from trusted local professional drivers.",
    color: "#f1f8e9",
  },
  {
    icon: "💰",
    title: "Cost Optimization",
    desc: "AI suggests the best travel plan within your budget — no surprises.",
    color: "#e8f5e9",
  },
  {
    icon: "🗺️",
    title: "All-in-One Platform",
    desc: "No need for multiple websites. Plan, book, and explore from one place.",
    color: "#f1f8e9",
  },
  {
    icon: "🤝",
    title: "Local Driver Support",
    desc: "Connect tourists with registered, verified Sri Lankan drivers you can trust.",
    color: "#e8f5e9",
  },
  {
    icon: "⚡",
    title: "Instant Confirmation",
    desc: "Get real-time booking confirmations and live itinerary updates on the go.",
    color: "#f1f8e9",
  },
];

const STEPS = [
  { num: "01", title: "Enter Preferences", desc: "Tell us your travel dates, interests, and budget." },
  { num: "02", title: "AI Generates Itinerary", desc: "Our AI crafts a personalized day-by-day plan for you." },
  { num: "03", title: "Choose Vehicle", desc: "Pick from a fleet of verified vehicles that suit your group." },
  { num: "04", title: "Confirm Booking", desc: "Secure your trip instantly with easy online payment." },
  { num: "05", title: "Enjoy Your Trip", desc: "Travel stress-free with your driver and optimized route." },
];

const BENEFITS = [
  { icon: "⏱️", text: "Saves valuable planning time" },
  { icon: "✨", text: "Personalized travel experience" },
  { icon: "💵", text: "Budget-friendly AI suggestions" },
  { icon: "🛡️", text: "Reliable local transport" },
  { icon: "📱", text: "Easy planning process" },
  { icon: "🌿", text: "Supports Sri Lanka tourism" },
];

const HERO_IMAGES = [
  { url: "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2lnaXJpeWF8ZW58MHx8MHx8fDA%3D", title: "Sigiriya Rock Fortress", desc: "Ancient Wonder of the World" },
  { url: "https://images.unsplash.com/photo-1578519050142-afb511e518de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmluZSUyMGFyY2glMjBicmlkZ2V8ZW58MHx8MHx8fDA%3D", title: "Nine Arch Bridge", desc: "Ella's iconic railway crossing" },
  { url: "https://images.unsplash.com/photo-1654561773591-57b9413c45c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FsbGUlMjBmb3J0fGVufDB8fDB8fHww", title: "Galle Fort", desc: "Pristine beaches & whale watching" },
  { url: "https://images.unsplash.com/photo-1636966542391-8dd8a91f1390?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHlhbGF8ZW58MHx8MHx8fDA%3D", title: "Yala National Park", desc: "Unforgettable wildlife safaris" },
];

function FloatingHeroImages() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "550px", height: "600px", margin: "0 auto" }}>
      {/* Main Image (Right) */}
      <div style={{
        position: "absolute",
        right: "0",
        top: "10%",
        width: "60%",
        height: "75%",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 24px 48px rgba(26,107,46,0.15)",
        zIndex: 2,
        border: "4px solid #ffffff",
        animation: "floatA 6s ease-in-out infinite"
      }}>
        <img src={HERO_IMAGES[0].url} alt={HERO_IMAGES[0].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Second Image (Bottom Left) */}
      <div style={{
        position: "absolute",
        left: "0",
        bottom: "5%",
        width: "55%",
        height: "45%",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
        zIndex: 3,
        border: "4px solid #ffffff",
        animation: "floatB 7s ease-in-out infinite"
      }}>
        <img src={HERO_IMAGES[1].url} alt={HERO_IMAGES[1].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Third Image (Top Left) */}
      <div style={{
        position: "absolute",
        left: "10%",
        top: "0",
        width: "45%",
        height: "35%",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
        zIndex: 1,
        border: "4px solid #ffffff",
        animation: "floatC 8s ease-in-out infinite"
      }}>
        <img src={HERO_IMAGES[2].url} alt={HERO_IMAGES[2].title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }} />
      </div>


      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

function StarRating({ count }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

function useScrollAnimation() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function AnimatedSection({ children, delay = 0, style = {} }) {
  const [ref, visible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      style={{
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [publicReviews, setPublicReviews] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [fleetVehicles, setFleetVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load Public Reviews
    fetch('http://localhost:5000/api/reviews/public')
      .then(res => res.json())
      .then(data => setPublicReviews(Array.isArray(data) ? data : []))
      .catch(console.error);

    // Load Fleet Vehicles from Database
    fetch('http://localhost:5000/api/vehicles/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Transform API data to match UI format
          const transformedVehicles = data.map(vehicle => ({
            id: vehicle.id,
            name: vehicle.type,
            seats: `${vehicle.capacity} passengers`,
            image: vehicle.image_url ? `http://localhost:5000${vehicle.image_url}` : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=60",
            features: [
              vehicle.condition || "Good Condition",
              "AC",
              "GPS Navigation"
            ],
            price: `$${vehicle.price_per_day}/day`,
            badge: vehicle.status === 'active' ? 'Available' : 'Unavailable'
          }));
          setFleetVehicles(transformedVehicles);
        }
        setLoadingVehicles(false);
      })
      .catch(err => {
        console.error('Error fetching vehicles:', err);
        setLoadingVehicles(false);
      });
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'admin': return "/admin-dashboard";
      case 'driver': return "/driver-dashboard";
      case 'tourist': return "/user-dashboard";
      default: return "/user-dashboard";
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#fff", color: "#1a2e1a", overflowX: "hidden", animation: "blurredSlideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes blurredSlideInLeft {
          0% { opacity: 0; transform: translateX(-80px); filter: blur(12px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, .display { font-family: 'DM Sans', sans-serif; }
        .btn-primary {
          background: linear-gradient(135deg, #1a6b2e, #2d9e4f);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(26,107,46,0.3);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(26,107,46,0.4); }
        .btn-outline {
          background: transparent;
          color: #1a6b2e;
          border: 2px solid #1a6b2e;
          padding: 12px 30px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
        }
        .btn-outline:hover { background: #1a6b2e; color: white; transform: translateY(-2px); }
        .card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          border: 1px solid #f0f7f0;
        }
        .card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(26,107,46,0.12); }
        .section-tag {
          display: inline-block;
          background: #e8f5e9;
          color: #1a6b2e;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 16px;
          font-family: 'DM Sans', sans-serif;
        }
        .steps-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .steps-container {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 32px;
          }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0f7f0; }
        ::-webkit-scrollbar-thumb { background: #2d9e4f; border-radius: 3px; }
        a { text-decoration: none; }
        .profile-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
          width: 240px;
          padding: 12px;
          z-index: 2000;
          animation: slideDown 0.3s ease;
          border: 1px solid #e8f5e9;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #1a2e1a;
          font-size: 14.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dropdown-item:hover { background: #f0f7f0; color: #1a6b2e; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.4s ease",
        padding: "0 5%",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => navigate(user ? getDashboardPath() : '/')}
          >
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1a6b2e, #2d9e4f)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a2e1a" }}>
              Suranga<span style={{ color: "#2d9e4f" }}>Tours</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {user && <PageToggle />}
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 500, color: scrolled ? "#1a2e1a" : "#1a2e1a", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#2d9e4f"}
                onMouseLeave={e => e.target.style.color = "#1a2e1a"}
              >{l}</button>
            ))}
            {user ? (
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <img
                    src={user.profile_image ? `http://localhost:5000${user.profile_image}` : "https://ui-avatars.com/api/?name=" + (user.name || user.username || 'U') + "&background=1a6b2e&color=fff"}
                    alt="Profile"
                    style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 4px 12px rgba(26,107,46,0.15)", cursor: "pointer" }}
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  />
                  {profileDropdownOpen && (
                    <div className="profile-dropdown">
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f7f0", marginBottom: "8px" }}>
                        <div style={{ fontWeight: 700, fontSize: "15px", color: "#0f2318" }}>{user.name || user.username}</div>
                        <div style={{ fontSize: "12px", color: "#6b8f6b" }}>{user.role}</div>
                      </div>
                      <div className="dropdown-item" onClick={() => { setProfileDropdownOpen(false); navigate(getDashboardPath(), { state: { activeTab: 'Profile' } }); }}>
                        <span className="material-symbols-outlined">person</span> Profile
                      </div>
                      <div className="dropdown-item" onClick={() => { setProfileDropdownOpen(false); navigate(getDashboardPath()); }}>
                        <span className="material-symbols-outlined">settings</span> Dashboard
                      </div>
                      <div className="dropdown-item" style={{ color: "#ef4444" }} onClick={handleLogout}>
                        <span className="material-symbols-outlined">logout</span> Logout
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="btn-outline" style={{ padding: "8px 20px" }}>Login</button>
                <button onClick={() => navigate("/register")} className="btn-primary" style={{ padding: "9px 22px" }}>Sign Up</button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 24, color: "#1a2e1a" }} id="hamburger">☰</button>
        </div>

        {menuOpen && (
          <div style={{ background: "white", padding: "16px 5%", borderTop: "1px solid #e8f5e9", display: "flex", flexDirection: "column", gap: 12 }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 500, textAlign: "left", color: "#1a2e1a", fontFamily: "'DM Sans', sans-serif", padding: "4px 0" }}>{l}</button>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {user ? (
                <button onClick={() => navigate(getDashboardPath())} className="btn-primary" style={{ width: "100%" }}>Go to Dashboard</button>
              ) : (
                <>
                  <button onClick={() => navigate("/login")} className="btn-outline">Login</button>
                  <button onClick={() => navigate("/register")} className="btn-primary">Sign Up</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f0faf2 0%, #e8f5e9 40%, #f9fff9 100%)",
        display: "flex", alignItems: "center",
        padding: "100px 5% 60px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative elements */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,158,79,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,107,46,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />


        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e8f5e9", border: "1px solid #c8e6c9", padding: "8px 18px", borderRadius: 50, marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2d9e4f", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a6b2e", fontFamily: "'DM Sans', sans-serif" }}>AI-Powered Travel Platform</span>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }`}</style>

            <h1 style={{ fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 900, lineHeight: 1.1, color: "#0f2318", marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>
              Plan Your Perfect<br />
              <span style={{ color: "#2d9e4f", fontStyle: "italic" }}>Sri Lanka</span> Trip<br />
              with AI
            </h1>
            <p style={{ fontSize: 18, color: "#4a6b4a", lineHeight: 1.7, marginBottom: 36, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, maxWidth: 480 }}>
              AI-powered travel itinerary generator with smart vehicle booking and cost optimization — all in one beautiful platform.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => navigate("/register")} className="btn-primary" style={{ fontSize: 16, padding: "15px 36px" }}>Start Planning →</button>
              <button onClick={() => scrollTo("features")} className="btn-outline" style={{ fontSize: 16, padding: "13px 34px" }}>Explore Features</button>
            </div>

            <div style={{ display: "flex", gap: 32, marginTop: 44, paddingTop: 36, borderTop: "1px solid #d4edda" }}>
              {[["5,000+", "Happy Travelers"], ["200+", "Local Drivers"], ["98%", "Satisfaction Rate"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#1a6b2e", fontFamily: "'Playfair Display', serif" }}>{num}</div>
                  <div style={{ fontSize: 13, color: "#6b8f6b", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <FloatingHeroImages />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimatedSection style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">Features</div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: "#0f2318", lineHeight: 1.2 }}>
              Everything You Need for<br />
              <span style={{ color: "#2d9e4f", fontStyle: "italic" }}>Seamless Travel</span>
            </h2>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 80}>
                <div className="card" style={{ background: f.color, border: "none" }}>
                  <div style={{ width: 52, height: 52, background: "white", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>{f.icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f2318", marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>{f.title}</h3>
                  <p style={{ fontSize: 14.5, color: "#4a6b4a", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 5%", background: "linear-gradient(160deg, #f0faf2, #f9fff9)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-tag">Process</div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: "#0f2318", lineHeight: 1.2 }}>
              How It <span style={{ color: "#2d9e4f", fontStyle: "italic" }}>Works</span>
            </h2>
            <p style={{ fontSize: 17, color: "#4a6b4a", marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              Plan your entire trip in just five simple steps
            </p>
          </AnimatedSection>

          <div style={{ position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 40, left: "calc(10% + 28px)", right: "calc(10% + 28px)", height: 2, background: "linear-gradient(90deg, #2d9e4f, #c8e6c9)", display: "none" }} />

            <div className="steps-container">
              {STEPS.map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 100}>
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #1a6b2e, #2d9e4f)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: "0 8px 24px rgba(26,107,46,0.25)" }}>
                        <span style={{ color: "white", fontSize: 22, fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>{step.num}</span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f2318", marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
                    <p style={{ fontSize: 14.5, color: "#4a6b4a", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, maxWidth: "280px", margin: "0 auto" }}>{step.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ padding: "100px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <AnimatedSection>
            <div className="section-tag">Why CeylonAI</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: "#0f2318", lineHeight: 1.2, marginBottom: 20 }}>
              Travel Smarter,<br />
              <span style={{ color: "#2d9e4f", fontStyle: "italic" }}>Not Harder</span>
            </h2>
            <p style={{ fontSize: 16, color: "#4a6b4a", lineHeight: 1.7, marginBottom: 32, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              CeylonAI is built specifically for Sri Lanka travel — combining local expertise with cutting-edge AI to deliver an unmatched planning experience.
            </p>
            <button onClick={() => navigate("/register")} className="btn-primary">Get Started Free →</button>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {BENEFITS.map((b, i) => (
              <AnimatedSection key={b.text} delay={i * 80}>
                <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "20px" }}>
                  <div style={{ width: 40, height: 40, background: "#e8f5e9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{b.icon}</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#1a2e1a", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{b.text}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section id="vehicles" style={{ padding: "100px 5%", background: "#f9fff9", color: "#0f2318" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimatedSection style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">Fleet</div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: "#0f2318", lineHeight: 1.2 }}>
              Your Island <span style={{ color: "#2d9e4f", fontStyle: "italic" }}>Fleet</span>
            </h2>
            <p style={{ fontSize: 17, color: "#4a6b4a", marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              Every booking includes a verified professional driver and 24/7 roadside assistance.
            </p>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {loadingVehicles ? (
              // Loading state
              [1, 2, 3].map((n) => (
                <AnimatedSection key={n} delay={n * 80}>
                  <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", border: "1px solid #e8f5e9" }}>
                    <div style={{ position: "relative", height: 200, overflow: "hidden", background: "#f0f7f0" }}></div>
                    <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ height: 24, background: "#f0f7f0", borderRadius: 4, marginBottom: 16 }}></div>
                      <div style={{ height: 16, background: "#f0f7f0", borderRadius: 4, marginBottom: 24, width: "60%" }}></div>
                      <div style={{ flex: 1 }}></div>
                      <div style={{ paddingTop: 24, marginTop: 24, borderTop: "1px solid #f0f7f0" }}>
                        <div style={{ height: 20, background: "#f0f7f0", borderRadius: 4, width: "40%" }}></div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))
            ) : fleetVehicles.length > 0 ? (
              // Display vehicles from database
              fleetVehicles.map((v, i) => (
                <AnimatedSection key={v.id || v.name} delay={i * 80}>
                  <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", border: "1px solid #e8f5e9", maxWidth: 400, margin: "0 auto", width: "100%" }}>
                    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                      <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      />
                      <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(4px)", padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700, color: "#1a6b2e", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>{v.badge}</div>
                    </div>

                    <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: "#0f2318", margin: 0, fontFamily: "'Playfair Display', serif" }}>{v.name}</h3>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6b8f6b", fontSize: 14, marginBottom: 24, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                        <span style={{ fontSize: 16 }}>👥</span> {v.seats}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                        {v.features.map(feat => (
                          <div key={feat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ color: "#2d9e4f", fontSize: 14, fontWeight: 900 }}>✓</span>
                            <span style={{ fontSize: 14.5, color: "#4a6b4a", fontFamily: "'DM Sans', sans-serif" }}>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 24, marginTop: 24, borderTop: "1px solid #f0f7f0" }}>
                        <div>
                          <div style={{ fontSize: 12, color: "#6b8f6b", fontFamily: "'DM Sans', sans-serif", marginBottom: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>Starting at</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#1a6b2e", fontFamily: "'DM Sans', sans-serif" }}>{v.price}</div>
                        </div>
                        <button onClick={() => navigate("/login")} className="btn-primary" style={{ padding: "12px 24px", fontSize: 14.5 }}>Book Now</button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))
            ) : (
              // No vehicles fallback
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}>
                <p style={{ fontSize: 18, color: "#6b8f6b", fontFamily: "'DM Sans', sans-serif" }}>No vehicles available at the moment. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: "100px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimatedSection style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag">Reviews</div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, color: "#0f2318", lineHeight: 1.2 }}>
              Loved by <span style={{ color: "#2d9e4f", fontStyle: "italic" }}>Travelers</span> Worldwide
            </h2>
          </AnimatedSection>
          <div className="reviews-carousel-wrapper" style={{ overflow: "hidden", outline: "none", cursor: "grab" }}>
            <div className="reviews-carousel" style={{ display: "flex", gap: "24px", paddingBottom: "24px", animation: publicReviews.length > 3 ? "scrollReviews 30s linear infinite" : "none" }}>
              {publicReviews.length > 0 ? (
                // Duplicate reviews to create endless looping effect if we have more than 3
                [...publicReviews, ...(publicReviews.length > 3 ? publicReviews : [])].map((r, i) => (
                  <AnimatedSection key={`${r.id}-${i}`} delay={(i % publicReviews.length) * 80} style={{ flexShrink: 0, width: "320px" }}>
                    <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "32px", boxSizing: "border-box" }}>
                      <StarRating count={r.rating} />
                      <p style={{ fontSize: 15, color: "#4a6b4a", lineHeight: 1.7, margin: "24px 0", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, flex: 1, fontStyle: "italic" }}>"{r.comment}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #f0f7f0", paddingTop: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #1a6b2e, #2d9e4f)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
                          {r.User?.profile_image ? (
                            <img src={`http://localhost:5000${r.User.profile_image}`} alt={r.User.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            r.User?.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#0f2318", fontFamily: "'DM Sans', sans-serif" }}>{r.User?.name || 'Tourist'}</div>
                          <div style={{ fontSize: 12, color: "#6b8f6b", fontFamily: "'DM Sans', sans-serif" }}>Verified Traveler</div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))
              ) : (
                <div style={{ width: "100%", textAlign: "center", padding: "40px", color: "#6b8f6b" }}>
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
          <style>{`
            @keyframes scrollReviews {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-344px * ${publicReviews.length})); /* 320px width + 24px gap */ }
            }
            .reviews-carousel:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 5%", background: "linear-gradient(135deg, #e8f5e9 0%, #d4edda 50%, #c8e6c9 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(45,158,79,0.1) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(26,107,46,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <AnimatedSection style={{ position: "relative", zIndex: 1 }}>
          <div className="section-tag">Get Started</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, color: "#0f2318", lineHeight: 1.15, marginBottom: 20 }}>
            Start Your Smart<br />
            <span style={{ color: "#1a6b2e", fontStyle: "italic" }}>Journey Today</span>
          </h2>
          <p style={{ fontSize: 18, color: "#4a6b4a", marginBottom: 40, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, maxWidth: 480, margin: "0 auto 40px" }}>
            Plan your Sri Lanka trip in minutes using AI. Free to start, no credit card required.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} className="btn-primary" style={{ fontSize: 17, padding: "16px 44px" }}>Start Free →</button>
            <button onClick={() => scrollTo("home")} className="btn-outline" style={{ fontSize: 17, padding: "14px 42px" }}>View Demo</button>
          </div>
          <p style={{ fontSize: 13, color: "#6b8f6b", marginTop: 20, fontFamily: "'DM Sans', sans-serif" }}>✓ Free plan available &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Setup in 2 minutes</p>
        </AnimatedSection>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{ background: "#0a1a0f", color: "rgba(255,255,255,0.7)", padding: "60px 5% 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1a6b2e, #2d9e4f)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "white" }}>Suranga<span style={{ color: "#52c374" }}>Tours</span></span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                The smartest way to plan your Sri Lanka adventure — powered by AI, loved by travelers worldwide.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {["𝕏", "📘", "📸", "▶️"].map((icon, i) => (
                  <div key={i} style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(45,158,79,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  >{icon}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
              { title: "Support", links: ["Contact", "Help Center", "Privacy Policy", "Terms"] },
              { title: "Explore", links: ["Destinations", "Vehicle Fleet", "AI Planner", "Pricing"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: "white", fontWeight: 600, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{col.title}</h4>
                {col.links.map(link => (
                  <div key={link} style={{ marginBottom: 10 }}>
                    <button type="button" onClick={() => scrollTo(link.toLowerCase())} style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      onMouseEnter={e => e.target.style.color = "#52c374"}
                      onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                    >{link}</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>© 2025 SurangaTours. All rights reserved. Made with 💚 for Sri Lanka.</p>
            <p style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>🌿 Supporting sustainable tourism in Sri Lanka</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#1a6b2e',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(26, 107, 46, 0.3)',
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          pointerEvents: scrolled ? 'auto' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 999
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>arrow_upward</span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #hamburger { display: block !important; }
          section > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 40px !important; }
          footer > div > div[style*="grid-template-columns"] { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          footer > div > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
