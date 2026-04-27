import { useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../services/apiClient";

export default function MatchesPage() {
  const [form, setForm] = useState({
    route_name: "",
    start_address: "",
    start_latitude: "",
    start_longitude: "",
    end_address: "",
    end_latitude: "",
    end_longitude: "",
  });
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const findMatches = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data } = await apiClient.post("/matches/routes", form);
      setMatches(data.matches);
      setMessage(`Found ${data.matches.length} high compatibility routes.`);
    } catch (err) {
      setMatches([]);
      setMessage(err.response?.data?.detail || "No matches found for this route");
    } finally {
      setLoading(false);
    }
  };

  const saveRoute = async () => {
    try {
      await apiClient.post("/matches/routes/create", form);
      setMessage("Route saved successfully.");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Could not save route");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <form onSubmit={findMatches} className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold">Smart Route Matching</h1>
          <p className="mt-1 text-sm text-slate-500">Detect reverse commute opportunities and optimize your day.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {Object.keys(form).map((key) => (
              <input key={key} className="rounded-lg border p-2" placeholder={key.replaceAll("_", " ")} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-70">{loading ? "Matching..." : "Find Matches"}</button>
            <button type="button" onClick={saveRoute} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-600">Save Route</button>
          </div>
          {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
        </form>
        <div className="mt-6 space-y-3">
          {matches.map((m) => (
            <div key={m.route_id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{m.route_name}</p>
                <span className="text-sm font-semibold text-primary">{Math.round(m.compatibility_score * 100)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${Math.round(m.compatibility_score * 100)}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">Start distance: {m.start_distance_km} km | End distance: {m.end_distance_km} km</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
