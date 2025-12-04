import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import { app } from "../../firebase/firebase";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200/70 bg-white/80 p-8 shadow-xl shadow-sky-100/60 backdrop-blur">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
                <p className="text-sm text-slate-600">
                    Sign up to sync your profile across devices and access member-only features.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">UserName</span>
                    <input
                        type="text"
                        name="displayName"
                        value={form.displayName}
                        onChange={handleChange}
                        autoComplete="name"
                        className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-slate-900 shadow-inner shadow-slate-100 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                        required
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Email</span>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-slate-900 shadow-inner shadow-slate-100 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                        required
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Password</span>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        minLength={6}
                        className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-slate-900 shadow-inner shadow-slate-100 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={status.loading}
                    className="flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {status.loading ? "Creating..." : "Sign Up"}
                </button>

                {status.error && (
                    <p className="text-sm font-medium text-rose-600" aria-live="assertive">
                        {status.error}
                    </p>
                )}
                {status.success && (
                    <p className="text-sm font-medium text-emerald-600" aria-live="polite">
                        {status.success}
                    </p>
                )}
            </form>
            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/" className="font-semibold text-sky-700 hover:text-sky-800">
                    Log in
                </Link>
            </p>
            </div>
        </div>
    );
}
