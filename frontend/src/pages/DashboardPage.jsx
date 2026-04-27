import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get("/bookings"),
      apiClient.get("/dashboard/summary"),
      apiClient.get("/activity/my?limit=20"),
    ])
      .then(([bookingsRes, summaryRes, activityRes]) => {
        setBookings(bookingsRes.data);
        setSummary(summaryRes.data);
        setActivities(activityRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const cancelled = summary?.cancelled_bookings ?? bookings.filter((booking) => booking.status === "cancelled").length;
  const active = summary?.active_bookings ?? bookings.length - cancelled;
  const spend = summary?.total_spend ?? bookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="mt-1 text-slate-600">Track your stays, route matches and hosting growth.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Active Bookings</p><p className="text-3xl font-bold text-primary">{active}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Total Spend</p><p className="text-3xl font-bold text-primary">Rs {spend.toFixed(0)}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Cancelled</p><p className="text-3xl font-bold text-primary">{cancelled}</p></div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Rooms Listed</p><p className="text-2xl font-bold">{summary?.total_rooms_listed || 0}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Saved Rooms</p><p className="text-2xl font-bold">{summary?.total_saved_rooms || 0}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Routes Created</p><p className="text-2xl font-bold">{summary?.total_routes || 0}</p></div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Link to="/search" className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white shadow-sm">Explore Nearby Rooms</Link>
          <Link to="/list-room" className="rounded-2xl bg-white p-4 shadow-sm">Create Room Listing</Link>
          <Link to="/matches" className="rounded-2xl bg-white p-4 shadow-sm">Find Commute Matches</Link>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Booking History</h2>
          {loading && <p className="mt-2 text-slate-500">Loading bookings...</p>}
          <div className="mt-3 space-y-3">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{booking.booking_date}</p>
                  <span className={`rounded-full px-2 py-1 text-xs ${booking.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{booking.start_time} - {booking.end_time}</p>
                <p className="mt-1 text-sm font-medium text-primary">Rs {booking.total_price}</p>
              </article>
            ))}
            {!loading && bookings.length === 0 && (
              <div className="rounded-xl bg-white p-6 text-slate-500">No bookings yet. Start with room search.</div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="mt-3 space-y-3">
            {activities.map((activity) => (
              <article key={activity.id} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-primary">{activity.event_type.replaceAll("_", " ")}</p>
                <p className="mt-1 text-sm text-slate-700">{activity.message}</p>
                <p className="mt-1 text-xs text-slate-400">{new Date(activity.created_at).toLocaleString()}</p>
              </article>
            ))}
            {!loading && activities.length === 0 && <div className="rounded-xl bg-white p-6 text-slate-500">No activity yet.</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
