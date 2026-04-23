import React from 'react';

function BookingCard({ booking, onCancel }) {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{booking.room_title}</h3>
          <p className="text-gray-600 text-sm">{booking.room_address}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[booking.status] || 'bg-gray-100'}`}>
          {booking.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <span className="w-24 text-sm">Date:</span>
          <span className="font-medium">{booking.booking_date}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="w-24 text-sm">Time:</span>
          <span className="font-medium">{booking.start_time} - {booking.end_time}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="w-24 text-sm">Total:</span>
          <span className="font-bold text-green-600">${booking.total_price}</span>
        </div>
      </div>

      {booking.status === 'confirmed' && (
        <button
          onClick={() => onCancel(booking.id)}
          className="text-red-500 text-sm hover:text-red-700 hover:underline"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
}

export default BookingCard;