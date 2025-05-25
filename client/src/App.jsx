import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/loginPage.jsx';
import Signup from './pages/signupPage.jsx';
import MyRecipes from './pages/MyRecipes.jsx';
import NavBar from './components/NavBar';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
    const { user } = useAuthContext();

    return (
        <div className="App">
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                    <Route
                        path="/myrecipes"
                        element={user ? <MyRecipes /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/login"
                        element={!user ? <Login /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/signup"
                        element={!user ? <Signup /> : <Navigate to="/" />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
