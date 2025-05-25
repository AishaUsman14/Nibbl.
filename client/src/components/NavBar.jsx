import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const NavBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar">
            <div className="navcontainer">
                <h1 className="zest">Zest</h1>
                <div className="nav-buttons">
                    <button className="honey-jar"><Link to="/MyRecipes">My Recipes</Link></button>
                    <button className="homebtn"><Link to="/">Home</Link></button>

                    {user ? (
                        <>
                            <button className="homebtn" onClick={handleLogout}>Logout</button>
                            <div className="user-profile" title={`Logged in as ${user.username || 'User'}`}>
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
                        </>
                    ) : (
                        <button className="homebtn"><Link to="/login">Login</Link></button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
