// client\src\pages\driver\DriverDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageToggle from '../../components/PageToggle';

/* Reusing similar layout to User Dashboard for consistent aesthetic */
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

  /* Vehicle Section Specific Styles */
  .v-form-card {
    background: white;
    border-radius: 36px;
    padding: 40px;
    border: 1px solid var(--outline-variant);
    box-shadow: 0 20px 40px rgba(0,0,0,0.02);
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
  }

  .v-form-card::after {
    content: '🚗';
    position: absolute;
    top: -20px;
    right: -20px;
    font-size: 120px;
    opacity: 0.03;
    transform: rotate(-15deg);
    pointer-events: none;
  }

  .v-upload-zone {
    border: 2px dashed var(--outline-variant);
    border-radius: 24px;
    padding: 32px;
    text-align: center;
    background: var(--surface-container-low);
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .v-upload-zone:hover {
    border-color: var(--primary);
    background: var(--surface-container-high);
  }

  .v-preview-img {
    max-width: 100%;
    max-height: 180px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }

  .v-input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }

  .v-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-left: 4px;
  }

  .v-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 32px;
  }

  .v-card {
    background: white;
    border-radius: 32px;
    overflow: hidden;
    border: 1px solid var(--outline-variant);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
  }

  .v-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 32px 64px rgba(23, 28, 29, 0.08);
    border-color: var(--primary);
  }

  .v-image-container {
    height: 220px;
    position: relative;
    overflow: hidden;
    background: var(--surface-container-high);
  }

  .v-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .v-card:hover .v-img {
    transform: scale(1.08);
  }

  .v-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 6px 14px;
    border-radius: 50px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    backdrop-filter: blur(12px);
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .v-badge.active { background: rgba(52, 211, 153, 0.9); }
  .v-badge.inactive { background: rgba(248, 113, 113, 0.9); }
  .v-badge.maintenance { background: rgba(251, 191, 36, 0.9); }

  .v-content {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .v-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #0f2318;
    margin: 0;
  }

  .v-info-row {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #64748b;
    font-size: 0.9rem;
  }

  .v-price-tag {
    margin-left: auto;
    text-align: right;
  }

  .v-price-val {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--primary);
  }

  .v-actions {
    display: flex;
    gap: 12px;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--surface-container);
  }

  .v-btn-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .v-btn-edit { background: var(--surface-container-low); color: var(--primary); }
  .v-btn-edit:hover { background: var(--primary); color: white; }
  .v-btn-delete { background: #fef2f2; color: #ef4444; }
  .v-btn-delete:hover { background: #ef4444; color: white; }

`;

export default function DriverDashboard() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [user, setUser] = React.useState(storedUser);
    const [activeTab, setActiveTab] = React.useState('Dashboard');
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [profileData, setProfileData] = React.useState({ username: user.username || '', name: user.name || '', phone: user.phone || '', license_no: user.license_no || '', dob: user.dob || '', profile_image: user.profile_image || '', password: '', confirmPassword: '' });
    const [statusMsg, setStatusMsg] = React.useState('');
    const [isEditingProfile, setIsEditingProfile] = React.useState(false);

    // Driver Data State
    const [vehiclesList, setVehiclesList] = React.useState([]);
    const [bookingsList, setBookingsList] = React.useState([]);
    const [reviewsList, setReviewsList] = React.useState([]);
    const [newVehicle, setNewVehicle] = React.useState({ type: '', capacity: '', price_per_day: '', condition: 'Good', image_url: '' });
    const [vehicleMsg, setVehicleMsg] = React.useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [hasViewedNotifications, setHasViewedNotifications] = React.useState(false);

    React.useEffect(() => {
        if (user.token) {
            fetch('http://localhost:5000/api/drivers/profile', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.id) {
                        setProfileData({ username: data.username, name: data.name, phone: data.phone || '', license_no: data.license_no || '', dob: data.dob || '', profile_image: data.profile_image || '', password: '', confirmPassword: '' });
                        const updated = { ...user, id: data.id, username: data.username, name: data.name, phone: data.phone, license_no: data.license_no, dob: data.dob, profile_image: data.profile_image };
                        localStorage.setItem('user', JSON.stringify(updated));
                        setUser(updated);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [user.token]);

    React.useEffect(() => {
        if (!user.token) return;
        const headers = { Authorization: `Bearer ${user.token}` };

        if (activeTab === 'Vehicles' || activeTab === 'Dashboard') {
            fetch('http://localhost:5000/api/vehicles', { headers })
                .then(res => res.json())
                .then(data => setVehiclesList(Array.isArray(data) ? data : []))
                .catch(console.error);
        }

        if (activeTab === 'Assigned Trips' || activeTab === 'Dashboard') {
            fetch('http://localhost:5000/api/bookings/my', { headers })
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                })
                .then(data => setBookingsList(Array.isArray(data) ? data : []))
                .catch(err => {
                    console.error('Error fetching assigned trips:', err);
                    setBookingsList([]);
                });
        }

        if (activeTab === 'My Reviews') {
            if (user.id) {
                fetch(`http://localhost:5000/api/reviews/driver/${user.id}`, { headers })
                    .then(res => res.json())
                    .then(data => setReviewsList(Array.isArray(data) ? data : []))
                    .catch(console.error);
            }
        }
    }, [activeTab, user.token, user.id]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        const formData = new FormData();
        formData.append('vehicleImage', file);

        try {
            const res = await fetch('http://localhost:5000/api/upload/vehicle', {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                if (isEditing) {
                    setIsEditing(prev => ({ ...prev, image_url: data.imageUrl }));
                } else {
                    setNewVehicle(prev => ({ ...prev, image_url: data.imageUrl }));
                }
            } else {
                alert(data.message || 'Image upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Server error during upload');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (isEditing) {
            setIsEditing(prev => ({ ...prev, image_url: '' }));
        } else {
            setNewVehicle(prev => ({ ...prev, image_url: '' }));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (!profileData.username.trim() || !profileData.name.trim()) {
            setStatusMsg('Username and Name cannot be empty');
            return;
        }
        if (!profileData.phone.trim()) {
            setStatusMsg('Phone number is required');
            return;
        }
        const phoneRegex = /^\+?[0-9\s\-]{9,15}$/;
        if (!phoneRegex.test(profileData.phone)) {
            setStatusMsg('Please enter a valid phone number');
            return;
        }

        // Password validation
        if (profileData.password) {
            if (profileData.password.length < 6) {
                setStatusMsg('Password must be at least 6 characters');
                return;
            }
            if (profileData.password !== profileData.confirmPassword) {
                setStatusMsg('Passwords do not match');
                return;
            }
        }

        try {
            const res = await fetch('http://localhost:5000/api/drivers/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    username: profileData.username,
                    name: profileData.name,
                    phone: profileData.phone,
                    license_no: profileData.license_no,
                    dob: profileData.dob,
                    profile_image: profileData.profile_image,
                    password: profileData.password || undefined
                })
            });
            const data = await res.json();
            if (res.ok) {
                setStatusMsg('Profile & Credentials updated successfully!');
                const updated = { ...user, username: data.username, name: data.name, phone: data.phone, license_no: data.license_no, dob: data.dob, profile_image: data.profile_image };
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' })); // clear password fields
                setIsEditingProfile(false);
                setTimeout(() => setStatusMsg(''), 3000);
            } else {
                setStatusMsg(data.message || 'Update failed');
            }
        } catch (error) {
            setStatusMsg('Failed to update profile.');
        }
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const res = await fetch('http://localhost:5000/api/upload/profile', {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setProfileData({ ...profileData, profile_image: data.imageUrl });
                if (!isEditingProfile) {
                    await fetch('http://localhost:5000/api/drivers/profile', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`
                        },
                        body: JSON.stringify({ profile_image: data.imageUrl })
                    });
                    const updated = { ...user, profile_image: data.imageUrl };
                    localStorage.setItem('user', JSON.stringify(updated));
                    setUser(updated);
                }
            } else {
                alert(data.message || 'Image upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("CRITICAL WARNING: This will permanently delete your driver account and all your registered vehicles. This action cannot be undone. Are you sure?")) return;

        try {
            const res = await fetch('http://localhost:5000/api/drivers/profile', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                alert("Account deleted successfully. Safe travels!");
                handleLogout();
            } else {
                alert("Failed to delete account");
            }
        } catch (err) {
            alert("Server error during deletion");
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify(newVehicle)
            });
            const data = await res.json();
            if (res.ok) {
                setVehiclesList(prev => [...prev, data]);
                setNewVehicle({ type: '', capacity: '', price_per_day: '', condition: 'Good', image_url: '' });
                setImagePreview(null);
                setVehicleMsg({ type: 'success', text: 'Vehicle added successfully!' });
                setTimeout(() => setVehicleMsg({ type: '', text: '' }), 3000);
            } else {
                setVehicleMsg({ type: 'error', text: data.message || 'Error adding vehicle' });
            }
        } catch (err) {
            setVehicleMsg({ type: 'error', text: 'Server error' });
        }
    };

    const handleUpdateVehicle = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/vehicles/${isEditing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify(isEditing)
            });
            const data = await res.json();
            if (res.ok) {
                setVehiclesList(prev => prev.map(v => v.id === isEditing.id ? data : v));
                setIsEditing(null);
                setImagePreview(null);
                setVehicleMsg({ type: 'success', text: 'Vehicle updated successfully!' });
                setTimeout(() => setVehicleMsg({ type: '', text: '' }), 3000);
            } else {
                setVehicleMsg({ type: 'error', text: data.message || 'Error updating vehicle' });
            }
        } catch (err) {
            setVehicleMsg({ type: 'error', text: 'Server error' });
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (!window.confirm("Are you sure you want to remove this vehicle?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                setVehiclesList(prev => prev.filter(v => v.id !== id));
            }
        } catch (err) {
            alert('Failed to delete vehicle');
        }
    };

    const startEdit = (vehicle) => {
        setIsEditing(vehicle);
        setImagePreview(vehicle.image_url ? `http://localhost:5000${vehicle.image_url}` : null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setBookingsList(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            } else {
                alert('Error updating status');
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };


    const renderSidebar = () => (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%', marginBottom: '8px' }}>
                <div className="sb-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="sb-logo-icon">🌿</div>
                    <div className="sb-logo-text">Suranga<span>Tours</span></div>
                </div>
                <button className="toggle-sidebar" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <span className="material-symbols-outlined">
                        {isCollapsed ? 'menu' : 'menu_open'}
                    </span>
                </button>
            </div>

            <nav className="sb-nav">
                {[
                    { icon: 'dashboard', label: 'Dashboard', id: 'Dashboard' },
                    { icon: 'calendar_month', label: 'My Schedule', id: 'My Schedule' },
                    { icon: 'commute', label: 'Assigned Trips', id: 'Assigned Trips' },
                    { icon: 'directions_car', label: 'Vehicles', id: 'Vehicles' },
                    { icon: 'star_rate', label: 'My Reviews', id: 'My Reviews' }
                ].map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                        title={isCollapsed ? item.label : ""}
                        style={{ marginBottom: '4px' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </div>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--surface-container)' }}>
                <div
                    className="nav-item"
                    onClick={handleLogout}
                >
                    <span className="material-symbols-outlined">logout</span>
                    {!isCollapsed && "Logout"}
                </div>
            </div>
        </aside>
    );


    const renderContent = () => {

        if (activeTab === 'Profile') {
            return (
                <div>
                    <header className="header" style={{ marginBottom: '40px' }}>
                        <div>
                            <h1 className="welcome-title">Driver Profile</h1>
                            <p className="subheading">Manage your professional information and credentials.</p>
                        </div>
                    </header>

                    {statusMsg && (
                        <div style={{ padding: '16px 24px', borderRadius: '16px', marginBottom: '32px', background: statusMsg.includes('success') ? 'var(--secondary-container)' : '#fef2f2', color: statusMsg.includes('success') ? 'var(--primary)' : '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="material-symbols-outlined">{statusMsg.includes('success') ? 'check_circle' : 'error'}</span>
                            {statusMsg}
                        </div>
                    )}

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
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '3.5rem',
                                        fontWeight: 700,
                                        position: 'relative'
                                    }}>
                                        {user.profile_image ? (
                                            <img src={`http://localhost:5000${user.profile_image}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            user.name?.charAt(0) || 'D'
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
                                            backdropFilter: 'blur(4px)',
                                            margin: 0
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
                                            {profileData.name || 'Professional Driver'}
                                            <span className="glass-chip" style={{ fontSize: '0.7rem', verticalAlign: 'middle', marginLeft: '16px', background: 'rgba(26,107,46,0.1)', color: 'var(--primary)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span> Verified Partner
                                            </span>
                                        </h2>
                                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '4px', textAlign: 'left' }}>
                                            Partner since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                                            <button onClick={handleProfileUpdate} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span> Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    {[
                                        { label: 'Full Name', key: 'name', icon: 'person' },
                                        { label: 'System Username', key: 'username', icon: 'alternate_email' },
                                        { label: 'Phone Number', key: 'phone', icon: 'call' },
                                        { label: 'Date of Birth', key: 'dob', icon: 'calendar_month', type: 'date' },
                                        { label: 'Driver License', key: 'license_no', icon: 'badge' },
                                    ].map(field => (
                                        <div key={field.key}>
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
                                                        type={field.type || "text"}
                                                        value={profileData[field.key]}
                                                        onChange={e => setProfileData({ ...profileData, [field.key]: e.target.value })}
                                                        style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 600, outline: 'none' }}
                                                    />
                                                ) : (
                                                    <span style={{ fontWeight: 600 }}>{profileData[field.key] || 'Not specified'}</span>
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
                                    <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                className="input-field"
                                                style={{ fontSize: '0.9rem' }}
                                                value={profileData.password}
                                                onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                className="input-field"
                                                style={{ fontSize: '0.9rem' }}
                                                value={profileData.confirmPassword}
                                                onChange={e => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Update Password</button>
                                    </form>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '16px' }}>Leave blank if you do not wish to change your password.</p>
                                </div>

                                {/* Danger Zone */}
                                <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '32px', borderRadius: '40px', border: '1px dashed #ef4444' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '12px', color: '#ef4444' }}>Danger Zone</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Permanently remove your driver profile and fleet data. This action cannot be undone.</p>
                                    <button onClick={handleDeleteAccount} className="btn-white" style={{ width: '100%', color: '#ef4444', border: '1px solid #ef4444' }}>Delete My Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }


        if (activeTab === 'Vehicles') {
            const vehicleData = isEditing || newVehicle;
            const setVehicleData = isEditing ? setIsEditing : setNewVehicle;

            return (
                <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                        <div>
                            <h1 className="welcome-title">{isEditing ? 'Edit Vehicle' : 'Manage Fleet'}</h1>
                            <p className="subheading">{isEditing ? 'Update your vehicle information.' : 'Register and manage your professional transport fleet.'}</p>
                        </div>
                        {isEditing && (
                            <button
                                onClick={() => { setIsEditing(null); setImagePreview(null); }}
                                className="btn-white"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add New Vehicle
                            </button>
                        )}
                    </div>

                    {vehicleMsg.text && (
                        <div style={{
                            padding: '16px 24px',
                            borderRadius: '16px',
                            marginBottom: '32px',
                            background: vehicleMsg.type === 'success' ? 'var(--secondary-container)' : '#fef2f2',
                            color: vehicleMsg.type === 'success' ? 'var(--primary)' : '#ef4444',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: `1px solid ${vehicleMsg.type === 'success' ? 'var(--primary-container)' : '#fecaca'}`
                        }}>
                            <span className="material-symbols-outlined">{vehicleMsg.type === 'success' ? 'check_circle' : 'error'}</span>
                            {vehicleMsg.text}
                        </div>
                    )}

                    <div className="v-form-card">
                        <form onSubmit={isEditing ? handleUpdateVehicle : handleAddVehicle}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '40px' }}>
                                {/* Upload Section */}
                                <div>
                                    <div className="v-label" style={{ marginBottom: '8px' }}>Vehicle Photography</div>
                                    <div className="v-upload-zone" onClick={() => document.getElementById('vehicleImage').click()}>
                                        {imagePreview ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={imagePreview} alt="Preview" className="v-preview-img" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                    style={{
                                                        position: 'absolute', top: '10px', right: '10px',
                                                        background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none',
                                                        borderRadius: '50%', width: '32px', height: '32px',
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        backdropFilter: 'blur(4px)'
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '8px' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add_a_photo</span>
                                                </div>
                                                <div style={{ fontWeight: 600, color: '#0f2318' }}>{uploading ? 'Uploading...' : 'Upload Vehicle Image'}</div>
                                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>High-quality photos attract more bookings.</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            id="vehicleImage"
                                            hidden
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div>
                                    <div className="v-input-group">
                                        <label className="v-label">Vehicle Model & Type</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={vehicleData.type}
                                            onChange={e => setVehicleData({ ...vehicleData, type: e.target.value })}
                                            placeholder="e.g. Toyota Prius, Honda Vezel"
                                            required
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div className="v-input-group">
                                            <label className="v-label">Passenger Capacity</label>
                                            <div style={{ position: 'relative' }}>
                                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }}>groups</span>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    style={{ paddingLeft: '48px' }}
                                                    min="1"
                                                    value={vehicleData.capacity}
                                                    onChange={e => setVehicleData({ ...vehicleData, capacity: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="v-input-group">
                                            <label className="v-label">Current Condition</label>
                                            <select
                                                className="input-field"
                                                value={vehicleData.condition}
                                                onChange={e => setVehicleData({ ...vehicleData, condition: e.target.value })}
                                            >
                                                <option value="Excellent">Excellent</option>
                                                <option value="Good">Good</option>
                                                <option value="Fair">Fair</option>
                                                <option value="Poor">Poor</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div className="v-input-group">
                                            <label className="v-label">Daily Rate (LKR)</label>
                                            <div style={{ position: 'relative' }}>
                                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '20px' }}>payments</span>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    style={{ paddingLeft: '48px' }}
                                                    step="0.01"
                                                    value={vehicleData.price_per_day}
                                                    onChange={e => setVehicleData({ ...vehicleData, price_per_day: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="v-input-group">
                                            <label className="v-label">Operational Status</label>
                                            <select
                                                className="input-field"
                                                value={vehicleData.status || 'active'}
                                                onChange={e => setVehicleData({ ...vehicleData, status: e.target.value })}
                                            >
                                                <option value="active">Active & Online</option>
                                                <option value="inactive">Inactive / Hidden</option>
                                                <option value="maintenance">Under Maintenance</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                        <button type="submit" className="btn-primary" style={{ flex: 1, height: '56px', fontSize: '1rem' }} disabled={uploading}>
                                            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>{isEditing ? 'save' : 'add_circle'}</span>
                                            {isEditing ? 'Update Vehicle Details' : 'Register Vehicle to Fleet'}
                                        </button>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => { setIsEditing(null); setImagePreview(null); }}
                                                className="btn-white"
                                                style={{ padding: '0 24px', height: '56px' }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h2 className="welcome-title" style={{ fontSize: '1.8rem', margin: 0 }}>Registered Fleet</h2>
                        <div style={{ background: 'var(--surface-container)', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                            {vehiclesList.length} Vehicles Authorized
                        </div>
                    </div>

                    <div className="v-grid">
                        {vehiclesList.map(vehicle => (
                            <div key={vehicle.id} className="v-card">
                                <div className="v-image-container">
                                    {vehicle.image_url ? (
                                        <img src={`http://localhost:5000${vehicle.image_url}`} alt={vehicle.type} className="v-img" />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--outline-variant)', fontSize: '4rem' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>directions_car</span>
                                        </div>
                                    )}
                                    <div className={`v-badge ${vehicle.status || 'active'}`}>
                                        {vehicle.status || 'active'}
                                    </div>
                                </div>

                                <div className="v-content">
                                    <h3 className="v-title">{vehicle.type}</h3>

                                    <div className="v-info-row">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                                            {vehicle.capacity} Seats
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
                                            {vehicle.condition || 'Good'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'flex-end', borderTop: '1px solid var(--surface-container)', paddingTop: '16px' }}>
                                        <div className="v-actions">
                                            <button
                                                onClick={() => startEdit(vehicle)}
                                                className="v-btn-icon v-btn-edit"
                                                title="Edit Vehicle"
                                            >
                                                <span className="material-symbols-outlined">edit_square</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                                className="v-btn-icon v-btn-delete"
                                                title="Remove Vehicle"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                        <div className="v-price-tag">
                                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Daily Rate</div>
                                            <div className="v-price-val">LKR {parseFloat(vehicle.price_per_day).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {vehiclesList.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: '40px', border: '1px dashed var(--outline-variant)' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', margin: '0 auto 20px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>no_transport</span>
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>Your fleet is empty</h3>
                                <p style={{ color: '#64748b', margin: 0 }}>Add your professional vehicles above to start receiving tour bookings.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (activeTab === 'Assigned Trips') {
            return (
                <div>
                    <h2 style={{ className: 'welcome-title', style: { fontSize: '2rem' }, marginBottom: '20px' }}>Trip Assignments</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {bookingsList.map(booking => (
                            <div key={booking.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <h3 style={{ margin: 0 }}>Booking #{booking.id}</h3>
                                            <span style={{
                                                background: booking.status === 'pending' ? '#fef3c7' : booking.status === 'confirmed' ? '#dbeafe' : booking.status === 'completed' ? '#ecfdf5' : '#fee2e2',
                                                color: booking.status === 'pending' ? '#b45309' : booking.status === 'confirmed' ? '#1e40af' : booking.status === 'completed' ? '#059669' : '#b91c1c',
                                                padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase'
                                            }}>{booking.status}</span>
                                        </div>
                                        <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                            Trip Dates: {booking.Trip ? `${new Date(booking.Trip.start_date).toLocaleDateString()} - ${new Date(booking.Trip.end_date).toLocaleDateString()}` : 'N/A'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', className: 'welcome-title', style: { fontSize: '2rem' }, fontWeight: 700 }}>LKR {booking.total_price}</div>
                                        <div style={{ color: '#6B7280', fontSize: '0.85rem' }}>{booking.Vehicle?.type}</div>
                                    </div>
                                </div>

                                {booking.Trip && booking.Trip.User && (
                                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Tourist Details</div>
                                        <div style={{ display: 'flex', gap: '24px', fontSize: '0.95rem' }}>
                                            <div>👤 {booking.Trip.User.name}</div>
                                            <div>📞 {booking.Trip.User.phone || 'N/A'}</div>
                                        </div>
                                    </div>
                                )}

                                {booking.status === 'pending' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                                        {bookingsList.some(b => b.status === 'accepted') && (
                                            <div style={{ fontSize: '0.85rem', color: '#EF4444', textAlign: 'center', background: '#fef2f2', padding: '8px', borderRadius: '8px', fontWeight: 600 }}>
                                                You must complete your active trip before accepting a new one.
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                disabled={bookingsList.some(b => b.status === 'accepted')}
                                                onClick={() => handleUpdateBookingStatus(booking.id, 'accepted')}
                                                className="btn-primary"
                                                style={{ flex: 1, background: bookingsList.some(b => b.status === 'accepted') ? '#9ca3af' : '#10B981', color: 'white', cursor: bookingsList.some(b => b.status === 'accepted') ? 'not-allowed' : 'pointer' }}
                                            >
                                                Accept Trip
                                            </button>
                                            <button onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')} className="btn-primary" style={{ flex: 1, background: '#EF4444', color: 'white' }}>Decline</button>
                                        </div>
                                    </div>
                                )}
                                {booking.status === 'accepted' && (
                                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                                        <button onClick={() => handleUpdateBookingStatus(booking.id, 'completed')} className="btn-primary" style={{ width: '100%' }}>Mark as Completed</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {bookingsList.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', color: '#6B7280' }}>
                                You have no assigned trips at the moment.
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (activeTab === 'My Reviews') {
            return (
                <div style={{ maxWidth: '1000px' }}>
                    <h2 style={{ className: 'welcome-title', style: { fontSize: '2rem' }, marginBottom: '10px', color: '#1A1A1A' }}>🌟 Tourist Feedback</h2>
                    <p style={{ color: '#6B7280', marginBottom: '40px', fontWeight: 500 }}>
                        Review feedback from your guests to maintain a 5-star service.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                        {reviewsList.map(review => (
                            <div key={review.id} style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', transition: '0.2s' }} className="dash-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F3F4F6', color: '#2D7A4F', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                                            {review.User?.name?.charAt(0) || 'T'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1A1A' }}>{review.User?.name || 'Tourist'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ background: '#FFFBEB', color: '#F59E0B', padding: '4px 10px', borderRadius: '50px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        ★ {review.rating}
                                    </div>
                                </div>

                                <p style={{ color: '#4B5563', lineHeight: 1.6, fontSize: '0.95rem', fontStyle: 'italic', margin: '0 0 20px 0', flex: 1 }}>
                                    "{review.comment}"
                                </p>

                                {review.Trip && (
                                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', fontSize: '0.8rem', color: '#6B7280' }}>
                                        📅 Trip: {new Date(review.Trip.start_date).toLocaleDateString()} - {new Date(review.Trip.end_date).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        ))}
                        {reviewsList.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: '24px', color: '#9CA3AF' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>⭐</div>
                                <h3 style={{ color: '#4B5563', marginBottom: '10px' }}>No reviews yet</h3>
                                <p>Provide excellent service to your first guests and ratings will appear here!</p>
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        return (
            <div className="grid-3">
                <div className="action-card">
                    <div className="icon-box" style={{ background: 'var(--surface-container-high)', color: 'var(--primary)' }}>
                        <span className="material-symbols-outlined">commute</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Upcoming Trips</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{bookingsList.filter(b => b.status === 'accepted').length}</div>
                </div>
                <div className="action-card">
                    <div className="icon-box" style={{ background: 'var(--surface-container-high)', color: 'var(--primary)' }}>
                        <span className="material-symbols-outlined">directions_car</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Total Vehicles</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{vehiclesList.length}</div>
                </div>
                <div className="action-card" style={{ border: '2px solid var(--primary)' }}>
                    <div className="icon-box" style={{ background: 'var(--primary)', color: 'white' }}>
                        <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Driver Status</div>
                    <div style={{ display: 'inline-block', padding: '6px 12px', background: '#ecfdf5', color: '#059669', borderRadius: '50px', fontWeight: 600, fontSize: '0.85rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px', verticalAlign: '-2px' }}>fiber_manual_record</span> Online & Available
                    </div>
                </div>
            </div>
        );
    };


    return (
        <main className="dash-container blurred-slide-in-right">
            <style>{styles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            {renderSidebar()}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
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
                                {!hasViewedNotifications && bookingsList.filter(b => b.Trip && new Date(b.Trip.start_date) > new Date(new Date().setHours(0, 0, 0, 0))).length > 0 && <span style={{ position: 'absolute', top: 12, right: 12, background: '#ef4444', width: 8, height: 8, borderRadius: '50%' }}></span>}
                            </button>
                            {showNotifications && (
                                <div style={{ position: 'absolute', top: '60px', right: '0', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '320px', zIndex: 100, overflow: 'hidden', border: '1px solid var(--outline-variant)', textAlign: 'left' }}>
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--outline-variant)', fontWeight: '700', color: '#0f2318' }}>Notifications</div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {(() => {
                                            const upcoming = bookingsList.filter(b => b.Trip && new Date(b.Trip.start_date) > new Date(new Date().setHours(0, 0, 0, 0)));
                                            if (upcoming.length === 0) {
                                                return <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No upcoming trips at the moment</div>;
                                            }
                                            return upcoming.map(booking => {
                                                const diffDays = Math.ceil((new Date(booking.Trip.start_date) - new Date(new Date().setHours(0, 0, 0, 0))) / (1000 * 60 * 60 * 24));
                                                return (
                                                    <div key={booking.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--surface-container)', fontSize: '0.9rem', color: '#64748b' }}>
                                                        <div style={{ fontWeight: 600, color: '#1a2e1a', marginBottom: '4px' }}>Upcoming Assignment!</div>
                                                        Your assigned trip with {booking.Trip.User?.name || 'Tourist'} is in {diffDays} {diffDays === 1 ? 'day' : 'days'}.
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>

                        <img
                            src={user.profile_image ? `http://localhost:5000${user.profile_image}` : "https://ui-avatars.com/api/?name=" + (user.name || 'D') + "&background=1a6b2e&color=fff"}
                            alt="Profile"
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 4px 12px rgba(26,107,46,0.15)', cursor: 'pointer' }}
                            onClick={() => setActiveTab('Profile')}
                        />
                    </div>
                </nav>

                <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                    <div className="main-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </main>
    );

}
