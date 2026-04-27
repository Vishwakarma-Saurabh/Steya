import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

export default function RoomCard({ room, initiallySaved = false }) {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(initiallySaved);
  const [saving, setSaving] = useState(false);

  const amenityPreview = useMemo(() => (room.amenities || []).slice(0, 3), [room.amenities]);

  useEffect(() => {
    setFavorite(initiallySaved);
  }, [initiallySaved]);

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem("steya_favorites");
      const favs = saved ? JSON.parse(saved) : [];
      setFavorite(favs.includes(room.id));
    }
  }, [room.id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      const saved = localStorage.getItem("steya_favorites");
      const favs = saved ? JSON.parse(saved) : [];
      const next = favorite ? favs.filter((id) => id !== room.id) : [...favs, room.id];
      localStorage.setItem("steya_favorites", JSON.stringify(next));
      setFavorite(!favorite);
      return;
    }
    setSaving(true);
    try {
      if (favorite) {
        await apiClient.delete(`/rooms/${room.id}/save`);
      } else {
        await apiClient.post(`/rooms/${room.id}/save`);
      }
      setFavorite(!favorite);
    } catch {
      // Keep UX smooth; card state remains unchanged on error.
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="group rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={room.images?.[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600"}
        alt={room.title}
        className="h-44 w-full rounded-xl object-cover"
      />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{room.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-slate-600">{room.address}</p>
        </div>
        <button
          disabled={saving}
          onClick={toggleFavorite}
          className={`rounded-lg px-2 py-1 text-xs disabled:opacity-60 ${favorite ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"}`}
        >
          {saving ? "..." : favorite ? "Saved" : "Save"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {amenityPreview.map((amenity) => (
          <span key={amenity} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-primary">{amenity}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-primary">Rs {room.price}/{room.price_type === "hourly" ? "hr" : "stay"}</span>
        <Link className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition group-hover:bg-blue-700" to={`/rooms/${room.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
