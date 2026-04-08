import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../../components/layouts/AuthLayout"
import Input from "../../components/Inputs/Input";
import { validateUsername } from "../../utlis/helper";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utlis/axiosInstance";
import { API_PATHS } from "../../utlis/apiPaths";


export default function SignUp() {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if(!fullName) {
            setError("Please enter your name");
            return;
        }

        if(!validateUsername(username)) {
            setError("Please enter a valid username");
            return;
        }

        if(!password) {
            setError("Please enter the password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                fullName,
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
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-text-primary">Create an Account</h3>
                <p className="text-sm text-text-muted mt-2 mb-8">
                    Join Fin Ledger to start tracking your finances
                </p>

                <form onSubmit={handleSignUp}>
                    <div className="col-span-2">
                        <Input
                            value={fullName}
                            onChange={({target}) => setFullName(target.value)}
                            label="Full Name"
                            placeholder="John Doe"
                            type="text"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                            label="Username"
                            placeholder="Choose a username"
                            type="text"
                        />
                        <Input
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                            label="Password"
                            placeholder="Create a password"
                            type="password"
                        />
                        </div>
                    </div>

                    {error && <p className="text-danger text-xs pb-2.5">{error}</p>}

                    <button type="submit" className="btn-primary mt-2">Create Account</button>
                    <p className="text-sm text-text-muted mt-4 text-center">
                        Already have an account?{" "}
                        <Link className="font-semibold text-primary-light hover:text-primary transition-colors" to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}