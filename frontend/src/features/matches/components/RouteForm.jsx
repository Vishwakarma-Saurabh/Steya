import React, { useState, useEffect } from 'react';
import { matchApi } from '../services/matchApi';

function RouteForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    route_name: '',
    start_address: '',
    start_lat: '',
    start_lng: '',
    end_address: '',
    end_lat: '',
    end_lng: '',
    typical_time: '09:00'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getCurrentLocation = (type) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            [`${type}_lat`]: position.coords.latitude,
            [`${type}_lng`]: position.coords.longitude,
            [`${type}_address`]: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          });
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await matchApi.createRoute({
        route_name: formData.route_name,
        start_address: formData.start_address,
        start_location: {
          lat: parseFloat(formData.start_lat),
          lng: parseFloat(formData.start_lng)
        },
        end_address: formData.end_address,
        end_location: {
          lat: parseFloat(formData.end_lat),
          lng: parseFloat(formData.end_lng)
        },
        typical_time: formData.typical_time
      });

      setMessage('Route saved successfully!');
      onSuccess && onSuccess();
    } catch (error) {
      setMessage('Failed to save route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {message && (
        <div className={`p-3 rounded ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Route Name</label>
        <input
          type="text"
          required
          placeholder="e.g., Home to Office"
          value={formData.route_name}
          onChange={(e) => setFormData({...formData, route_name: e.target.value})}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Start Location (Home)</h3>
        <div className="space-y-3">
          <input
            type="text"
            required
            placeholder="Address"
            value={formData.start_address}
            onChange={(e) => setFormData({...formData, start_address: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="any"
              required
              placeholder="Latitude"
              value={formData.start_lat}
              onChange={(e) => setFormData({...formData, start_lat: e.target.value})}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              step="any"
              required
              placeholder="Longitude"
              value={formData.start_lng}
              onChange={(e) => setFormData({...formData, start_lng: e.target.value})}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={() => getCurrentLocation('start')}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            📍 Use Current Location
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">End Location (Work/School)</h3>
        <div className="space-y-3">
          <input
            type="text"
            required
            placeholder="Address"
            value={formData.end_address}
            onChange={(e) => setFormData({...formData, end_address: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="any"
              required
              placeholder="Latitude"
              value={formData.end_lat}
              onChange={(e) => setFormData({...formData, end_lat: e.target.value})}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              step="any"
              required
              placeholder="Longitude"
              value={formData.end_lng}
              onChange={(e) => setFormData({...formData, end_lng: e.target.value})}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={() => getCurrentLocation('end')}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            📍 Use Current Location
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Typical Departure Time</label>
        <select
          value={formData.typical_time}
          onChange={(e) => setFormData({...formData, typical_time: e.target.value})}
          className="w-full border rounded px-3 py-2"
        >
          <option value="07:00">7:00 AM</option>
          <option value="08:00">8:00 AM</option>
          <option value="09:00">9:00 AM</option>
          <option value="10:00">10:00 AM</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 disabled:bg-gray-300"
      >
        {loading ? 'Saving...' : 'Save Route'}
      </button>
    </form>
  );
}

export default RouteForm; 