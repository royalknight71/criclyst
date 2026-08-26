import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (form.name.trim().length < 2) {
            setError("Name must be at least 2 characters");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setSubmitting(true);
        try {
            await register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            navigate("/login");
        } catch (err) {
            const msg =
                err.response?.data?.message || "Registration failed. Please try again.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-8 shadow-xl">
                <h1 className="mb-6 text-center text-3xl font-bold text-white">
                    Create Account
                </h1>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-slate-300"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-slate-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-slate-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            placeholder="Min 8 characters"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1 block text-sm font-medium text-slate-300"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg bg-cyan-400 px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-cyan-400 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
