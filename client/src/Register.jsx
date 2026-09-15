import { useState } from "react";

function Register({ onRegister }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
const API_URL = import.meta.env.VITE_API_URL;
    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        if (!name || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            onRegister();

        } catch (error) {
            console.error("REGISTER ERROR:", error);
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    🔗 <span>Shortly</span>
                </div>

                <div className="auth-heading">
                    <h1>Create account</h1>

                    <p>
                        Start creating and tracking your short URLs
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Account →"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?

                    <button
                        type="button"
                        className="signup-link"
                        onClick={onRegister}
                    >
                        Sign in
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Register;