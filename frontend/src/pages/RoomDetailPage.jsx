import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

export default function RoomDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [specialRequests, setSpecialRequests] = useState("");
  const [status, setStatus] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    apiClient.get(`/rooms/${id}`).then(({ data }) => {
      setRoom(data);
      if (user) {
        apiClient.post("/activity/track", {
          event_type: "room_view",
          message: `Viewed room: ${data.title}`,
          metadata: { room_id: data.id },
        }).catch(() => {});
      }
    });
  }, [id, user]);

  const getHours = () => {
    const [sH, sM] = startTime.split(":").map(Number);
    const [eH, eM] = endTime.split(":").map(Number);
    const diff = (eH * 60 + eM - (sH * 60 + sM)) / 60;
    return diff > 0 ? diff : 0;
  };

  const onBook = async () => {
    const hours = getHours();
    if (!bookingDate || !hours) {
      setStatus("Please select a valid date and time range.");
      return;
    }
    const totalPrice = Number(room.price) * hours;
    try {
      await apiClient.post("/bookings", {
        room_id: id,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_price: totalPrice,
        special_requests: specialRequests,
      });
      setStatus("Booking successful. See dashboard for details.");
    } catch (err) {
      setStatus(err.response?.data?.detail || "Booking failed");
    }
  };

  if (!room) return <div className="p-6">Loading...</div>;

  const images = room.images?.length
    ? room.images
    : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200"];

  const estimated = Number(room.price) * getHours();

  return (
    <div>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <img src={images[activeImage]} alt={room.title} className="h-80 w-full rounded-2xl object-cover shadow-md md:h-[430px]" />
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((image, idx) => (
              <button key={image} onClick={() => setActiveImage(idx)} className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border ${idx === activeImage ? "border-primary" : "border-transparent"}`}>
                <img src={image} alt="Room view" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-bold">{room.title}</h1>
          <p className="mt-2 text-slate-600">{room.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(room.amenities || []).map((amenity) => (
              <span key={amenity} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-primary">{amenity}</span>
            ))}
          </div>
        </section>
        <aside className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Book now</h2>
          <p className="mt-1 text-sm text-slate-500">Rs {room.price} per {room.price_type === "hourly" ? "hour" : "stay"}</p>
          <div className="mt-4 space-y-3">
            <input type="date" className="w-full rounded-lg border p-2" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input type="time" className="rounded-lg border p-2" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <input type="time" className="rounded-lg border p-2" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <textarea className="w-full rounded-lg border p-2" rows={3} placeholder="Special requests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
          </div>
          <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-primary">
            Estimated total: <span className="font-semibold">Rs {estimated.toFixed(2)}</span>
          </div>
          {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
          <button onClick={onBook} className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-white">Confirm Booking</button>
        </aside>
      </main>
    </div>
  );
}
