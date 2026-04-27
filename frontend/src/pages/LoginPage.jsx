import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await apiClient.post("/auth/login", form);
      login(data.access_token, data.user);
      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        setError("Cannot reach backend. Start FastAPI on http://127.0.0.1:8000.");
      } else {
        setError(err.response.data?.detail || "Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-md rounded-2xl bg-white p-7 shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to continue your smart stay journey.</p>
        <input className="mt-5 w-full rounded-lg border p-2.5" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="mt-3 w-full rounded-lg border p-2.5" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={submitting} className="mt-4 w-full rounded-lg bg-primary py-2.5 text-white disabled:opacity-70">
          {submitting ? "Signing in..." : "Sign In"}
        </button>
        <p className="mt-3 text-sm">No account? <Link className="text-primary" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
