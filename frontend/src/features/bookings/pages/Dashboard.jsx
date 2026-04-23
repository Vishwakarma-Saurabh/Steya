import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { bookingApi } from '../services/bookingApi';
import BookingCard from '../components/BookingCard';

function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingApi.getAll();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingApi.cancel(bookingId);
      fetchBookings();
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    if (activeTab === 'upcoming') {
      return booking.booking_date >= today && booking.status === 'confirmed';
    } else if (activeTab === 'past') {
      return booking.booking_date < today || booking.status === 'completed';
    } else {
      return booking.status === 'cancelled';
    }
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back, {user?.name}!</p>

      <div className="border-b mb-6">
        <div className="flex gap-6">
          {['upcoming', 'past', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-2 capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} bookings found.
          </div>
        ) : (
          filteredBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;