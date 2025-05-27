import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUtensils } from '@fortawesome/free-solid-svg-icons';
import '../components/icons.js'; // Make sure icons are properly imported

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section brand">
                    <h2 className="footer-logo">Zest</h2>
                    <p className="footer-tagline">
                        Discover delicious recipes and culinary inspiration
                    </p>
                </div>
                
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/myrecipes">My Recipes</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="copyright">
                    <p>&copy; {currentYear} Zest. All rights reserved.</p>
                </div>
                <div className="footer-credit">
                    <p>Made with <FontAwesomeIcon icon={faHeart} className="heartt-icon" /> and <FontAwesomeIcon icon={faUtensils} /></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
