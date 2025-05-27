import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/loginPage.jsx';
import Signup from './pages/signupPage.jsx';
import MyRecipes from './pages/MyRecipes.jsx';
import NavBar from './components/NavBar';
import { useAuthContext } from './hooks/useAuthContext';
import Footer from "./components/footer.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Settings from './pages/Settings';

function App() {
    const { user } = useAuthContext();

    return (
        <div className="App">
            <BrowserRouter>
                <NavBar />
                <div className="pages">
                    <Routes>
                        <Route 
                            path="/" 
                            element={user ? <Home /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/login" 
                            element={!user ? <Login /> : <Navigate to="/" />} 
                        />
                        <Route 
                            path="/signup" 
                            element={!user ? <Signup /> : <Navigate to="/" />} 
                        />
                        <Route 
                            path="/myrecipes" 
                            element={user ? <MyRecipes /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/admin/*" 
                            element={user && user.user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
                        />
                        <Route 
                            path="/settings" 
                            element={user ? <Settings /> : <Navigate to="/login" />} 
                        />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
