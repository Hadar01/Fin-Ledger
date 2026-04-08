import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import Budget from './pages/Dashboard/Budget';
import LandingPage from './pages/LandingPage';
import UserProvider from './context/UserContext';
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Root />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signUp' element={<SignUp />} />
                    <Route path='/dashboard' element={<Home />} />
                    <Route path='/income' element={<Income />} />
                    <Route path='/expense' element={<Expense />} />
                    <Route path='/budget' element={<Budget />} />
                </Routes>
            </BrowserRouter>
            <Toaster
                toastOptions={{
                    style: {
                        fontSize: "13px",
                        background: "#1a1a2e",
                        color: "#f1f5f9",
                        border: "1px solid rgba(124, 58, 237, 0.15)",
                        borderRadius: "12px",
                    },
                }}
            />
        </UserProvider>
    )
}

const Root = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? (<Navigate to='/dashboard' />) : (<LandingPage />);
}