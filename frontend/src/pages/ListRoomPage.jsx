import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import apiClient from "../services/apiClient";

export default function ListRoomPage() {
  const navigate = useNavigate();
  const presetAmenities = ["wifi", "ac", "workspace", "parking", "coffee", "charging", "washroom"];
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    price_type: "hourly",
    max_hours: 8,
    address: "",
    latitude: "",
    longitude: "",
    amenities: [],
    images: [],
  });
  const [message, setMessage] = useState("");

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const submitRoom = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/rooms", {
        ...form,
        amenities: typeof form.amenities === "string" ? form.amenities.split(",").map((x) => x.trim()) : form.amenities,
        images: typeof form.images === "string" ? form.images.split(",").map((x) => x.trim()) : form.images,
      });
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Could not create listing");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-4 lg:grid-cols-3">
        <form onSubmit={submitRoom} className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">List your room like a pro</h1>
          <p className="mt-1 text-sm text-slate-500">Complete details attract more bookings and better ratings.</p>
          {message && <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{message}</p>}
          {Object.keys(form).filter((key) => key !== "amenities").map((key) => (
            <input key={key} className="mt-3 w-full rounded-lg border p-2" placeholder={key.replaceAll("_", " ")} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          ))}
          <p className="mt-4 text-sm font-medium text-slate-700">Amenities</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {presetAmenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`rounded-full px-3 py-1.5 text-sm ${form.amenities.includes(amenity) ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {amenity}
              </button>
            ))}
          </div>
          <button className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-white">Create Listing</button>
        </form>
        <aside className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Live Preview</h2>
          <img src={form.images?.[0] || "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=900"} alt="Preview" className="mt-3 h-44 w-full rounded-xl object-cover" />
          <p className="mt-3 text-lg font-semibold">{form.title || "Your room title"}</p>
          <p className="mt-1 text-sm text-slate-600">{form.address || "Address appears here"}</p>
          <p className="mt-2 text-primary font-semibold">Rs {form.price || "0"} / {form.price_type === "hourly" ? "hr" : "stay"}</p>
        </aside>
      </div>
    </div>
  );
}
