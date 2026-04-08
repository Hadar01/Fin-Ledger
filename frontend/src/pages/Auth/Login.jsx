import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../../components/layouts/AuthLayout"
import Input from "../../components/Inputs/Input";
import { validateUsername } from "../../utlis/helper";
import axiosInstance from "../../utlis/axiosInstance";
import { API_PATHS } from "../../utlis/apiPaths";
import { UserContext } from "../../context/UserContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateUsername(username)) {
            setError("Please enter a valid username");
            return;
        }

        if(!password) {
            setError("Please enter a password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                username,
                password,
            });
            const { token, user } = response.data;

            if (token) {
                localStorage.setItem("token", token);
                updateUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again");
            }
        }
    }

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-text-primary">Welcome Back</h3>
                <p className="text-sm text-text-muted mt-2 mb-8">
                    Sign in to your Fin Ledger account
                </p>
                <form onSubmit={handleLogin}>
                    <Input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                        label="Username"
                        placeholder="Enter your username"
                        type="text"
                    />

                    <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                    />
                    {error && <p className="text-danger text-xs pb-2.5">{error}</p>}
                    <button type="submit" className="btn-primary mt-2">Sign In</button>
                    <p className="text-sm text-text-muted mt-4 text-center">
                        Don't have an account?{" "}
                        <Link className="font-semibold text-primary-light hover:text-primary transition-colors" to="/signup">Create one</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}