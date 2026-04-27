// client\src\pages\user\UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageToggle from '../../components/PageToggle';
import MLBookingWorkflow from '../../components/MLBookingWorkflow';

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
  
  @keyframes blurredSlideInRight {
    0% { opacity: 0; transform: translateX(80px); filter: blur(12px); }
    100% { opacity: 1; transform: translateX(0); filter: blur(0); }
  }

  .blurred-slide-in-right {
    animation: blurredSlideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  :root {
    --primary: #1a6b2e;
    --on-primary: #ffffff;
    --primary-container: #2d9e4f;
    --secondary: #2d9e4f;
    --secondary-container: #e8f5e9;
    --tertiary: #7b5500;
    --tertiary-fixed: #ffdeac;
    --surface: #f8fbf8;
    --on-surface: #1a2e1a;
    --surface-container: #f0f7f0;
    --surface-container-low: #f4f9f4;
    --surface-container-lowest: #ffffff;
    --surface-container-high: #e8f2e8;
    --outline-variant: rgba(26, 107, 46, 0.15);
  }

  .dash-container {
    display: flex;
    min-height: 100vh;
    background: var(--surface);
    font-family: 'Inter', sans-serif;
    color: var(--on-surface);
  }

  /* Sidebar Styles */
  .sidebar {
    width: 260px;
    background: white;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    box-shadow: 24px 0 48px rgba(23, 28, 29, 0.04);
    position: sticky;
    top: 0;
    height: 100dvh;
    min-height: 100vh;
    z-index: 50;
    overflow-x: hidden;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .sidebar.collapsed {
    width: 56px;
    padding: 16px 4px;
  }
  
  .sidebar::-webkit-scrollbar {
    display: none;
  }

  .sb-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s;
  }
  
  .sidebar.collapsed .sb-logo {
    opacity: 0;
    width: 0;
    margin: 0;
    overflow: hidden;
  }
  
  .sb-logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #1a6b2e, #2d9e4f);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(26, 107, 70, 0.15);
    flex-shrink: 0;
  }
  
  .sb-logo-text {
    font-family: 'Outfit', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #0f2318;
    letter-spacing: -0.01em;
    line-height: 1;
    transition: opacity 0.2s, width 0.2s;
    overflow: hidden;
    white-space: nowrap;
  }

  .sidebar.collapsed .sb-logo-text {
    opacity: 0;
    width: 0;
  }
  
  .sb-logo-text span {
    color: #2d9e4f;
  }
  
  .toggle-sidebar {
    background: var(--surface-container);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
    margin-left: auto;
    flex-shrink: 0;
  }

  .sidebar.collapsed .toggle-sidebar {
    margin: 0 auto;
  }
  
  .toggle-sidebar:hover {
    background: var(--surface-container-high);
    color: var(--primary);
  }
  

  .sb-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .sb-nav::-webkit-scrollbar {
    width: 0px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    color: #64748b;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
  }

  .sidebar.collapsed .nav-item {
    padding: 12px 0;
    width: 100%;
    justify-content: center;
    gap: 0;
  }

  .sidebar.collapsed .nav-item .nav-label {
    display: none;
  }

  .nav-item:hover {
    background: var(--surface-container-low);
    color: var(--on-surface);
    transform: translateX(4px);
  }
  
  .sidebar.collapsed .nav-item:hover {
    transform: scale(1.05);
  }

  .nav-item.active {
    background: rgba(0, 139, 155, 0.08);
    color: var(--primary);
    font-weight: 700;
  }

  /* Content Styles */
  .main-content {
    flex: 1;
    padding: 32px 48px;
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .welcome-title {
    font-family: 'Outfit', sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 4px;
  }

  .subheading {
    font-size: 1rem;
    color: #64748b;
    font-weight: 500;
  }

  .card-premium {
    background: linear-gradient(135deg, #1a6b2e 0%, #2d9e4f 100%);
    border-radius: 40px;
    padding: 48px;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 24px 48px rgba(26, 107, 46, 0.2);
  }

  .asymmetric-img {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 45%;
    object-fit: cover;
    border-top-left-radius: 48px;
    border-bottom-right-radius: 48px;
    opacity: 0.9;
  }

  .btn-white {
    background: white;
    color: var(--primary);
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-white:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }

  .btn-primary {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 32px;
  }

  .action-card {
    background: white;
    padding: 32px;
    border-radius: 32px;
    border: 1px solid var(--outline-variant);
    cursor: pointer;
    transition: all 0.3s;
  }

  .action-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(23, 28, 29, 0.06);
    border-color: var(--primary);
  }

  .icon-box {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 1.5rem;
  }

  .insight-bubble {
    background: var(--tertiary-fixed);
    color: var(--on-tertiary-fixed);
    padding: 32px;
    border-radius: 32px;
    position: relative;
  }

  .dest-card {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    height: 240px;
    cursor: pointer;
  }

  .dest-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  .dest-card:hover .dest-img {
    transform: scale(1.1);
  }

  .dest-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    color: white;
  }

  .trip-item {
    background: white;
    padding: 24px;
    border-radius: 32px;
    display: flex;
    align-items: center;
    gap: 24px;
    border: 1px solid var(--outline-variant);
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .trip-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(23, 28, 29, 0.04);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal-content {
    background: white;
    border-radius: 40px;
    padding: 40px;
    width: 95%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .toggle-container {
    display: flex;
    background: var(--surface-container);
    padding: 4px;
    border-radius: 50px;
    width: fit-content;
  }

  .toggle-btn {
    padding: 10px 24px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.9rem;
    transition: all 0.2s;
    background: transparent;
    color: #64748b;
  }

  .toggle-btn.active {
    background: white;
    color: var(--primary);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .glass-chip {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(8px);
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 700;
    color: white;
  }

  .vehicle-card {
    border: 2px solid transparent;
    border-radius: 24px;
    padding: 20px;
    background: var(--surface-container-low);
    cursor: pointer;
    transition: all 0.2s;
  }

  .vehicle-card:hover {
    background: var(--surface-container-high);
  }

  .vehicle-card.active {
    border-color: var(--primary);
    background: rgba(0, 139, 155, 0.05);
  }

  .step-indicator {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .step-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
    background: var(--surface-container);
    color: #64748b;
  }

  .step-dot.active {
    background: var(--primary);
    color: white;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
  }

  /* Premium Planning Layout */
  .planning-surface {
    flex: 1;
    padding: 40px;
    background: linear-gradient(135deg, #f8fbf8 0%, #e8f5e9 100%);
    min-height: 100vh;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 40px;
    padding: 48px;
    box-shadow: 0 32px 64px rgba(26, 107, 46, 0.08);
  }

  .step-header {
    margin-bottom: 48px;
  }

  .step-title {
    font-family: 'Outfit', sans-serif;
    font-size: 2.8rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: #0f2318;
    margin-bottom: 12px;
  }

  .workflow-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--outline-variant);
  }

  .place-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .recommend-card {
    background: white;
    border-radius: 32px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
  }

  .recommend-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.1);
  }

  .recommend-card.selected {
    border-color: var(--primary);
    background: var(--surface-container-low);
  }

  .selection-indicator {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.3s;
    z-index: 10;
  }

  .recommend-card.selected .selection-indicator {
    opacity: 1;
    transform: scale(1);
  }

  .input-field {
    width: 100%;
    padding: 16px 24px;
    border-radius: 16px;
    border: 2px solid var(--surface-container-high);
    background: white;
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.3s;
  }

  .input-field:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(26, 107, 46, 0.1);
  }

  .itinerary-day {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 32px;
    margin-bottom: 32px;
    position: relative;
  }

  .itinerary-day::before {
    content: '';
    position: absolute;
    left: 144px;
    top: 40px;
    bottom: -32px;
    width: 2px;
    background: var(--outline-variant);
  }

  .itinerary-day:last-child::before {
    display: none;
  }
`;

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [activeTab, setActiveTab] = useState('Overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [discoverMoreOpen, setDiscoverMoreOpen] = useState(false);
  const [tripToggle, setTripToggle] = useState('Upcoming');
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);
  const [paymentToggle, setPaymentToggle] = useState('Saved Drafts');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({ type: 'Trip', targetId: '', rating: 5, comment: '' });
  const [editingReviewId, setEditingReviewId] = useState(null);

  // AI Planning Workflow State
  const [isAiPlanningActive, setIsAiPlanningActive] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1);
  const [editingTripId, setEditingTripId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [planParams, setPlanParams] = useState({
    preferences: '',
    startDate: '',
    endDate: '',
    budget: '',
    groupSize: ''
  });
  const [step1Error, setStep1Error] = useState('');

  // Profile Management State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    dob: user.dob || '',
    profile_image: user.profile_image || ''
  });
  const [passwordFormData, setPasswordFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user.token) {
      navigate('/login');
      return;
    }

    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    // Handle deep-linking for editing trips (e.g. from Payment Center)
    const params = new URLSearchParams(location.search);
    const qEditId = params.get('editTripId');
    const qStep = params.get('step');

    const handleDeepLinkEdit = async () => {
      // We need to ensure data (trips) has been fetched or fetch the specific trip
      try {
        const res = await fetch(`http://localhost:5007/api/trips`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const allTrips = await res.json();
        const tripToEdit = allTrips.find(t => t.id === parseInt(qEditId));
        if (tripToEdit) {
          handleEditTrip(tripToEdit);
          if (qStep) setWorkflowStep(parseInt(qStep));
        }
      } catch (err) {
        console.error('Deep Link Edit Error:', err);
      }
    };

    if (qEditId) {
      handleDeepLinkEdit();
    } else {
      fetchData();
    }
  }, [location.state, location.search]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const [tripsRes, favsRes, allDestsRes, vehiclesRes, paymentsRes, reviewsRes, profileRes] = await Promise.all([
        fetch('http://localhost:5007/api/trips', { headers }),
        fetch('http://localhost:5007/api/destinations/favorites', { headers }),
        fetch('http://localhost:5007/api/destinations'),
        fetch('http://localhost:5007/api/vehicles/all'),
        fetch('http://localhost:5007/api/payments/my', { headers }),
        fetch('http://localhost:5007/api/reviews/my', { headers }),
        fetch('http://localhost:5007/api/users/profile', { headers })
      ]);

      const [tripsData, favsData, allDestsData, vehiclesData, paymentsData, reviewsData, profileData] = await Promise.all([
        tripsRes.json(),
        favsRes.json(),
        allDestsRes.json(),
        vehiclesRes.json(),
        paymentsRes.json(),
        reviewsRes.json(),
        profileRes.json()
      ]);

      if (profileRes.ok) {
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setProfileFormData({
          name: profileData.name || '',
          username: profileData.username || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          dob: profileData.dob || '',
          profile_image: profileData.profile_image || ''
        });
      }

      setTrips(Array.isArray(tripsData) ? tripsData : []);
      setFavorites(Array.isArray(favsData) ? favsData : []);
      setAllDestinations(Array.isArray(allDestsData) ? allDestsData : []);
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setPaymentHistory(Array.isArray(paymentsData) ? paymentsData : []);
      setMyReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error('Fetch Error:', err);
      // Ensure we don't leave undefined states
      setTrips([]);
      setFavorites([]);
    }
  };

  const handleToggleFavorite = async (destId) => {
    try {
      await fetch(`http://localhost:5007/api/destinations/${destId}/toggle-favorite`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Favorite Toggle Error:', err);
    }
  };

  const startNewAiPlan = () => {
    setEditingTripId(null);
    setWorkflowStep(1);
    setIsAiPlanningActive(true);
    setRecommendedPlaces([]);
    setSelectedPlaces([]);
    setItinerary(null);
    setSelectedVehicle(null);
  };

  const handleCancelTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to cancel this trip? This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5007/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to cancel trip.");
      }
    } catch (err) {
      console.error('Cancel Error:', err);
    }
  };

  const handleEditTrip = (trip) => {
    setEditingTripId(trip.id);
    setPlanParams({
      preferences: '', // Or extract from destinations if stored
      startDate: trip.start_date.split('T')[0],
      endDate: trip.end_date.split('T')[0],
      groupSize: trip.group_size,
      budget: '' // Default or extract if stored
    });
    // Set selected places from existing destinations
    if (trip.Destinations) {
      setSelectedPlaces(trip.Destinations);
    }
    // Set selected vehicle if exists
    if (trip.Booking?.Vehicle) {
      setSelectedVehicle(trip.Booking.Vehicle);
    }
    setWorkflowStep(1);
    setIsAiPlanningActive(true);
  };

  const handleRecommendPlaces = async (e) => {
    e.preventDefault();

    // Validations
    if (!planParams.preferences || planParams.preferences.trim() === '') {
      setStep1Error('Please select at least one island vibe (Beach, Mountain, Culture, Adventure).');
      return;
    }
    if (!planParams.budget || Number(planParams.budget) <= 0) {
      setStep1Error('Please enter a valid Travel Budget (LKR).');
      return;
    }
    if (!planParams.groupSize || Number(planParams.groupSize) < 1) {
      setStep1Error('Please enter a valid Travelers Count (minimum 1).');
      return;
    }
    setStep1Error('');

    setAiLoading(true);
    try {
      const diff = Math.ceil((new Date(planParams.endDate) - new Date(planParams.startDate)) / (1000 * 60 * 60 * 24)) + 1;
      const res = await fetch('http://localhost:5007/api/ai/recommend-places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...planParams,
          duration: `${diff} days`
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API Error (${res.status}): ${errText}`);
      }
      const data = await res.json();
      setRecommendedPlaces(data.places || []);
      setWorkflowStep(2);
    } catch (err) {
      console.error('Recommend Error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    if (selectedPlaces.length === 0) return;
    setAiLoading(true);
    try {
      const diff = Math.ceil((new Date(planParams.endDate) - new Date(planParams.startDate)) / (1000 * 60 * 60 * 24)) + 1;
      const res = await fetch('http://localhost:5007/api/ai/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          selectedPlaces,
          duration: diff,
          startDate: planParams.startDate
        })
      });
      const data = await res.json();
      setItinerary(data);
      setWorkflowStep(3);
    } catch (err) {
      console.error('Itinerary Error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const getAvailableVehicles = () => {
    const duration = Math.ceil((new Date(planParams.endDate) - new Date(planParams.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    // Filter by capacity and total cost (Price × Days <= Total Budget)
    return vehicles.filter(v =>
      v.status === 'active' &&
      Number(v.capacity) >= Number(planParams.groupSize) &&
      (parseFloat(v.price_per_day) * duration) <= parseFloat(planParams.budget)
    ).sort((a, b) => a.price_per_day - b.price_per_day);
  };

  useEffect(() => {
    if (workflowStep === 4) {
      const available = getAvailableVehicles();
      if (available.length > 0 && !selectedVehicle) {
        setSelectedVehicle(available[0]); // Default to cheapest matching
      }
    }
  }, [workflowStep, planParams, vehicles]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5007/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(profileFormData)
      });
      const data = await res.json();
      if (res.ok) {
        // Update local user and storage
        const updatedUser = { ...user, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
        setIsEditingProfile(false);
        fetchData();
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update Error:', err);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await fetch('http://localhost:5007/api/upload/profile', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setProfileFormData({ ...profileFormData, profile_image: data.imageUrl });
        // Also update immediately if not in edit mode
        if (!isEditingProfile) {
          await fetch('http://localhost:5007/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({ profile_image: data.imageUrl })
          });
          fetchData();
        }
      }
    } catch (err) {
      console.error('Upload Error:', err);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1;

    if (score <= 2) return { label: 'Weak', color: '#ef4444' };
    if (score === 3) return { label: 'Good', color: '#f59e0b' };
    return { label: 'Strong', color: '#10b981' };
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const pwd = passwordFormData.newPassword;
    
    if (pwd.length < 8) return alert("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(pwd)) return alert("Password must contain at least 1 capital letter");
    if (!/[0-9]/.test(pwd)) return alert("Password must contain at least 1 number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return alert("Password must contain at least 1 special character");
    if (pwd !== passwordFormData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('http://localhost:5007/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ password: passwordFormData.newPassword })
      });
      if (res.ok) {
        alert('Password changed successfully!');
        setPasswordFormData({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error('Password Change Error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("CRITICAL: Are you sure you want to delete your SurangaTours account? This cannot be undone.")) return;
    try {
      const res = await fetch('http://localhost:5007/api/users/profile', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  const handleConfirmBooking = async () => {
    setAiLoading(true);
    try {
      // 1. Create or Update Trip
      const destinations = selectedPlaces.map((p, idx) => ({
        destination_id: p.id,
        name: p.name,
        day_number: Math.floor(idx / 2) + 1,
        visit_order: idx + 1
      })).filter(p => p.destination_id);

      const tripUrl = editingTripId ? `http://localhost:5007/api/trips/${editingTripId}` : 'http://localhost:5007/api/trips';
      const tripRes = await fetch(tripUrl, {
        method: editingTripId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          start_date: planParams.startDate,
          end_date: planParams.endDate,
          group_size: planParams.groupSize,
          destinations,
          status: editingTripId ? 'planned' : 'planned'
        })
      });

      if (!tripRes.ok) throw new Error('Failed to save trip');

      const savedTrip = await tripRes.json();

      // 2. Create Booking (If new or needed)
      if (selectedVehicle && !editingTripId) {
        await fetch('http://localhost:5007/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            trip_id: savedTrip.id,
            vehicle_id: selectedVehicle.id
          })
        });
      }

      setEditingTripId(null);

      setIsAiPlanningActive(false);
      fetchData();
      setActiveTab('My Trips');
    } catch (err) {
      console.error('Confirm Error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteDraft = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment draft?")) return;
    try {
      const res = await fetch(`http://localhost:5007/api/payments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setPaymentHistory(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete draft.");
      }
    } catch (err) {
      console.error('Delete Draft Error:', err);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const res = await fetch('http://localhost:5007/api/reviews/my', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) setMyReviews(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        rating: reviewFormData.rating,
        comment: reviewFormData.comment,
        trip_id: reviewFormData.type === 'Trip' ? reviewFormData.targetId : null,
        driver_id: reviewFormData.type === 'Driver' ? reviewFormData.targetId : null,
        destination_id: reviewFormData.type === 'Destination' ? reviewFormData.targetId : null
      };

      const url = editingReviewId
        ? `http://localhost:5007/api/reviews/${editingReviewId}`
        : 'http://localhost:5007/api/reviews';
      const method = editingReviewId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsReviewModalOpen(false);
        setReviewFormData({ type: 'Trip', targetId: '', rating: 5, comment: '' });
        setEditingReviewId(null);
        fetchMyReviews();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`http://localhost:5007/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) fetchMyReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditReview = (review) => {
    const isDriver = !!review.driver_id;
    setReviewFormData({
      type: isDriver ? 'Driver' : 'Trip',
      targetId: isDriver ? review.driver_id : review.trip_id,
      rating: review.rating,
      comment: review.comment || ''
    });
    setEditingReviewId(review.id);
    setIsReviewModalOpen(true);
  };


  const upcomingTrips = Array.isArray(trips) ? trips.filter(t => new Date(t.end_date) >= new Date()) : [];
  const pastTrips = Array.isArray(trips) ? trips.filter(t => new Date(t.end_date) < new Date()) : [];
  const filteredVehicles = Array.isArray(vehicles) ? vehicles.filter(v => v.capacity >= planParams.groupSize) : [];

  const renderSidebar = () => (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%', marginBottom: '8px' }}>
        <div className="sb-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="sb-logo-icon">🌿</div>
          <div className="sb-logo-text">Suranga<span>Tours</span></div>
        </div>
        <button className="toggle-sidebar" onClick={() => setIsCollapsed(!isCollapsed)}>
          <span className="material-symbols-outlined" style={{ fontSize: isCollapsed ? '18px' : '20px' }}>{isCollapsed ? 'menu' : 'menu_open'}</span>
        </button>
      </div>

      <nav className="sb-nav">
        {[
          { icon: 'dashboard', label: 'Dashboard', id: 'Overview' },
          { icon: 'explore', label: 'My Trips', id: 'My Trips' },
          { icon: 'favorite', label: 'Saved Destinations', id: 'Saved Destinations' },

          { icon: 'payments', label: 'Payments', id: 'Payments' },
          { icon: 'reviews', label: 'Reviews', id: 'Reviews' }
        ].map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(item.id); setIsAiPlanningActive(false); }}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ paddingTop: '20px', borderTop: '1px solid var(--surface-container)' }}>
        <button
          className="btn-primary"
          style={{
            width: '100%',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #1a6b2e, #2d9e4f)',
            padding: isCollapsed ? '12px 0' : '12px 16px',
            borderRadius: isCollapsed ? '12px' : '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isCollapsed ? '0' : '8px',
            border: 'none',
            color: 'white',
            boxShadow: '0 8px 16px rgba(26, 107, 46, 0.15)'
          }}
          onClick={startNewAiPlan}
        >
          <span className="material-symbols-outlined">auto_awesome</span>
          {!isCollapsed && "New AI Plan"}
        </button>
        <div
          className="nav-item"
          onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}
        >
          <span className="material-symbols-outlined">logout</span>
          {!isCollapsed && "Logout"}
        </div>
      </div>
    </aside>
  );

  const renderDashboard = () => (
    <div className="main-content">
      <header className="header">
        <div>
          <h1 className="welcome-title">Welcome Back, {user.name?.split(' ')[0]}!</h1>
          <p className="subheading">Your tropical adventure awaits in the beautiful island of Sri Lanka.</p>
        </div>
      </header>

      {upcomingTrips.length > 0 ? (
        <section className="card-premium">
          <div style={{ maxWidth: '52%', position: 'relative', zIndex: 10 }}>
            <span className="glass-chip">Ongoing Adventure</span>
            <h3 style={{ fontSize: '3.5rem', fontWeight: 700, margin: '24px 0', lineHeight: 1 }}>
              {upcomingTrips[0].Destinations?.[0]?.name || 'Island Getaway'}
            </h3>
            <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined">event</span>
                {new Date(upcomingTrips[0].start_date).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined">explore</span>
                {upcomingTrips[0].Destinations?.length} Stops
              </div>
            </div>
            <button className="btn-white" onClick={() => setActiveTab('My Trips')}>View My Route</button>
          </div>
          <img
            src={upcomingTrips[0].Destinations?.[0]?.image_url ? `http://localhost:5007${upcomingTrips[0].Destinations[0].image_url}` : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop"}
            className="asymmetric-img"
            alt="Trip"
          />
        </section>
      ) : (
        <section className="card-premium">
          <div style={{ maxWidth: '50%', position: 'relative', zIndex: 10 }}>
            <span className="glass-chip">Start Exploring</span>
            <h3 style={{ fontSize: '3.5rem', fontWeight: 700, margin: '24px 0', lineHeight: 1 }}>
              Dream of <br /> Ceylon
            </h3>
            <p style={{ marginBottom: '32px', opacity: 0.9, fontSize: '1.1rem' }}>Let AI curate a seamless itinerary for your first escape.</p>
            <button className="btn-white" onClick={startNewAiPlan}>✦ Generate AI Plan</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1552423158-7681720f4f9a?w=800&auto=format&fit=crop"
            className="asymmetric-img"
            alt="Default"
          />
        </section>
      )}


    </div>
  );

  const renderMyTrips = () => {
    const list = tripToggle === 'Upcoming' ? upcomingTrips : pastTrips;
    return (
      <div className="main-content">
        <header className="header">
          <div>
            <h1 className="welcome-title">My Trips</h1>
            <p className="subheading">Your island journey history and upcoming plans.</p>
          </div>
          <div className="toggle-container">
            <button
              className={`toggle-btn ${tripToggle === 'Upcoming' ? 'active' : ''}`}
              onClick={() => setTripToggle('Upcoming')}
            >Upcoming</button>
            <button
              className={`toggle-btn ${tripToggle === 'Past' ? 'active' : ''}`}
              onClick={() => setTripToggle('Past')}
            >Archive</button>
          </div>
        </header>

        <div>
          {list.length > 0 ? list.map(trip => (
            <div key={trip.id} className="trip-item" onClick={() => setSelectedTripDetails(trip)} style={{ cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '1.4rem' }}>
                    {trip.Destinations?.[0]?.name || 'Island Route'}
                    {trip.Destinations?.length > 1 && <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}> + {trip.Destinations.length - 1} more</span>}
                  </h4>
                  <span style={{
                    background: trip.status === 'confirmed' ? 'rgba(27,109,36,0.1)' : 'var(--surface-container)',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: trip.status === 'confirmed' ? 'var(--secondary)' : '#64748b'
                  }}>
                    {trip.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '24px', color: '#64748b', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_today</span>
                    {new Date(trip.start_date).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>group</span>
                    {trip.group_size} Travelers
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {trip.status !== 'paid' && (
                  <button
                    className="btn-white"
                    style={{ border: '1px solid var(--surface-container-high)', padding: '10px 16px' }}
                    onClick={(e) => { e.stopPropagation(); handleEditTrip(trip); }}
                    title="Edit Trip"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                  </button>
                )}
                <button
                  className="btn-white"
                  style={{ border: '1px solid var(--surface-container-high)', color: '#ef4444', padding: '10px 16px' }}
                  onClick={(e) => { e.stopPropagation(); handleCancelTrip(trip.id); }}
                  title="Cancel Trip"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_forever</span>
                </button>
                {trip.status === 'confirmed' && (!trip.Booking || !trip.Booking.Payment) && (
                  <button className="btn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/payment/${trip.Booking?.id}`); }}>Pay Now</button>
                )}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '120px', background: 'white', borderRadius: '40px', color: '#64748b' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.2 }}>map</span>
              <p style={{ fontWeight: 600 }}>No {tripToggle.toLowerCase()} journeys found.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTripDetails = () => {
    if (!selectedTripDetails) return null;
    const trip = selectedTripDetails;

    return (
      <div className="main-content">
        <header className="header" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              className="btn-white"
              onClick={() => setSelectedTripDetails(null)}
              style={{ padding: '8px', border: '1px solid var(--outline-variant)', borderRadius: '12px', display: 'flex' }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="welcome-title" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                Trip Reference: #{trip.id}
                <span className="glass-chip" style={{ fontSize: '0.8rem', background: trip.status === 'confirmed' || trip.status === 'paid' ? 'rgba(27,109,36,0.1)' : 'var(--surface-container-high)', color: trip.status === 'confirmed' || trip.status === 'paid' ? 'var(--secondary)' : '#64748b', verticalAlign: 'middle', border: 'none' }}>
                  {trip.status.toUpperCase()}
                </span>
              </h1>
              <p className="subheading" style={{ fontSize: '1rem', marginTop: '4px' }}>Review all specifics of your island itinerary.</p>
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Overview / Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid var(--outline-variant)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Start Date</div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{new Date(trip.start_date).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>End Date</div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{new Date(trip.end_date).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Travelers</div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{trip.group_size} Members</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Est. Budget</div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--primary)' }}>LKR {trip.budget?.toLocaleString() || 'Flexible'}</div>
              </div>
            </div>

            {/* Destinations */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '40px', border: '1px solid var(--outline-variant)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>map</span> Handpicked Destinations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {trip.Destinations && trip.Destinations.length > 0 ? trip.Destinations.map((dest, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '24px', borderBottom: i < trip.Destinations.length - 1 ? '1px solid var(--surface-container)' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{dest.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{dest.category} • {dest.district}</p>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: '#64748b', fontSize: '1rem' }}>No specific destinations pinned yet.</p>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>            {/* Vehicle & Allocation */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '40px', border: '1px solid var(--outline-variant)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>directions_car</span> Assigned Vehicle
              </h3>
              {trip.Booking && trip.Booking.Vehicle ? (
                <div style={{ border: '1px solid var(--surface-container)', borderRadius: '24px', padding: '16px' }}>
                  <div style={{ width: '100%', height: '140px', borderRadius: '16px', overflow: 'hidden', background: '#F3F4F6', marginBottom: '16px' }}>
                    <img src={trip.Booking.Vehicle.image_url ? `http://localhost:5007${trip.Booking.Vehicle.image_url}` : 'https://via.placeholder.com/200'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.Booking.Vehicle.type} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{trip.Booking.Vehicle.type}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Capacity: {trip.Booking.Vehicle.capacity} Passengers</p>
                </div>
              ) : (
                <div style={{ padding: '24px', background: 'var(--surface-container-low)', borderRadius: '24px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Vehicle allocation pending.</p>
                </div>
              )}
            </div>

            {/* Driver Allocation */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '40px', border: '1px solid var(--outline-variant)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>badge</span> Assigned Driver
              </h3>
              {trip.Booking && trip.Booking.Driver ? (
                <div style={{ border: '1px solid var(--surface-container)', borderRadius: '24px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>person</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{trip.Booking.Driver.name || 'Professional Driver'}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span> {trip.Booking.Driver.phone || 'Contact provided on pickup'}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '24px', background: 'var(--surface-container-low)', borderRadius: '24px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Driver allocation pending.</p>
                </div>
              )}
            </div>

            {/* Booking & Payment */}
            {trip.Booking && trip.Booking.Payment && (
              <div style={{ background: 'rgba(27,109,36,0.05)', padding: '40px', borderRadius: '40px', border: '1px solid rgba(27,109,36,0.2)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--secondary)' }}>
                  <span className="material-symbols-outlined">receipt_long</span> Settlement Status
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>Booking Ref: <span style={{ fontWeight: 600 }}>#{trip.Booking.id}</span></div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '8px' }}>LKR {trip.Booking.Payment.amount?.toLocaleString()}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PAID IN FULL</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  const renderSavedDestinations = () => (
    <div className="main-content">
      <header className="header" style={{ alignItems: 'flex-end' }}>
        <div>
          <h1 className="welcome-title">Favorites</h1>
          <p className="subheading">A curated collection of your favorite island spots.</p>
        </div>
        <button className="btn-primary" style={{ padding: '14px 32px' }} onClick={() => setDiscoverMoreOpen(true)}>Discover More</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
        {favorites.length > 0 ? favorites.map(dest => (
          <div key={dest.id} className="dest-card" style={{ height: '300px' }}>
            <img src={dest.image_url ? `http://localhost:5007${dest.image_url}` : "https://via.placeholder.com/400"} className="dest-img" alt={dest.name} />
            <div className="dest-overlay">
              <button
                onClick={() => handleToggleFavorite(dest.id)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'white', border: 'none', width: '44px', height: '44px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="material-symbols-outlined" style={{ color: '#ef4444', fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
              <h4 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '4px' }}>{dest.name}</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '16px' }}>{dest.district} • {dest.category}</p>
              <button className="btn-white" style={{ width: 'fit-content' }}>Quick Plan</button>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '120px', background: 'white', borderRadius: '40px', color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.2 }}>favorite</span>
            <p style={{ fontWeight: 600 }}>Your bucket list is empty. Start exploring!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayments = () => {
    const savedDraftsList = paymentHistory.filter(p => p.status === 'draft' || p.status === 'pending');
    const transactionHistoryList = paymentHistory.filter(p => p.status === 'completed' || p.status === 'failed');

    return (
      <div className="main-content">
        <header className="header">
          <div>
            <h1 className="welcome-title">Payments Center</h1>
            <p className="subheading">Manage your pending drafts and transaction history securely.</p>
          </div>
          <div className="toggle-container">
            <button
              className={`toggle-btn ${paymentToggle === 'Saved Drafts' ? 'active' : ''}`}
              onClick={() => setPaymentToggle('Saved Drafts')}
            >Saved Drafts</button>
            <button
              className={`toggle-btn ${paymentToggle === 'Transaction History' ? 'active' : ''}`}
              onClick={() => setPaymentToggle('Transaction History')}
            >Transaction Logs</button>
          </div>
        </header>

        {paymentToggle === 'Saved Drafts' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {savedDraftsList.length > 0 ? savedDraftsList.map(draft => (
              <div key={draft.id} style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid var(--outline-variant)', position: 'relative', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {draft.Booking?.Vehicle?.image_url ? (
                  <div style={{ height: '160px', margin: '-32px -32px 24px -32px', borderRadius: '32px 32px 0 0', overflow: 'hidden', background: '#F3F4F6', position: 'relative' }}>
                    <img src={`http://localhost:5007${draft.Booking.Vehicle.image_url}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Vehicle" />
                    <div style={{ position: 'absolute', top: '20px', left: '20px', padding: '6px 16px', background: 'rgba(254, 243, 199, 0.9)', color: '#92400E', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', backdropFilter: 'blur(4px)' }}>
                      {draft.status}
                    </div>
                    <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                      #{draft.booking_id}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ padding: '6px 16px', background: 'rgba(254, 243, 199, 0.5)', color: '#92400E', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {draft.status}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>#{draft.booking_id}</span>
                  </div>
                )}
                <h4 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '12px' }}>{draft.Booking?.Vehicle?.type || 'Trip Reservation'}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#64748b' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>event_note</span>
                  <span style={{ fontSize: '0.95rem' }}>Updated {new Date(draft.updatedAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '32px' }}>
                  LKR {draft.amount?.toLocaleString() || '0'}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, padding: '14px', fontSize: '1rem' }}
                    onClick={() => navigate(`/payment/${draft.booking_id}`)}
                  >
                    Resume Payment
                  </button>
                  <button
                    className="btn-white"
                    style={{ border: '1px solid #fecaca', color: '#ef4444', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => handleDeleteDraft(draft.id)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete_forever</span>
                  </button>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', background: 'white', borderRadius: '40px', color: '#64748b' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.2 }}>receipt_long</span>
                <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>You have no saved drafts.</p>
              </div>
            )}
          </div>
        )}

        {paymentToggle === 'Transaction History' && (
          <div style={{ background: 'white', padding: '40px', borderRadius: '40px', border: '1px solid var(--outline-variant)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', fontSize: '0.85rem', color: '#64748b', borderBottom: '2px solid var(--surface-container)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistoryList.length > 0 ? transactionHistoryList.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--surface-container)', transition: 'background 0.2s', ':hover': { background: 'var(--surface-container-lowest)' } }}>
                    <td style={{ padding: '24px', fontSize: '0.95rem', fontWeight: 500 }}>{new Date(t.updatedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '24px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>#{t.booking_id}</td>
                    <td style={{ padding: '24px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>LKR {t.amount?.toLocaleString()}</td>
                    <td style={{ padding: '24px' }}>
                      <span style={{
                        fontSize: '0.8rem', padding: '6px 16px', borderRadius: '50px',
                        background: t.status === 'completed' ? 'rgba(27,109,36,0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: t.status === 'completed' ? 'var(--secondary)' : '#ef4444',
                        fontWeight: 700, letterSpacing: '0.05em'
                      }}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontWeight: 600 }}>No transaction history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderReviews = () => (
    <div className="main-content">
      <header className="header">
        <div>
          <h1 className="welcome-title">Experiences</h1>
          <p className="subheading">Your stories and feedback from the road.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingReviewId(null);
            setReviewFormData({ type: 'Trip', targetId: '', rating: 5, comment: '' });
            setIsReviewModalOpen(true);
          }}
        >
          Write a Review
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
        {myReviews.map(review => (
          <div key={review.id} style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid var(--outline-variant)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
              <div style={{ color: 'var(--tertiary)', fontSize: '1.2rem' }}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                {review.user_id === user.id && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditReview(review)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', opacity: 0.8, transition: '0.2s', padding: '4px', borderRadius: '50%', ':hover': { opacity: 1, background: 'var(--surface-container-high)' } }} title="Edit Review">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                    <button onClick={() => handleDeleteReview(review.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#ef4444', opacity: 0.8, transition: '0.2s', padding: '4px', borderRadius: '50%', ':hover': { opacity: 1, background: 'rgba(239, 68, 68, 0.1)' } }} title="Delete Review">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>
              {review.Driver ? `Driver: ${review.Driver.name}` : review.Destination ? `Place: ${review.Destination.name}` : review.trip_id ? `Trip Code: #${review.trip_id}` : 'Island Experience'}
            </div>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, fontStyle: 'italic' }}>
              "{review.comment}"
            </p>
          </div>
        ))}
        {myReviews.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '120px', background: 'white', borderRadius: '40px', color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.1 }}>rate_review</span>
            <p style={{ fontWeight: 600 }}>You haven't shared any reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAiPlanningWorkflow = () => (
    <MLBookingWorkflow
      user={user}
      vehicles={vehicles}
      editingTrip={editingTripId ? trips.find(t => t.id === editingTripId) : null}
      onClose={() => setIsAiPlanningActive(false)}
      onConfirmed={() => { setIsAiPlanningActive(false); fetchData(); setActiveTab('My Trips'); }}
    />
  );

  const _OLD_renderAiPlanningWorkflow_DISABLED = () => (
    <div className="planning-surface">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <button
            onClick={() => setIsAiPlanningActive(false)}
            style={{ background: 'white', border: 'none', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="step-indicator" style={{ marginBottom: 0 }}>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div key={num} className={`step-dot ${workflowStep >= num ? 'active' : ''}`}>{num}</div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          {workflowStep === 1 && (
            <div className="fade-in">
              <header className="step-header">
                <h2 className="step-title">The Digital Concierge</h2>
                <p className="subheading">Set your preferences and let our AI architect your perfect escape.</p>
              </header>
              <form onSubmit={handleRecommendPlaces} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '16px', textAlign: 'center', fontSize: '1.1rem' }}>What’s your island vibe?</label>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['Beach', 'Mountain', 'Culture', 'Adventure'].map(vibe => {
                      const icons = { 'Beach': '🏖️', 'Mountain': '⛰️', 'Culture': '🛕', 'Adventure': '🧗🏽‍♂️' };
                      const isSelected = typeof planParams.preferences === 'string' && planParams.preferences.includes(vibe);
                      return (
                        <button
                          key={vibe}
                          type="button"
                          onClick={() => {
                            let currentVibes = planParams.preferences && typeof planParams.preferences === 'string'
                              ? planParams.preferences.split(',').map(v => v.trim()).filter(v => v)
                              : [];
                            if (isSelected) {
                              currentVibes = currentVibes.filter(v => v !== vibe);
                            } else {
                              currentVibes.push(vibe);
                            }
                            setPlanParams({ ...planParams, preferences: currentVibes.join(', ') });
                          }}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '50px',
                            border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--outline-variant)'}`,
                            background: isSelected ? 'rgba(27,109,36,0.1)' : 'white',
                            color: isSelected ? 'var(--primary)' : '#64748b',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '1rem'
                          }}
                        >
                          <span style={{ fontSize: '1.3rem' }}>{icons[vibe]}</span>
                          {vibe}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                    value={planParams.preferences || ''}
                    onChange={() => { }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px' }}>Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={planParams.startDate}
                    onChange={e => setPlanParams({ ...planParams, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px' }}>End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={planParams.endDate}
                    onChange={e => setPlanParams({ ...planParams, endDate: e.target.value })}
                    min={planParams.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px' }}>Travel Budget (LKR)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g., 50000"
                    min="0"
                    value={planParams.budget}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '' || Number(val) >= 0) {
                        setPlanParams({ ...planParams, budget: val });
                      }
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px' }}>Travelers Count</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g., 1"
                    min="1"
                    value={planParams.groupSize}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '' || Number(val) > 0) {
                        setPlanParams({ ...planParams, groupSize: val });
                      }
                    }}
                  />
                </div>
                <div className="workflow-nav" style={{ gridColumn: 'span 2' }}>
                  {step1Error && (
                    <div style={{ gridColumn: 'span 2', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '12px', padding: '12px 20px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                      {step1Error}
                    </div>
                  )}
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Step 1 of 6: Parameters</span>
                  <button type="submit" className="btn-primary" disabled={aiLoading} style={{ padding: '16px 48px' }}>
                    {aiLoading ? 'Analyzing...' : 'Discover Places ✦'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {workflowStep === 2 && (
            <div className="fade-in">
              <header className="step-header">
                <h2 className="step-title">Curated Selection</h2>
                <p className="subheading">Pick at least 2 places you'd love to visit. Gemini has hand-picked these for you.</p>
              </header>
              <div className="place-grid">
                {recommendedPlaces.map((place, idx) => (
                  <div
                    key={idx}
                    className={`recommend-card ${selectedPlaces.some(p => p.name === place.name) ? 'selected' : ''}`}
                    onClick={() => {
                      if (selectedPlaces.some(p => p.name === place.name)) {
                        setSelectedPlaces(selectedPlaces.filter(p => p.name !== place.name));
                      } else {
                        setSelectedPlaces([...selectedPlaces, place]);
                      }
                    }}
                  >
                    <div className="selection-indicator"><span className="material-symbols-outlined">check</span></div>
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img src={place.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>{place.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                        <span>{place.district}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>LKR {place.estimated_cost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="workflow-nav">
                <button className="btn-white" onClick={() => setWorkflowStep(1)}>Back</button>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{selectedPlaces.length} Selected • Step 2 of 6</span>
                </div>
                <button
                  className="btn-primary"
                  disabled={selectedPlaces.length < 2 || aiLoading}
                  onClick={handleGenerateItinerary}
                  style={{ padding: '16px 48px' }}
                >
                  {aiLoading ? 'Generating...' : 'Build Itinerary ✦'}
                </button>
              </div>
            </div>
          )}

          {workflowStep === 3 && itinerary && (
            <div className="fade-in">
              <header className="step-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span className="glass-chip" style={{ background: 'var(--primary)', color: 'white', marginBottom: '16px', display: 'inline-block' }}>AI Generated</span>
                <h2 className="step-title" style={{ fontSize: '3.2rem', color: '#0f2318' }}>The Master Itinerary</h2>
                <p className="subheading" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>A day-by-day architectural plan of your Sri Lankan voyage, curated just for you.</p>
              </header>

              <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f4f9f4 100%)', padding: '48px', borderRadius: '40px', marginBottom: '32px', border: '1px solid white', boxShadow: '0 24px 48px rgba(26,107,46,0.05)' }}>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '48px', background: 'var(--surface-container-lowest)', padding: '24px 32px', borderRadius: '24px', borderLeft: '4px solid var(--primary)', boxShadow: '0 8px 16px rgba(0,0,0,0.02)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--primary)' }}>format_quote</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#334155', lineHeight: 1.6, marginTop: '4px' }}>{itinerary.summary}</h3>
                </div>

                <div style={{ position: 'relative' }}>
                  {/* Custom vertical timeline line */}
                  <div style={{ position: 'absolute', left: '70px', top: '0', bottom: '0', width: '2px', background: 'linear-gradient(to bottom, var(--primary) 0%, rgba(45,158,79,0.2) 100%)', zIndex: 0 }}></div>

                  {itinerary.itinerary.map((day, idx) => (
                    <div key={day.day} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '32px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>

                      {/* Timeline Node & Date */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 8px 16px rgba(26,107,46,0.15)' }}>
                          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary)' }}>{day.day}</span>
                        </div>
                        <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', color: '#64748b', letterSpacing: '0.05em' }}>
                          Day
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginTop: '4px' }}>
                          {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {/* Day Content Card */}
                      <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid var(--surface-container)', boxShadow: '0 12px 24px rgba(23,28,29,0.03)', transition: 'all 0.3s', cursor: 'default' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        {/* Tags for Places */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                          {day.places.map((place, pIdx) => (
                            <div key={pIdx} style={{ background: 'var(--surface-container)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                              {place}
                            </div>
                          ))}
                        </div>

                        {/* Travel Time */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px dashed var(--outline-variant)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--secondary)' }}>directions_transit</span>
                          {day.travel_time}
                        </div>

                        {/* Activities */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--tertiary)' }}>
                            <span className="material-symbols-outlined">explore</span>
                          </div>
                          <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1rem', flex: 1 }}>{day.activities}</p>
                        </div>

                        {/* Budget Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <div style={{ padding: '10px 20px', background: 'var(--surface-container-low)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>payments</span>
                            Est. Daily Budget: <span style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>LKR {day.estimated_daily_cost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="workflow-nav">
                <button className="btn-white" onClick={() => setWorkflowStep(2)}>Back</button>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Step 3 of 6</span>
                </div>
                <button className="btn-primary" onClick={() => setWorkflowStep(4)} style={{ padding: '16px 48px', fontSize: '1.1rem' }}>Select Transport ➜</button>
              </div>
            </div>
          )}

          {workflowStep === 4 && (
            <div className="fade-in">
              <header className="step-header">
                <h2 className="step-title">Island Transport</h2>
                <p className="subheading">Choose from our fleet of driver-owned vehicles that fit your group and budget.</p>
              </header>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {getAvailableVehicles().map(vehicle => (
                  <div
                    key={vehicle.id}
                    className={`recommend-card ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVehicle(vehicle)}
                    style={{ padding: '24px' }}
                  >
                    <div className="selection-indicator"><span className="material-symbols-outlined">check</span></div>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <div style={{ width: '160px', height: '110px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={vehicle.image_url ? `http://localhost:5007${vehicle.image_url}` : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400"}
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
                    <p style={{ fontWeight: 600 }}>No vehicles found fitting your group size and budget ({planParams.budget} LKR).</p>
                    <button className="btn-white" onClick={() => setWorkflowStep(1)} style={{ marginTop: '16px' }}>Adjust Budget/Group</button>
                  </div>
                )}
              </div>

              {getAvailableVehicles().length > 0 && (
                <div style={{ padding: '24px', background: 'var(--tertiary-fixed)', borderRadius: '24px', color: 'var(--on-tertiary-fixed)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>info</span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>You've selected a {selectedVehicle?.type}. Total transport cost for {Math.ceil((new Date(planParams.endDate) - new Date(planParams.startDate)) / (1000 * 60 * 60 * 24)) + 1} days will be LKR {(selectedVehicle?.price_per_day * (Math.ceil((new Date(planParams.endDate) - new Date(planParams.startDate)) / (1000 * 60 * 60 * 24)) + 1)).toLocaleString()}.</p>
                </div>
              )}

              <div className="workflow-nav">
                <button className="btn-white" onClick={() => setWorkflowStep(3)}>Back</button>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Step 4 of 6</span>
                </div>
                <button className="btn-primary" disabled={!selectedVehicle} onClick={() => setWorkflowStep(5)} style={{ padding: '16px 48px' }}>Review Selections ➜</button>
              </div>
            </div>
          )}

          {workflowStep === 5 && (
            <div className="fade-in">
              <header className="step-header">
                <h2 className="step-title">Final Selection</h2>
                <p className="subheading">Review your custom-built journey before we finalize the arrangements.</p>
              </header>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>place</span> Destinations
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedPlaces.map((p, idx) => (
                      <div key={idx} style={{ padding: '16px', background: 'var(--surface-container-low)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>{p.name}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>calendar_today</span> Trip Dates
                  </h4>
                  <div style={{ padding: '24px', background: 'var(--surface-container-low)', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: '#64748b' }}>From</span>
                      <span style={{ fontWeight: 700 }}>{new Date(planParams.startDate).toDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>To</span>
                      <span style={{ fontWeight: 700 }}>{new Date(planParams.endDate).toDateString()}</span>
                    </div>
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.2rem', margin: '32px 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>directions_car</span> Vehicle
                  </h4>
                  <div style={{ padding: '24px', background: 'var(--surface-container-low)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700 }}>{selectedVehicle?.type}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>LKR {selectedVehicle?.price_per_day.toLocaleString()} / day</span>
                  </div>
                </div>
              </div>
              <div className="workflow-nav">
                <button className="btn-white" onClick={() => setWorkflowStep(4)}>Back</button>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Step 5 of 6</span>
                </div>
                <button className="btn-primary" onClick={() => setWorkflowStep(6)} style={{ padding: '16px 48px' }}>Go to Confirmation ➜</button>
              </div>
            </div>
          )}

          {workflowStep === 6 && (
            <div className="fade-in" style={{ textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', background: 'rgba(26,107,46,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--primary)' }}>celebration</span>
              </div>
              <header className="step-header">
                <h2 className="step-title">Almost There!</h2>
                <p className="subheading">Once confirmed, we’ll contact our professional driver guild to secure your ride.</p>
              </header>
              <div style={{ maxWidth: '600px', margin: '0 auto 48px', padding: '32px', border: '1px dashed var(--outline-variant)', borderRadius: '32px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>Summary Locked</div>
                <p style={{ color: '#64748b' }}>Your island journey is ready to be born. Click below to initialize the booking.</p>
              </div>
              <div className="workflow-nav" style={{ border: 'none', justifyContent: 'center', gap: '24px' }}>
                <button className="btn-white" onClick={() => setWorkflowStep(5)} style={{ padding: '16px 32px' }}>Review Again</button>
                <button className="btn-primary" onClick={handleConfirmBooking} disabled={aiLoading} style={{ padding: '16px 64px', fontSize: '1.1rem' }}>
                  {aiLoading ? 'Finalizing...' : '✅ Confirm & Book My Journey'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="main-content">
      <header className="header" style={{ marginBottom: '40px' }}>
        <div>
          <h1 className="welcome-title">My Concierge Profile</h1>
          <p className="subheading">Manage your island identity and digital credentials.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', maxWidth: '100%' }}>
        {/* Banner and Avatar Section */}
        <div style={{
          background: 'white',
          borderRadius: '40px',
          overflow: 'hidden',
          border: '1px solid var(--outline-variant)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            height: '180px',
            background: 'linear-gradient(135deg, #1a6b2e, #4ade80, #facc15)',
            opacity: 0.8,
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-60px',
              left: '40px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'white',
              padding: '6px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'var(--surface-container-high)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {profileFormData.profile_image ? (
                  <img src={`http://localhost:5007${profileFormData.profile_image}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary)' }}>person</span>
                )}
                <label style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: '6px 0',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)'
                }}>
                  <input type="file" hidden onChange={handleProfilePictureUpload} accept="image/*" />
                  CHANGE
                </label>
              </div>
            </div>
          </div>

          <div style={{ padding: '80px 40px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--on-surface)' }}>
                  {profileFormData.name}
                  <span className="glass-chip" style={{ fontSize: '0.7rem', verticalAlign: 'middle', marginLeft: '16px', background: 'rgba(26,107,46,0.1)', color: 'var(--primary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span> Verified Traveler
                  </span>
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '4px', textAlign: 'left' }}>
                  Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info and Security Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '40px' }}>

          {/* Profile Details CRUD */}
          <div style={{ background: 'white', padding: '40px', borderRadius: '40px', border: '1px solid var(--outline-variant)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>contact_page</span> Profile Details
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className={isEditingProfile ? "btn-white" : "btn-primary"}
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{isEditingProfile ? 'close' : 'edit'}</span>
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </button>
                {isEditingProfile && (
                  <button onClick={handleUpdateProfile} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span> Save
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { label: 'Full Name', key: 'name', icon: 'person' },
                { label: 'Username', key: 'username', icon: 'alternate_email' },
                { label: 'Email Address', key: 'email', icon: 'mail', type: 'email' },
                { label: 'Phone Number', key: 'phone', icon: 'call' }
              ].map(field => (
                <div key={field.key} style={{ gridColumn: field.key === 'email' ? 'span 2' : 'auto' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    background: isEditingProfile ? 'white' : 'var(--surface-container-low)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: isEditingProfile ? '2px solid var(--primary-container)' : '1px solid transparent'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--primary)', marginRight: '12px', opacity: 0.6 }}>{field.icon}</span>
                    {isEditingProfile ? (
                      <input
                        type={field.type || 'text'}
                        value={profileFormData[field.key]}
                        onChange={e => {
                          const val = e.target.value;
                          if (field.key === 'name' && /\d/.test(val)) return;
                          setProfileFormData({ ...profileFormData, [field.key]: val });
                        }}
                        style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 600, outline: 'none' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>{profileFormData[field.key] || 'Not specified'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & System */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Change Password */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '40px', border: '1px solid var(--outline-variant)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>shield_lock</span> Security
              </h3>
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="input-field"
                    style={{ fontSize: '0.9rem' }}
                    value={passwordFormData.newPassword}
                    onChange={e => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                    required
                  />
                  {passwordFormData.newPassword && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '4px', background: '#e8f2e8', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: getPasswordStrength(passwordFormData.newPassword).label === 'Weak' ? '33%' : getPasswordStrength(passwordFormData.newPassword).label === 'Good' ? '66%' : '100%', background: getPasswordStrength(passwordFormData.newPassword).color, transition: 'all 0.3s' }}></div>
                      </div>
                      <span style={{ color: getPasswordStrength(passwordFormData.newPassword).color }}>{getPasswordStrength(passwordFormData.newPassword).label}</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="input-field"
                    style={{ fontSize: '0.9rem' }}
                    value={passwordFormData.confirmPassword}
                    onChange={e => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Update Password</button>
              </form>
            </div>

            {/* Account Deletion */}
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '32px', borderRadius: '40px', border: '1px dashed #ef4444' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Permanently remove your account and all travel history from the SurangaTours network.</p>
              <button onClick={handleDeleteAccount} className="btn-white" style={{ width: '100%', color: '#ef4444', border: '1px solid #ef4444' }}>Delete My Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="dash-container blurred-slide-in-right">
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {renderSidebar()}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Top Navigation Bar */}
        <nav style={{
          height: '84px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--surface-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            <PageToggle />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setHasViewedNotifications(true); }}
                style={{ background: 'var(--surface-container-high)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: '0.2s', position: 'relative' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
                {!hasViewedNotifications && (Array.isArray(trips) ? trips : []).filter(t => new Date(t.start_date) > new Date(new Date().setHours(0, 0, 0, 0))).length > 0 && <span style={{ position: 'absolute', top: 12, right: 12, background: '#ef4444', width: 8, height: 8, borderRadius: '50%' }}></span>}
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', top: '60px', right: '0', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '320px', zIndex: 100, overflow: 'hidden', border: '1px solid var(--outline-variant)' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--outline-variant)', fontWeight: '700', color: '#0f2318' }}>Notifications</div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {(() => {
                      const upcoming = (Array.isArray(trips) ? trips : []).filter(t => new Date(t.start_date) > new Date(new Date().setHours(0, 0, 0, 0)));
                      if (upcoming.length === 0) {
                        return <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No upcoming trips at the moment</div>;
                      }
                      return upcoming.map(trip => {
                        const diffDays = Math.ceil((new Date(trip.start_date) - new Date(new Date().setHours(0, 0, 0, 0))) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={trip.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--surface-container)', fontSize: '0.9rem', color: '#64748b' }}>
                            <div style={{ fontWeight: 600, color: '#1a2e1a', marginBottom: '4px' }}>Upcoming Trip!</div>
                            Your trip to {trip.destination?.name || 'your destination'} is in {diffDays} {diffDays === 1 ? 'day' : 'days'}.
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>

            <img
              src={user.profile_image ? `http://localhost:5007${user.profile_image}` : "https://ui-avatars.com/api/?name=" + (user.name || 'U') + "&background=1a6b2e&color=fff"}
              alt="Profile"
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 4px 12px rgba(26,107,46,0.15)', cursor: 'pointer' }}
              onClick={() => setActiveTab('Profile')}
            />
          </div>
        </nav>

        {/* Scrollable Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {isAiPlanningActive ? renderAiPlanningWorkflow() : (
            <>
              {activeTab === 'Overview' && renderDashboard()}
              {activeTab === 'My Trips' && (selectedTripDetails ? renderTripDetails() : renderMyTrips())}
              {activeTab === 'Saved Destinations' && renderSavedDestinations()}
              {activeTab === 'Payments' && renderPayments()}
              {activeTab === 'Reviews' && renderReviews()}
              {activeTab === 'Profile' && renderProfile()}
            </>
          )}
        </div>
      </div>

      {/* Discover More Modal */}
      {discoverMoreOpen && (
        <div className="modal-overlay" onClick={() => setDiscoverMoreOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h2 className="welcome-title" style={{ fontSize: '2rem', margin: 0 }}>Discover</h2>
                <p className="subheading">Unlock the secrets of the paradise island.</p>
              </div>
              <button onClick={() => setDiscoverMoreOpen(false)} style={{ background: 'var(--surface-container)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {(Array.isArray(allDestinations) ? allDestinations : [])
                .filter(d => !Array.isArray(favorites) || !favorites.some(f => f.id === d.id))
                .map(dest => (
                  <div key={dest.id} className="dest-card" style={{ height: '220px' }}>
                    <img src={dest.image_url ? `http://localhost:5007${dest.image_url}` : "https://via.placeholder.com/300"} className="dest-img" alt={dest.name} />
                    <div className="dest-overlay">
                      <button
                        onClick={() => handleToggleFavorite(dest.id)}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>favorite</span>
                      </button>
                      <h5 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{dest.name}</h5>
                      <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>{dest.district}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Wrapper */}
      {isReviewModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '500px', margin: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{editingReviewId ? 'Edit Review' : 'Write a Review'}</h2>
              <button className="btn-white" style={{ padding: '8px', border: 'none', background: 'transparent' }} onClick={() => setIsReviewModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleReviewSubmit}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Review Type</label>
                <select
                  className="input-field"
                  value={reviewFormData.type}
                  onChange={e => setReviewFormData({ ...reviewFormData, type: e.target.value, targetId: '' })}
                  required
                >
                  <option value="Trip">Trip Experience</option>
                  <option value="Driver">Driver Experience</option>
                  <option value="Destination">Destination Experience</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Select your experience</label>
                <select
                  className="input-field"
                  value={reviewFormData.targetId}
                  onChange={e => setReviewFormData({ ...reviewFormData, targetId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a completed trip...</option>
                  {reviewFormData.type === 'Trip' && Array.isArray(trips) && trips.filter(t => t.status === 'paid' || t.status === 'completed').map(t => (
                    <option key={t.id} value={t.id}>Trip #{t.id} ({new Date(t.start_date).toLocaleDateString()})</option>
                  ))}
                  {reviewFormData.type === 'Driver' && Array.isArray(trips) && trips.filter(t => (t.status === 'paid' || t.status === 'completed') && t.Booking && t.Booking.Driver).map(t => (
                    <option key={t.id} value={t.Booking.driver_id}>{t.Booking.Driver.name} (from Trip #{t.id})</option>
                  ))}
                  {reviewFormData.type === 'Destination' && Array.isArray(trips) && trips
                    .filter(t => t.status === 'paid' || t.status === 'completed')
                    .flatMap(t => t.Destinations || [])
                    .map((d, index) => (
                      <option key={`${d.id}-${index}`} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Rating</label>
                <select className="input-field" value={reviewFormData.rating} onChange={e => setReviewFormData({ ...reviewFormData, rating: parseInt(e.target.value) })} required>
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Comment</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  placeholder="Share your experience..."
                  value={reviewFormData.comment}
                  onChange={e => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '12px' }}>
                {editingReviewId ? 'Update Review' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
