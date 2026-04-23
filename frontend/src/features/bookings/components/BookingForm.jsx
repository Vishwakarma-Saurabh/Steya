import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../services/bookingApi';

function BookingForm({ room, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    booking_date: '',
    start_time: '',
    end_time: '',
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculatePrice = () => {
    if (formData.start_time && formData.end_time) {
      const start = parseInt(formData.start_time.split(':')[0]);
      const end = parseInt(formData.end_time.split(':')[0]);
      const hours = end - start;
      return hours * room.price;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const totalPrice = calculatePrice();
      const response = await bookingApi.create({
        room_id: room.id,
        booking_date: formData.booking_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        total_price: totalPrice,
        special_requests: formData.special_requests
      });

      if (response.data.id) {
        onSuccess ? onSuccess() : navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculatePrice();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={formData.booking_date}
          onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <select
            required
            value={formData.start_time}
            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="18:00">6:00 PM</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <select
            required
            value={formData.end_time}
            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="21:00">9:00 PM</option>
            <option value="22:00">10:00 PM</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
        <textarea
          value={formData.special_requests}
          onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
          rows="3"
          className="w-full border rounded px-3 py-2"
          placeholder="Any special requirements..."
        />
      </div>

      {totalPrice > 0 && (
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Price:</span>
            <span className="text-2xl font-bold text-green-600">${totalPrice}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            ${room.price}/hour × {parseInt(formData.end_time) - parseInt(formData.start_time)} hours
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !formData.booking_date || !formData.start_time || !formData.end_time}
        className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 disabled:bg-gray-300"
      >
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
}

export default BookingForm;