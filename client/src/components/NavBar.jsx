import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
    const { user } = useAuthContext();
    const location = useLocation();
    const { logout } = useLogout();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    // Function to determine if a path is active
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navcontainer">
                <Link to="/">
                    <h1 className="zest">Zest</h1>
                </Link>
                <div className="nav-buttons">
                    <button className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
                        <Link to="/">Home</Link>
                    </button>

                    {user && (
                        <button className={`nav-link ${isActive('/MyRecipes') ? 'active' : ''}`}>
                            <Link to="/MyRecipes">My Recipes</Link>
                        </button>
                    )}
                    
                    {user ? (
                        <>
                            {/* Show admin button only if user.role is 'admin' */}
                            {user.user.role === 'admin' && (
                                <button className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                                    <Link to="/admin">Admin</Link>
                                </button>
                            )}

                            <div className="profile-dropdown" ref={dropdownRef}>
                                <div 
                                    className="user-profile" 
                                    title={`Logged in as ${user.user.username || 'User'}`}
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="profile-icon"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0H4.5z"
                                        />
                                    </svg>
                                </div>
                                
                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <FontAwesomeIcon icon={faCog} className="dropdown-icon" />
                                            Settings
                                        </Link>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                            <Link to="/login">Login</Link>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
