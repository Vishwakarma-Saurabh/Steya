import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import RoomMap from "../components/RoomMap";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

export default function SearchPage() {
  const { user } = useAuth();
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);
  const [radius, setRadius] = useState(5);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [rooms, setRooms] = useState([]);
  const [savedRoomIds, setSavedRoomIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.get(`/rooms?lat=${lat}&lng=${lng}&radius=${radius}`);
      setRooms(data);
      if (user) {
        apiClient.post("/activity/track", {
          event_type: "room_search",
          message: `Searched rooms near coordinates ${lat}, ${lng}`,
          metadata: { radius_km: radius, results: data.length },
        }).catch(() => {});
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude.toFixed(6));
      setLng(position.coords.longitude.toFixed(6));
    });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const loadSaved = async () => {
      if (!user) return;
      try {
        const { data } = await apiClient.get("/rooms/saved/me");
        setSavedRoomIds(data.map((room) => room.id));
      } catch {
        setSavedRoomIds([]);
      }
    };
    loadSaved();
  }, [user]);

  const filteredRooms = [...rooms]
    .filter((room) => room.title.toLowerCase().includes(query.toLowerCase()) || room.address.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price) - Number(b.price);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      return Number(b.rating || 0) - Number(a.rating || 0);
    });

  return (
    <div>
      <Navbar />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <input className="rounded-lg border p-2" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" />
              <input className="rounded-lg border p-2" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" />
              <input className="rounded-lg border p-2" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Radius KM" />
              <button onClick={fetchRooms} className="rounded-lg bg-primary px-4 py-2 text-white">Search Nearby</button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input className="rounded-lg border p-2 md:col-span-2" placeholder="Search by title or address" value={query} onChange={(e) => setQuery(e.target.value)} />
              <select className="rounded-lg border p-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="distance">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <button onClick={useMyLocation} className="mt-3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600">Use my location</button>
          </div>
          {error && <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          {loading ? (
            <div className="rounded-xl bg-white p-6 text-slate-500">Loading rooms...</div>
          ) : (
            <div className="space-y-4">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} initiallySaved={savedRoomIds.includes(room.id)} />
              ))}
            </div>
          )}
        </div>
        <RoomMap center={[Number(lat), Number(lng)]} rooms={rooms} />
      </div>
    </div>
  );
}
