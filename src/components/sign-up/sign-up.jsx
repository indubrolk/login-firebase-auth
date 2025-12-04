import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../firebase/firebase";

const auth = getAuth(app);

export default function SignUp() {
    const [form, setForm] = useState({ displayName: "", email: "", password: "" });
    const [status, setStatus] = useState({ loading: false, error: "", success: "" });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ loading: true, error: "", success: "" });

        try {
            const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            if (form.displayName.trim()) {
                await updateProfile(credential.user, { displayName: form.displayName.trim() });
            }
            setStatus({ loading: false, error: "", success: "Account created successfully." });
            setForm({ displayName: "", email: "", password: "" });
        } catch (error) {
            setStatus({ loading: false, error: error.message || "Unable to sign up.", success: "" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signup-form">
            <label>
                Display Name
                <input
                    type="text"
                    name="displayName"
                    value={form.displayName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                />
            </label>

            <label>
                Email
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />
            </label>

            <label>
                Password
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                />
            </label>

            <button type="submit" disabled={status.loading}>
                {status.loading ? "Creating..." : "Sign Up"}
            </button>

            {status.error && <p className="error-text">{status.error}</p>}
            {status.success && <p className="success-text">{status.success}</p>}
        </form>
    );
}