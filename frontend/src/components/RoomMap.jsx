import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function RoomMap({ center, rooms }) {
  return (
    <MapContainer center={center} zoom={13} className="h-[72vh] w-full rounded-2xl border border-slate-200">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rooms.map((room) => (
        <Marker key={room.id} position={[Number(room.latitude), Number(room.longitude)]}>
          <Popup>
            <div className="text-sm">
              <strong>{room.title}</strong>
              <div className="text-slate-600">{room.address}</div>
              <div className="mt-1 font-semibold text-primary">Rs {room.price}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
