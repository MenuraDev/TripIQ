// client\src\pages\admin\AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageToggle from '../../components/PageToggle';

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
    margin-bottom: 0;
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
    text-decoration: none;
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
    background: rgba(26, 107, 46, 0.08);
    color: var(--primary);
    font-weight: 700;
  }

  /* Content Styles */
  .main-content {
    flex: 1;
    padding: 0;
    max-width: 1600px;
    margin: 0;
    width: 100%;
    overflow-y: auto;
    height: 100vh;
    scroll-behavior: smooth;
  }

  .main-content::-webkit-scrollbar {
    width: 8px;
  }
  .main-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .main-content::-webkit-scrollbar-thumb {
    background: var(--surface-container-high);
    border-radius: 10px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .welcome-title {
    font-family: 'Outfit', sans-serif;
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 4px;
    color: #0f2318;
  }

  .subheading {
    font-size: 1rem;
    color: #64748b;
    font-weight: 500;
  }

  .page-surface {
    padding: 32px 48px;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Admin Dashboard Components */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }

  .dash-card {
    background: white;
    padding: 32px;
    border-radius: 32px;
    border: 1px solid var(--outline-variant);
    transition: all 0.3s;
  }

  .dash-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.04);
  }

  .card-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-val {
    font-family: 'Outfit', sans-serif;
    font-size: 2.5rem;
    color: var(--on-surface);
    font-weight: 700;
    line-height: 1.1;
  }

  /* Table Styles */
  .data-table-container {
    background: white;
    border-radius: 32px;
    border: 1px solid var(--outline-variant);
    overflow: hidden;
    margin-top: 24px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
    background: var(--surface-container-low);
    padding: 16px 24px;
    text-align: left;
    font-weight: 700;
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .data-table td {
    padding: 16px 24px;
    border-top: 1px solid var(--surface-container-high);
    color: var(--on-surface);
    font-size: 0.95rem;
  }

  .data-table tr:hover {
    background: var(--surface-container-lowest);
  }

  /* Button Styles */
  .btn-primary {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(26, 107, 46, 0.2);
  }

  .btn-delete {
    background: #fef2f2;
    color: #ef4444;
    border: none;
    padding: 8px 16px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
  }

  .btn-delete:hover {
    background: #ef4444;
    color: white;
  }

  /* Form Styles */
  .profile-form {
    background: white;
    padding: 40px;
    border-radius: 32px;
    border: 1px solid var(--outline-variant);
    max-width: 800px;
  }

  .form-row {
    margin-bottom: 24px;
  }

  .form-row label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 8px;
    text-transform: uppercase;
    padding-left: 4px;
  }

  .form-row input, .form-row select, .form-row textarea {
    width: 100%;
    padding: 14px 20px;
    border: 2px solid var(--surface-container-high);
    border-radius: 14px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
  }

  .form-row input:focus {
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px rgba(26, 107, 46, 0.05);
  }

  /* Success/Error Msgs */
  .success-msg, .error-msg {
    padding: 16px 20px;
    border-radius: 14px;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .success-msg { background: #ecfdf5; color: #059669; border: 1px solid rgba(5, 150, 105, 0.1); }
  .error-msg { background: #fef2f2; color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.1); }

  /* Destination Specific */
  .upload-zone {
    border: 2px dashed var(--outline-variant);
    border-radius: 24px;
    padding: 40px;
    text-align: center;
    background: var(--surface-container-low);
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }

  .upload-zone:hover {
    border-color: var(--primary);
    background: var(--surface-container-high);
  }

  .upload-zone.has-image {
    padding: 0;
    height: 240px;
    border-style: solid;
  }

  .remove-img-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: white;
    color: #ef4444;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    border: none;
    z-index: 10;
    font-size: 1.5rem;
    transition: all 0.2s;
  }

  .remove-img-btn:hover {
    transform: scale(1.1);
  }

    .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
  }

  /* Premium Profile Styles */
  .glass-chip {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(8px);
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 700;
    color: white;
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
`;


export default function AdminDashboard() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [user, setUser] = React.useState(storedUser);
    const [activeTab, setActiveTab] = React.useState('Control Panel');
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    // Profile State
    const [isEditingProfile, setIsEditingProfile] = React.useState(false);
    const [profileData, setProfileData] = React.useState({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        profile_image: user.profile_image || '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [profileMsg, setProfileMsg] = React.useState({ type: '', text: '' });

    // Add Admin State
    const [newAdmin, setNewAdmin] = React.useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [adminErrors, setAdminErrors] = React.useState({});
    const [adminMsg, setAdminMsg] = React.useState({ type: '', text: '' });
    const [editingAdminId, setEditingAdminId] = React.useState(null);
    const [showAdminModal, setShowAdminModal] = React.useState(false);


    // Management Lists State
    const [adminsList, setAdminsList] = React.useState([]);
    const [usersList, setUsersList] = React.useState([]);
    const [driversList, setDriversList] = React.useState([]);
    const [destinationsList, setDestinationsList] = React.useState([]);
    const [reviewsList, setReviewsList] = React.useState([]);
    const [paymentsList, setPaymentsList] = React.useState([]);


    // Add/Edit Destination State
    const [newDestination, setNewDestination] = React.useState({ name: '', category: '', district: '', lat: '', lng: '', description: '', image_url: '' });
    const [destinationMsg, setDestinationMsg] = React.useState({ type: '', text: '' });
    const [categoryError, setCategoryError] = React.useState('');
    const [editingDestinationId, setEditingDestinationId] = React.useState(null);
    const [destSearch, setDestSearch] = React.useState('');
    const [destCatFilter, setDestCatFilter] = React.useState('');
    const [destImageFile, setDestImageFile] = React.useState(null);
    const [destImagePreview, setDestImagePreview] = React.useState('');
    const [showDestinationModal, setShowDestinationModal] = React.useState(false);

    // District dropdown state
    const [districtSearch, setDistrictSearch] = React.useState('');
    const [showDistrictDropdown, setShowDistrictDropdown] = React.useState(false);
    const [filteredDistricts, setFilteredDistricts] = React.useState([]);

    // Bulk upload state
    const [bulkUploadMsg, setBulkUploadMsg] = React.useState({ type: '', text: '' });
    const [isUploadingCSV, setIsUploadingCSV] = React.useState(false);

    const sriLankanDistricts = [
        'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
        'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
        'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
        'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
        'Moneragala', 'Ratnapura', 'Kegalle'
    ];

    React.useEffect(() => {
        if (!user.token) return;

        // Ensure profile data is fresh
        fetch('http://localhost:5000/api/admin/profile', {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    setProfileData({
                        name: data.name || '',
                        username: data.username,
                        email: data.email,
                        phone: data.phone || '',
                        dob: data.dob || '',
                        profile_image: data.profile_image || '',
                        password: ''
                    });
                }
            })
            .catch(console.error);

    }, [user.token]);

    React.useEffect(() => {
        if (!user.token) return;
        const headers = { Authorization: `Bearer ${user.token}` };

        if (activeTab === 'Manage Admins') {
            fetch('http://localhost:5000/api/admin/admins', { headers })
                .then(res => res.json()).then(data => setAdminsList(Array.isArray(data) ? data : []));
        } else if (activeTab === 'Manage Users') {
            fetch('http://localhost:5000/api/admin/users', { headers })
                .then(res => res.json()).then(data => setUsersList(Array.isArray(data) ? data : []));
        } else if (activeTab === 'Manage Drivers') {
            fetch('http://localhost:5000/api/admin/drivers', { headers })
                .then(res => res.json()).then(data => setDriversList(Array.isArray(data) ? data : []));
        } else if (activeTab === 'Destinations') {
            fetch('http://localhost:5000/api/destinations', { headers })
                .then(res => res.json()).then(data => setDestinationsList(Array.isArray(data) ? data : []));
        } else if (activeTab === 'Reviews' || activeTab === 'Control Panel') {
            fetch('http://localhost:5000/api/reviews', { headers })
                .then(res => res.json())
                .then(data => setReviewsList(Array.isArray(data) ? data : []))
                .catch(console.error);
        }

        if (activeTab === 'Transactions' || activeTab === 'Control Panel') {
            fetch('http://localhost:5000/api/payments', { headers })
                .then(res => res.json())
                .then(data => setPaymentsList(Array.isArray(data) ? data : []))
                .catch(console.error);
        }
    }, [activeTab, user.token]);

    const handleModerateReview = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:5000/api/reviews/${id}/moderate`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                setReviewsList(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            } else {
                console.error('Failed to moderate review');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            const url = type === 'destination'
                ? `http://localhost:5000/api/destinations/${id}`
                : type === 'review'
                    ? `http://localhost:5000/api/reviews/${id}`
                    : `http://localhost:5000/api/admin/${type}s/${id}`;

            const res = await fetch(url, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                if (type === 'admin') setAdminsList(prev => prev.filter(a => a.id !== id));
                if (type === 'user') setUsersList(prev => prev.filter(u => u.id !== id));
                if (type === 'driver') setDriversList(prev => prev.filter(d => d.id !== id));
                if (type === 'destination') setDestinationsList(prev => prev.filter(d => d.id !== id));
                if (type === 'review') setReviewsList(prev => prev.filter(r => r.id !== id));
            } else {
                const data = await res.json();
                alert(data.message || 'Error deleting');
            }
        } catch (err) {
            alert('Failed to delete');
        }
    };


    const handleAddDestination = async (e) => {
        e.preventDefault();
        const currentCategories = newDestination.category ? newDestination.category.split(', ') : [];
        if (currentCategories.length === 0) {
            setCategoryError('Please select at least one category');
            return;
        }

        try {
            // Validate Image presence
            if (!destImageFile && !newDestination.image_url) {
                setDestinationMsg({ type: 'error', text: 'A background image is required for every destination' });
                return;
            }

            let finalImageUrl = newDestination.image_url;


            // 1. Upload image if file selected
            if (destImageFile) {
                const formData = new FormData();
                formData.append('destImage', destImageFile);

                const uploadRes = await fetch('http://localhost:5000/api/upload/destination', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${user.token}` },
                    body: formData
                });
                const uploadData = await uploadRes.json();
                if (uploadRes.ok) {
                    finalImageUrl = uploadData.imageUrl;
                } else {
                    setDestinationMsg({ type: 'error', text: uploadData.message || 'Image upload failed' });
                    return;
                }
            }

            const url = editingDestinationId
                ? `http://localhost:5000/api/destinations/${editingDestinationId}`
                : 'http://localhost:5000/api/destinations';

            const method = editingDestinationId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify({ ...newDestination, image_url: finalImageUrl })
            });
            const data = await res.json();
            if (res.ok) {
                if (editingDestinationId) {
                    setDestinationsList(prev => prev.map(d => d.id === editingDestinationId ? data : d));
                    setDestinationMsg({ type: 'success', text: 'Destination updated successfully!' });
                } else {
                    setDestinationsList(prev => [...prev, data]);
                    setDestinationMsg({ type: 'success', text: 'Destination added successfully!' });
                }
                setNewDestination({ name: '', category: '', district: '', lat: '', lng: '', description: '', image_url: '' });
                setDestImageFile(null);
                setDestImagePreview('');
                setEditingDestinationId(null);
                setShowDestinationModal(false);
                setTimeout(() => setDestinationMsg({ type: '', text: '' }), 3000);
            } else {
                setDestinationMsg({ type: 'error', text: data.message || 'Error saving destination' });
            }
        } catch (err) {
            setDestinationMsg({ type: 'error', text: 'Server error saving destination' });
        }
    };

    const handleDestImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDestImageFile(file);
            setDestImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditDestinationSetup = (dest) => {
        setEditingDestinationId(dest.id);
        setNewDestination({
            name: dest.name || '',
            category: dest.category || '',
            district: dest.district || '',
            lat: dest.lat || '',
            lng: dest.lng || '',
            description: dest.description || '',
            image_url: dest.image_url || ''
        });
        setShowDestinationModal(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditDestination = () => {
        setEditingDestinationId(null);
        setNewDestination({ name: '', category: '', district: '', lat: '', lng: '', description: '', image_url: '' });
        setDestImageFile(null);
        setDestImagePreview('');
        setDestinationMsg({ type: '', text: '' });
        setShowDestinationModal(false);
        setDistrictSearch('');
        setShowDistrictDropdown(false);
    };

    // District dropdown handlers
    const handleDistrictInputChange = (e) => {
        const value = e.target.value;
        setNewDestination({ ...newDestination, district: value });
        setDistrictSearch(value);

        if (value.length > 0) {
            const filtered = sriLankanDistricts.filter(d =>
                d.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredDistricts(filtered);
            setShowDistrictDropdown(true);
        } else {
            setShowDistrictDropdown(false);
        }
    };

    const handleDistrictSelect = (district) => {
        setNewDestination({ ...newDestination, district });
        setDistrictSearch(district);
        setShowDistrictDropdown(false);
    };

    const handleDistrictInputFocus = () => {
        if (districtSearch.length > 0) {
            const filtered = sriLankanDistricts.filter(d =>
                d.toLowerCase().includes(districtSearch.toLowerCase())
            );
            setFilteredDistricts(filtered);
        } else {
            setFilteredDistricts(sriLankanDistricts);
        }
        setShowDistrictDropdown(true);
    };

    const handleDistrictInputBlur = () => {
        setTimeout(() => setShowDistrictDropdown(false), 200);
    };

    // Bulk upload handler
    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setBulkUploadMsg({ type: 'error', text: 'Please upload a CSV file' });
            return;
        }

        setIsUploadingCSV(true);
        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            const res = await fetch('http://localhost:5000/api/destinations/bulk-upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` },
                body: formData
            });
            const data = await res.json();

            if (res.ok) {
                setBulkUploadMsg({ type: 'success', text: `Successfully uploaded ${data.created} destinations!` });
                // Refresh destinations list
                const destRes = await fetch('http://localhost:5000/api/destinations', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const destData = await destRes.json();
                setDestinationsList(Array.isArray(destData) ? destData : []);
            } else {
                setBulkUploadMsg({
                    type: 'error',
                    text: data.message || 'Upload failed. Please check the format.'
                });
            }
        } catch (err) {
            setBulkUploadMsg({ type: 'error', text: 'Server error during upload' });
        } finally {
            setIsUploadingCSV(false);
            e.target.value = '';
        }
    };

    const downloadTemplate = () => {
        window.open('http://localhost:5000/api/destinations/template', '_blank');
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you absolutely sure you want to permanently delete your admin account? This action cannot be undone.")) return;

        try {
            const res = await fetch('http://localhost:5000/api/admin/profile', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                alert("Account successfully deleted.");
                handleLogout();
            } else {
                const data = await res.json();
                alert(data.message || 'Error deleting account');
            }
        } catch (err) {
            alert('Failed to delete account');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (profileData.password && profileData.password !== confirmPassword) {
            setProfileMsg({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (res.ok) {
                setProfileMsg({ type: 'success', text: 'Admin profile updated successfully!' });
                const updated = { ...user, ...data };
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                setIsEditingProfile(false);
                setProfileData(prev => ({ ...prev, password: '' }));
                setConfirmPassword('');
                setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000);
            } else {
                setProfileMsg({ type: 'error', text: data.message || 'Update failed' });
            }
        } catch (error) {
            setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
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
                // If not in edit mode, update immediately
                if (!isEditingProfile) {
                    await fetch('http://localhost:5000/api/admin/profile', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`
                        },
                        body: JSON.stringify({ profile_image: data.imageUrl })
                    });
                    // Refresh data
                    const profileRes = await fetch('http://localhost:5000/api/admin/profile', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    const profileData = await profileRes.json();
                    const updatedUser = { ...user, ...profileData };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                }
            }
        } catch (err) {
            console.error('Upload Error:', err);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();

        // Comprehensive validation
        const errors = {};
        if (!newAdmin.username.trim()) {
            errors.username = 'Username is required';
        } else if (newAdmin.username.trim().length < 4) {
            errors.username = 'Username must be at least 4 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(newAdmin.username)) {
            errors.username = 'Usernames can only contain letters, numbers, and underscores';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!newAdmin.email) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(newAdmin.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!editingAdminId && !newAdmin.password) {
            errors.password = 'Password is required';
        } else if (newAdmin.password && newAdmin.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (newAdmin.confirmPassword !== newAdmin.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setAdminErrors(errors);

        if (Object.keys(errors).length > 0) {
            return setAdminMsg({ type: 'error', text: 'Please resolve the validation errors above.' });
        }


        try {
            const url = editingAdminId
                ? `http://localhost:5000/api/admin/admins/${editingAdminId}`
                : 'http://localhost:5000/api/admin/admins';

            const method = editingAdminId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify(newAdmin)
            });
            const data = await res.json();
            if (res.ok) {
                if (editingAdminId) {
                    setAdminsList(prev => prev.map(a => a.id === editingAdminId ? data : a));
                    setAdminMsg({ type: 'success', text: 'Admin account updated successfully!' });
                } else {
                    setAdminsList(prev => [...prev, data]);
                    setAdminMsg({ type: 'success', text: `Admin ${data.username} created successfully!` });
                }
                setNewAdmin({ username: '', email: '', password: '', confirmPassword: '' });
                setEditingAdminId(null);
                setShowAdminModal(false);
                setTimeout(() => setAdminMsg({ type: '', text: '' }), 3000);
            } else {
                setAdminMsg({ type: 'error', text: data.message || 'Operation failed' });
            }
        } catch (error) {
            setAdminMsg({ type: 'error', text: 'Server error managing admin.' });
        }
    };

    const handleEditAdminSetup = (admin) => {
        setEditingAdminId(admin.id);
        setNewAdmin({
            username: admin.username,
            email: admin.email,
            password: '', // Reset password for security/convenience
            confirmPassword: ''
        });

        setShowAdminModal(true);
        // Scroll to form if needed
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditAdmin = () => {
        setEditingAdminId(null);
        setNewAdmin({ username: '', email: '', password: '', confirmPassword: '' });
        setAdminErrors({});
        setAdminMsg({ type: '', text: '' });
        setShowAdminModal(false);
    };

    const renderContent = () => {
        if (activeTab === 'Profile') {
            return (
                <div className="page-surface">
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
                                        {profileData.profile_image ? (
                                            <img src={`http://localhost:5000${profileData.profile_image}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary)' }}>person_filled</span>
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
                                            {profileData.name || profileData.username}
                                            <span className="glass-chip" style={{ fontSize: '0.7rem', verticalAlign: 'middle', marginLeft: '16px', background: 'rgba(26,107,46,0.1)', color: 'var(--primary)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span> System {user.role?.toUpperCase()}
                                            </span>
                                        </h2>
                                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '4px', textAlign: 'left' }}>
                                            Authorized Personnel since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>contact_page</span> Identity Details
                                    </h3>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            className={isEditingProfile ? "btn-delete" : "btn-primary"}
                                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{isEditingProfile ? 'close' : 'edit'}</span>
                                            {isEditingProfile ? 'Cancel' : 'Edit'}
                                        </button>
                                        {isEditingProfile && (
                                            <button onClick={handleProfileUpdate} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span> Save Changes
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {profileMsg.text && <div className={profileMsg.type === 'error' ? 'error-msg' : 'success-msg'}>{profileMsg.text}</div>}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    {[
                                        { label: 'Full Name', key: 'name', icon: 'person' },
                                        { label: 'System Username', key: 'username', icon: 'alternate_email' },
                                        { label: 'Email Address', key: 'email', icon: 'mail', type: 'email' },
                                        { label: 'Contact Number', key: 'phone', icon: 'call' },
                                        { label: 'Birth Date', key: 'dob', icon: 'calendar_month', type: 'date' },
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
                                                        value={profileData[field.key]}
                                                        onChange={e => setProfileData({ ...profileData, [field.key]: e.target.value })}
                                                        style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 600, outline: 'none' }}
                                                        disabled={field.key === 'username' && user.username === 'admin'}
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
                                                placeholder="Confirm New Password"
                                                className="input-field"
                                                style={{ fontSize: '0.9rem' }}
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>Update Security Pass</button>
                                    </form>
                                </div>

                                {/* Danger Zone */}
                                {user.username !== 'admin' && (
                                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '32px', borderRadius: '40px', border: '1px dashed #ef4444' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '12px', color: '#ef4444' }}>Danger Zone</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Permanently remove your administrative access. This action is irreversible.</p>
                                        <button onClick={handleDeleteAccount} className="btn-white" style={{ width: '100%', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', padding: '12px' }}>Resign from System</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === 'Manage Admins') {
            return (
                <div className="page-surface" style={{ padding: '0 48px 32px' }}>
                    <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 className="welcome-title" style={{ textAlign: 'left' }}>Admin Management</h1>
                            <p className="subheading" style={{ textAlign: 'left' }}>System Administrator control and access management</p>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                cancelEditAdmin();
                                setShowAdminModal(true);
                            }}
                            style={{ padding: '14px 28px' }}
                        >
                            <span className="material-symbols-outlined">person_add</span>
                            Create New Admin
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '1200px' }}>

                        {/* Add/Edit Admin Modal Overlay */}
                        {showAdminModal && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(15, 35, 24, 0.4)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000,
                                animation: 'fadeIn 0.3s ease-out'
                            }} onClick={cancelEditAdmin}>
                                <div style={{
                                    background: 'white',
                                    padding: '40px',
                                    borderRadius: '40px',
                                    border: '1px solid var(--outline-variant)',
                                    boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
                                    maxWidth: '600px',
                                    width: '90%',
                                    position: 'relative'
                                }} onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
                                                {editingAdminId ? 'edit_square' : 'person_add'}
                                            </span>
                                            {editingAdminId ? 'Edit Administrator' : 'Create New Administrator'}
                                        </h3>
                                        <button
                                            onClick={cancelEditAdmin}
                                            className="btn-delete"
                                            style={{ padding: '8px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
                                        </button>
                                    </div>

                                    {adminMsg.text && <div className={adminMsg.type === 'error' ? 'error-msg' : 'success-msg'}>{adminMsg.text}</div>}

                                    <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>Username</label>
                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', color: 'var(--primary)', opacity: 0.6 }}>alternate_email</span>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    style={{ paddingLeft: '48px', borderColor: adminErrors.username ? '#ef4444' : '' }}
                                                    value={newAdmin.username}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setNewAdmin({ ...newAdmin, username: val });
                                                        if (adminErrors.username) setAdminErrors({ ...adminErrors, username: '' });
                                                    }}
                                                    required
                                                    placeholder="admin_id"
                                                    disabled={editingAdminId && newAdmin.username === 'admin'}
                                                />
                                            </div>
                                            {adminErrors.username && <span style={{ color: '#ef4444', fontSize: '0.7rem', display: 'block', marginTop: '6px', paddingLeft: '4px', fontWeight: 600 }}>{adminErrors.username}</span>}
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>Email Address</label>
                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', color: 'var(--primary)', opacity: 0.6 }}>mail</span>
                                                <input
                                                    type="email"
                                                    className="input-field"
                                                    style={{ paddingLeft: '48px', borderColor: adminErrors.email ? '#ef4444' : '' }}
                                                    value={newAdmin.email}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setNewAdmin({ ...newAdmin, email: val });
                                                        if (adminErrors.email) setAdminErrors({ ...adminErrors, email: '' });
                                                    }}
                                                    required
                                                    placeholder="admin@surangatours.com"
                                                />
                                            </div>
                                            {adminErrors.email && <span style={{ color: '#ef4444', fontSize: '0.7rem', display: 'block', marginTop: '6px', paddingLeft: '4px', fontWeight: 600 }}>{adminErrors.email}</span>}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>
                                                    {editingAdminId ? 'New Password' : 'Password'}
                                                </label>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', color: 'var(--primary)', opacity: 0.6 }}>lock</span>
                                                    <input
                                                        type="password"
                                                        className="input-field"
                                                        style={{ paddingLeft: '48px', borderColor: adminErrors.password ? '#ef4444' : '' }}
                                                        value={newAdmin.password}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            setNewAdmin({ ...newAdmin, password: val });
                                                            if (adminErrors.password) setAdminErrors({ ...adminErrors, password: '' });
                                                        }}
                                                        required={!editingAdminId}
                                                        placeholder={editingAdminId ? 'Optional' : '••••••••'}
                                                    />
                                                </div>
                                                {adminErrors.password && <span style={{ color: '#ef4444', fontSize: '0.7rem', display: 'block', marginTop: '6px', paddingLeft: '4px', fontWeight: 600 }}>{adminErrors.password}</span>}
                                            </div>

                                            <div>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>Confirm</label>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', color: 'var(--primary)', opacity: 0.6 }}>shield_lock</span>
                                                    <input
                                                        type="password"
                                                        className="input-field"
                                                        style={{ paddingLeft: '48px', borderColor: adminErrors.confirmPassword ? '#ef4444' : '' }}
                                                        value={newAdmin.confirmPassword}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            setNewAdmin({ ...newAdmin, confirmPassword: val });
                                                            if (adminErrors.confirmPassword) setAdminErrors({ ...adminErrors, confirmPassword: '' });
                                                        }}
                                                        required={!!newAdmin.password || !editingAdminId}
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                {adminErrors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '0.7rem', display: 'block', marginTop: '6px', paddingLeft: '4px', fontWeight: 600 }}>{adminErrors.confirmPassword}</span>}
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', marginTop: '8px', justifyContent: 'center' }}>
                                            <span className="material-symbols-outlined">{editingAdminId ? 'check_circle' : 'person_add'}</span>
                                            {editingAdminId ? 'Update Admin' : 'Create Admin'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}


                        {/* Admins List Table */}
                        <div style={{ background: 'white', border: '1px solid var(--outline-variant)', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                            <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--surface-container-high)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: 'var(--on-surface)' }}>System Administrators</h3>
                                <span className="glass-chip" style={{ background: 'var(--surface-container-low)', color: 'var(--primary)', border: '1px solid var(--outline-variant)' }}>{adminsList.length} Total</span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Administrator</th>
                                            <th>Email & Role</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminsList.map(a => (
                                            <tr key={a.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: a.username === 'admin' ? 'linear-gradient(135deg, #1a6b2e, #4ade80)' : 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.username === 'admin' ? 'white' : 'var(--primary)', fontWeight: 700 }}>
                                                            {a.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 700, color: '#0f2318' }}>
                                                                {a.username}
                                                                {a.username === 'admin' && <span style={{ marginLeft: '8px', color: '#7b5500', fontSize: '0.65rem', background: '#ffdeac', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle' }}>ROOT</span>}
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>#{a.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{a.email}</div>
                                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 800 }}>{a.role}</span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        {a.username !== 'admin' && (
                                                            <button
                                                                onClick={() => handleEditAdminSetup(a)}
                                                                className="btn-primary"
                                                                style={{ padding: '8px 12px', background: 'var(--surface-container-low)', color: 'var(--primary)', borderRadius: '10px' }}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                                            </button>
                                                        )}
                                                        {a.username !== 'admin' && a.id !== user.id && (
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => handleDelete('admin', a.id)}
                                                                style={{ padding: '8px 12px', borderRadius: '10px' }}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {adminsList.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Loading administrators...</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }


        if (activeTab === 'Manage Users') {
            return (
                <div>
                    <h2 style={{ fontFamily: "'Outfit'", color: '#0f2318', fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Registered Tourists</h2>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone || 'N/A'}</td>
                                        <td>
                                            <button className="btn-delete" onClick={() => handleDelete('user', u.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {usersList.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>No users found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (activeTab === 'Manage Drivers') {
            return (
                <div>
                    <h2 style={{ fontFamily: "'Outfit'", color: '#0f2318', fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Driver Fleet</h2>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>License No</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {driversList.map(d => (
                                    <tr key={d.id}>
                                        <td>{d.id}</td>
                                        <td>{d.name}</td>
                                        <td>{d.username}</td>
                                        <td>{d.license_no}</td>
                                        <td>
                                            {d.status === 'available' && <span style={{ color: '#059669', background: '#ecfdf5', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>Available</span>}
                                            {d.status === 'on_trip' && <span style={{ color: '#b45309', background: '#fef3c7', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>On Trip</span>}
                                            {d.status === 'unavailable' && <span style={{ color: '#b91c1c', background: '#fee2e2', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>Unavailable</span>}
                                        </td>
                                        <td>
                                            <button className="btn-delete" onClick={() => handleDelete('driver', d.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {driversList.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>No drivers found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (activeTab === 'Destinations') {
            const categories = ["Beach", "Wildlife", "History", "Culture", "Nature", "Religious", "Adventure", "City", "Food"];
            const filteredDestinations = destinationsList.filter(d => {
                const searchLower = destSearch.toLowerCase();
                const matchSearch = d.name?.toLowerCase().includes(searchLower) || d.district?.toLowerCase().includes(searchLower);
                const matchCat = destCatFilter ? d.category.includes(destCatFilter) : true;
                return matchSearch && matchCat;
            });

            const toggleCategory = (cat) => {
                const currentCats = newDestination.category ? newDestination.category.split(', ') : [];
                const updatedCats = currentCats.includes(cat)
                    ? currentCats.filter(c => c !== cat)
                    : [...currentCats, cat];
                setNewDestination({ ...newDestination, category: updatedCats.join(', ') });

                if (updatedCats.length > 0) {
                    setCategoryError('');
                }
            };

            return (
                <div className="page-surface" style={{ padding: '0 48px 32px' }}>
                    <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 className="welcome-title" style={{ textAlign: 'left' }}>Destination Management</h1>
                            <p className="subheading" style={{ textAlign: 'left' }}>Add and manage tourism hotspots for trip explorers</p>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                cancelEditDestination();
                                setShowDestinationModal(true);
                            }}
                            style={{ padding: '14px 28px' }}
                        >
                            <span className="material-symbols-outlined">add_location_alt</span>
                            Add New Destination
                        </button>
                    </div>

                    {/* Bulk Upload Section */}
                    <div style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '32px',
                        border: '1px solid var(--outline-variant)',
                        marginBottom: '32px'
                    }}>
                        <h3 style={{
                            fontFamily: "'Outfit'",
                            color: '#0f2318',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>upload_file</span>
                            Bulk Upload Destinations
                        </h3>
                        <p style={{
                            color: '#64748b',
                            fontSize: '0.875rem',
                            marginBottom: '24px'
                        }}>Upload multiple destinations at once using a CSV file.</p>

                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            {/* Download Template Button */}
                            <button
                                type="button"
                                onClick={downloadTemplate}
                                style={{
                                    background: 'var(--surface-container)',
                                    color: 'var(--primary)',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    fontFamily: "'Outfit'",
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-container-high)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface-container)'}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                                Download Template
                            </button>

                            {/* Upload CSV Button */}
                            <label
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: isUploadingCSV ? 'var(--surface-container)' : 'var(--primary)',
                                    color: isUploadingCSV ? '#64748b' : 'white',
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    fontFamily: "'Outfit'",
                                    cursor: isUploadingCSV ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: isUploadingCSV ? 0.6 : 1
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                    {isUploadingCSV ? 'hourglass_empty' : 'folder_open'}
                                </span>
                                {isUploadingCSV ? 'Uploading...' : 'Upload CSV File'}
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleBulkUpload}
                                    style={{ display: 'none' }}
                                    disabled={isUploadingCSV}
                                />
                            </label>
                        </div>

                        {bulkUploadMsg.text && (
                            <div style={{
                                marginTop: '20px',
                                marginBottom: 0,
                                padding: '12px 16px',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                background: bulkUploadMsg.type === 'error' ? '#fef2f2' : '#f0fdf4',
                                color: bulkUploadMsg.type === 'error' ? '#dc2626' : '#16a34a',
                                border: `1px solid ${bulkUploadMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`
                            }}>
                                {bulkUploadMsg.text}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* Add/Edit Destination Modal */}
                        {showDestinationModal && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(15, 35, 24, 0.4)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000,
                                animation: 'fadeIn 0.3s ease-out'
                            }} onClick={cancelEditDestination}>
                                <div style={{
                                    background: 'white',
                                    padding: '40px',
                                    borderRadius: '40px',
                                    border: '1px solid var(--outline-variant)',
                                    boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
                                    width: '90%',
                                    maxWidth: '850px',
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    position: 'relative'
                                }} onClick={e => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>
                                                {editingDestinationId ? 'edit_location_alt' : 'add_location_alt'}
                                            </span>
                                            {editingDestinationId ? 'Edit Destination Details' : 'Create New Destination'}
                                        </h3>
                                        <button
                                            onClick={cancelEditDestination}
                                            style={{ background: 'var(--surface-container-low)', color: '#64748b', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>

                                    {destinationMsg.text && <div className={destinationMsg.type === 'error' ? 'error-msg' : 'success-msg'}>{destinationMsg.text}</div>}

                                    <form onSubmit={handleAddDestination} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                        {/* Form Body - Reorganized for Usability */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                                            {/* Section 1: Basic Information */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                                                <div>
                                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>Destination Name</label>
                                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', color: 'var(--primary)', opacity: 0.6 }}>location_on</span>
                                                        <input
                                                            type="text"
                                                            className="input-field"
                                                            style={{ paddingLeft: '48px' }}
                                                            value={newDestination.name}
                                                            onChange={e => setNewDestination({ ...newDestination, name: e.target.value })}
                                                            required
                                                            placeholder="e.g. Temple of the Tooth"
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ position: 'relative' }}> {/* ← ADD THIS: Make this the positioning context */}
                                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>District</label>
                                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', color: 'var(--primary)', opacity: 0.6 }}>map</span>
                                                        <input
                                                            type="text"
                                                            className="input-field"
                                                            style={{ paddingLeft: '48px' }}
                                                            value={newDestination.district}
                                                            onChange={handleDistrictInputChange}
                                                            onFocus={handleDistrictInputFocus}
                                                            onBlur={handleDistrictInputBlur}
                                                            required
                                                            placeholder="Type to search districts..."
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    {showDistrictDropdown && (
                                                        <ul style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            right: 0,
                                                            background: 'white',
                                                            border: '2px solid var(--surface-container-high)',
                                                            borderRadius: '14px',
                                                            marginTop: '4px',
                                                            maxHeight: '200px',
                                                            overflowY: 'auto',
                                                            zIndex: 9999,
                                                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                                        }}>
                                                            {filteredDistricts.length > 0 ? (
                                                                filteredDistricts.map(district => (
                                                                    <div
                                                                        key={district}
                                                                        onClick={() => handleDistrictSelect(district)}
                                                                        style={{
                                                                            padding: '12px 16px',
                                                                            cursor: 'pointer',
                                                                            borderBottom: '1px solid var(--surface-container-high)',
                                                                            transition: 'background 0.2s',
                                                                            color: newDestination.district === district ? 'var(--primary)' : 'var(--on-surface)',
                                                                            fontWeight: newDestination.district === district ? 700 : 400
                                                                        }}
                                                                        onMouseOver={(e) => e.target.style.background = 'var(--surface-container-low)'}
                                                                        onMouseOut={(e) => e.target.style.background = 'white'}
                                                                    >
                                                                        {district}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div style={{ padding: '12px 16px', color: '#64748b' }}>No districts found</div>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Section 2: Atmosphere & Classification */}
                                            <div>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '12px', paddingLeft: '4px' }}>
                                                    Category <span style={{ color: 'red' }}>*</span>
                                                </label>

                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                                    gap: '16px',
                                                    background: 'var(--surface-container-low)',
                                                    padding: '20px',
                                                    borderRadius: '24px',
                                                    border: `1px solid ${categoryError ? 'red' : 'var(--outline-variant)'}`
                                                }}>
                                                    {categories.map(cat => (
                                                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: newDestination.category?.includes(cat) ? 'var(--primary)' : '#64748b', transition: '0.2s' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={newDestination.category?.includes(cat)}
                                                                onChange={() => toggleCategory(cat)}
                                                                style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                                                            />
                                                            {cat}
                                                        </label>
                                                    ))}
                                                </div>
                                                {categoryError && <p style={{ color: 'red', fontSize: '0.75rem', marginTop: '8px', marginLeft: '4px' }}>{categoryError}</p>}
                                            </div>

                                            {/* Section 3: Geographic Coordinates & Descriptive Narrative */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '-12px', paddingLeft: '4px' }}>Geography</label>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Latitude</label>
                                                            <input type="number" step="any" className="input-field" style={{ padding: '12px' }} value={newDestination.lat} onChange={e => setNewDestination({ ...newDestination, lat: e.target.value })} placeholder="0.0000" required />
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Longitude</label>
                                                            <input type="number" step="any" className="input-field" style={{ padding: '12px' }} value={newDestination.lng} onChange={e => setNewDestination({ ...newDestination, lng: e.target.value })} placeholder="0.0000" required />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>Destination Image</label>

                                                        <div
                                                            className={`upload-zone ${(destImagePreview || newDestination.image_url) ? 'has-image' : ''}`}
                                                            onClick={() => !destImagePreview && !newDestination.image_url && document.getElementById('dest-upload').click()}
                                                            style={{
                                                                height: '160px',
                                                                borderRadius: '24px',
                                                                border: (destImagePreview || newDestination.image_url) ? 'none' : '2px dashed var(--outline-variant)',
                                                                background: 'var(--surface-container-high)'
                                                            }}
                                                        >
                                                            {(destImagePreview || newDestination.image_url) ? (
                                                                <>
                                                                    <button type="button" className="remove-img-btn" onClick={(e) => { e.stopPropagation(); setDestImageFile(null); setDestImagePreview(''); setNewDestination({ ...newDestination, image_url: '' }); }}>
                                                                        <span className="material-symbols-outlined">delete</span>
                                                                    </button>
                                                                    <img src={destImagePreview || `http://localhost:5000${newDestination.image_url}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                                                </>
                                                            ) : (
                                                                <div style={{ pointerEvents: 'none', textAlign: 'center', padding: '0 20px' }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '8px' }}>image</span>
                                                                    <div style={{ fontWeight: 700, color: '#0f2318', fontSize: '0.9rem' }}>Upload Photo</div>
                                                                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>
                                                                        Accepted formats: JPG, JPEG, PNG, WEBP<br />
                                                                        Max file size: 5MB
                                                                    </div>
                                                                </div>

                                                            )}
                                                            <input id="dest-upload" type="file" accept="image/*" onChange={handleDestImageChange} style={{ display: 'none' }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>Description</label>
                                                    <textarea
                                                        style={{ width: '100%', padding: '20px', border: '2px solid var(--surface-container-high)', borderRadius: '24px', fontFamily: "'Inter', sans-serif", outline: 'none', height: '240px', resize: 'none', lineHeight: '1.6' }}
                                                        value={newDestination.description} onChange={e => setNewDestination({ ...newDestination, description: e.target.value })}
                                                        placeholder="What makes this destination special? Describe its atmosphere, highlights, and history..."
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                            <button
                                                type="submit"
                                                className="btn-primary"
                                                style={{
                                                    flex: 1,
                                                    padding: '22px',
                                                    justifyContent: 'center',
                                                    fontSize: '1.05rem',
                                                    letterSpacing: '0.02em',
                                                    boxShadow: '0 12px 24px rgba(15, 35, 24, 0.12)',
                                                    transition: '0.3s transform ease, 0.3s box-shadow ease'
                                                }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                                                    {editingDestinationId ? 'check_circle' : 'add_location'}
                                                </span>
                                                {editingDestinationId ? 'Update Destination Data' : 'Create Destination'}
                                            </button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                        )}

                        {/* Search and Filters Header */}
                        <div style={{ background: 'white', padding: '24px 32px', borderRadius: '32px', border: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '400px' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>search</span>
                                <input
                                    type="text"
                                    placeholder="Looking for a specific spot or district?"
                                    value={destSearch}
                                    onChange={e => setDestSearch(e.target.value)}
                                    style={{ width: '100%', padding: '14px 16px 14px 48px', border: '2px solid var(--surface-container-high)', borderRadius: '14px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {["", ...categories].slice(0, 6).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setDestCatFilter(cat)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '50px',
                                            border: '1px solid var(--outline-variant)',
                                            background: destCatFilter === cat ? 'var(--primary)' : 'white',
                                            color: destCatFilter === cat ? 'white' : '#64748b',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            transition: '0.2s'
                                        }}
                                    >
                                        {cat || 'All Types'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Destinations Grid Table */}
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '120px' }}>Identity</th>
                                        <th>Location details</th>
                                        <th>Category</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDestinations.map(d => (
                                        <tr key={d.id}>
                                            <td>
                                                <div style={{ width: '100px', height: '64px', borderRadius: '12px', background: d.image_url ? `url(http://localhost:5000${d.image_url})` : 'var(--surface-container-high)', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--outline-variant)' }} />
                                            </td>
                                            <td style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: 700, color: '#0f2318' }}>{d.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                                                    {d.district}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {d.category.split(', ').map(c => (
                                                        <span key={c} style={{ background: 'var(--secondary-container)', color: 'var(--primary)', padding: '2px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800 }}>{c}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleEditDestinationSetup(d)} style={{ background: 'var(--surface-container-low)', color: 'var(--primary)', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit_location</span>
                                                    </button>
                                                    <button className="btn-delete" onClick={() => handleDelete('destination', d.id)} style={{ padding: '10px', borderRadius: '10px' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete_forever</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredDestinations.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '60px' }}>The search didn't reveal any matching destinations.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }


        if (activeTab === 'Reviews') {
            return (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontFamily: "'Outfit'", color: '#0f2318', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Review Moderation</h2>
                        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700, background: 'var(--secondary-container)', padding: '6px 16px', borderRadius: '50px' }}>
                            {reviewsList.length} Total Reviews
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {reviewsList.map(r => (
                            <div key={r.id} className="dash-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
                                            {r.User?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#0f2318' }}>{r.User?.name || 'Unknown Tourist'}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                                            <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: '600', color: r.status === 'accepted' ? '#059669' : r.status === 'rejected' ? '#dc2626' : '#f59e0b' }}>Status: {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : 'Pending'}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '8px' }}>
                                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            {r.status !== 'accepted' && <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }} onClick={() => handleModerateReview(r.id, 'accepted')}>Accept</button>}
                                            {r.status !== 'rejected' && <button style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '50px', padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }} onClick={() => handleModerateReview(r.id, 'rejected')}>Reject</button>}
                                            <button className="btn-delete" style={{ padding: '6px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }} onClick={() => handleDelete('review', r.id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                                <p style={{ color: '#0f2318', lineHeight: 1.6, padding: '16px', background: 'var(--surface-container-low)', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                                    "{r.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeTab === 'Transactions') {
            return (
                <div>
                    <h2 style={{ fontFamily: "'Outfit'", color: '#0f2318', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Global Transaction Log</h2>
                    <p style={{ color: '#64748b', marginBottom: '32px' }}>Monitor all completed automated payments from the PayHere gateway.</p>

                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Trace ID</th>
                                    <th>Date</th>
                                    <th>Linked Booking</th>
                                    <th>Amount (LKR)</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentsList.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.transaction_id || `PH_OLD_${p.id}`}</td>
                                        <td>{new Date(p.createdAt).toLocaleString()}</td>
                                        <td>#BOOKING_{p.booking_id || p.id}</td>
                                        <td style={{ fontWeight: 700 }}>{parseFloat(p.amount).toLocaleString()}</td>
                                        <td><span style={{ color: '#059669', background: '#ecfdf5', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>{p.status.toUpperCase()}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div className="card-grid">
                <div className="dash-card">
                    <div className="card-title">
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>group</span>
                        Tourists
                    </div>
                    <div className="card-val">{usersList.length || 0}</div>
                </div>
                <div className="dash-card">
                    <div className="card-title">
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>local_taxi</span>
                        Drivers
                    </div>
                    <div className="card-val">{driversList.length || 0}</div>
                </div>
                <div className="dash-card">
                    <div className="card-title">
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>map</span>
                        Destinations
                    </div>
                    <div className="card-val">{destinationsList.length || 0}</div>
                </div>
                <div className="dash-card">
                    <div className="card-title">
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>reviews</span>
                        Reviews
                    </div>
                    <div className="card-val">{reviewsList.length || 0}</div>
                </div>
            </div>
        );
    };

    const navItems = [
        { id: 'Control Panel', label: 'Overview', icon: 'dashboard' },
        { id: 'Manage Admins', label: 'Admins', icon: 'admin_panel_settings' },
        { id: 'Manage Users', label: 'Tourists', icon: 'group' },
        { id: 'Manage Drivers', label: 'Drivers', icon: 'local_taxi' },
        { id: 'Destinations', label: 'Destinations', icon: 'map' },
        { id: 'Reviews', label: 'Reviews', icon: 'reviews' },
        { id: 'Transactions', label: 'Payments', icon: 'payments' },
        { id: 'Profile', label: 'Profile Settings', icon: 'settings' }
    ];

    return (
        <>
            <style>{styles}</style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

            <div className="dash-container blurred-slide-in-right">
                <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: isCollapsed ? '0' : '8px' }}>
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
                        {navItems.map(item => (
                            <div
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </div>
                        ))}
                    </nav>

                    <div className="sb-footer" style={{ borderTop: '1px solid var(--surface-container-high)', paddingTop: '20px' }}>
                        <div
                            className="nav-item"
                            style={{ color: '#ef4444' }}
                            onClick={handleLogout}
                        >
                            <span className="material-symbols-outlined">logout</span>
                            {!isCollapsed && <span className="nav-label">Logout</span>}
                        </div>
                    </div>
                </aside>

                <main className="main-content">
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

                            <img
                                src={profileData.profile_image ? `http://localhost:5000${profileData.profile_image}` : (user.profile_image ? `http://localhost:5000${user.profile_image}` : "https://ui-avatars.com/api/?name=" + (user.username || 'A') + "&background=1a6b2e&color=fff")}
                                alt="Profile"
                                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 4px 12px rgba(26,107,46,0.15)', cursor: 'pointer' }}
                                onClick={() => setActiveTab('Profile')}
                            />
                        </div>
                    </nav>

                    <div className="page-surface">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </>
    );
}
