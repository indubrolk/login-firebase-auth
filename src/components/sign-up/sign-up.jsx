import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

export default function SignUp() {
    const [form, setForm] = useState({ displayName: "", email: "", password: "", phone: "", otp: "" });
    const [status, setStatus] = useState({ loading: false, error: "", success: "" });
    const [phoneStatus, setPhoneStatus] = useState({ sending: false, error: "", success: "" });
    const { user, initializing } = useAuth();
    const navigate = useNavigate();
    const apiBase = import.meta.env.VITE_API_BASE_URL || "";

    useEffect(() => {
        if (!initializing && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, initializing, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const maskPhone = (phone) => {
        if (!phone || phone.length < 4) return phone || "";
        return `****${phone.slice(-4)}`;
    };

    const handleSendOtp = async () => {
        if (!form.phone) {
            setPhoneStatus({ sending: false, error: "Enter phone with country code (e.g., +1XXXXXXXXXX).", success: "" });
            return;
        }

        setPhoneStatus({ sending: true, error: "", success: "" });

        try {
            const response = await fetch(`${apiBase}/api/otp/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: form.phone, channel: "sms", purpose: "signup" }),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Unable to send OTP.");
            }
            setPhoneStatus({
                sending: false,
                error: "",
                success: `OTP sent to ${maskPhone(form.phone)}. Enter the 6-digit code.`,
            });
        } catch (error) {
            setPhoneStatus({ sending: false, error: error.message || "Unable to send OTP.", success: "" });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ loading: true, error: "", success: "" });
        setPhoneStatus((prev) => ({ ...prev, error: "" }));

        if (!form.phone || !form.otp) {
            setStatus({ loading: false, error: "Verify your phone with the OTP before creating the account.", success: "" });
            return;
        }

        try {
            const verifyResponse = await fetch(`${apiBase}/api/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: form.phone, code: form.otp, purpose: "signup" }),
            });
            if (!verifyResponse.ok) {
                const message = await verifyResponse.text();
                throw new Error(message || "Invalid OTP. Try again.");
            }

            const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            if (form.displayName.trim()) {
                await updateProfile(credential.user, { displayName: form.displayName.trim() });
            }
            await sendEmailVerification(credential.user);
            await signOut(auth);
            setStatus({
                loading: false,
                error: "",
                success: "Verification email sent. Verify your email, then sign in to continue.",
            });
            setForm({ displayName: "", email: "", password: "", phone: "", otp: "" });
            setPhoneStatus({ sending: false, error: "", success: "" });
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
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>Phone (with country code)</span>
                        <button
                            type="button"
                            className="text-xs font-semibold text-sky-700 hover:text-sky-800 disabled:opacity-60"
                            onClick={handleSendOtp}
                            disabled={phoneStatus.sending}
                        >
                            {phoneStatus.sending ? "Sending..." : "Send code"}
                        </button>
                    </div>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1XXXXXXXXXX"
                        autoComplete="tel"
                        className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-slate-900 shadow-inner shadow-slate-100 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                        required
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">OTP Code</span>
                    <input
                        type="text"
                        name="otp"
                        value={form.otp}
                        onChange={handleChange}
                        inputMode="numeric"
                        autoComplete="one-time-code"
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
                {phoneStatus.error && (
                    <p className="text-sm font-medium text-rose-600" aria-live="assertive">
                        {phoneStatus.error}
                    </p>
                )}
                {phoneStatus.success && (
                    <p className="text-sm font-medium text-emerald-600" aria-live="polite">
                        {phoneStatus.success}
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
