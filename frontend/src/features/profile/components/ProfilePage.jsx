import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    user_type: user?.user_type || 'traveler',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await updateProfile(formData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setMessage(result.error || 'Update failed');
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      user_type: user?.user_type || 'traveler',
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
          
          {message && (
            <div className={`mb-4 p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}
          
          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-lg text-gray-900">{user?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-lg text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <p className="mt-1 text-lg text-gray-900 capitalize">{user?.user_type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="pt-4 flex space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  id="user_type"
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="traveler">Traveler (Book rooms)</option>
                  <option value="host">Host (List spaces)</option>
                  <option value="both">Both</option>
                </select>
              </div>
              
              <div className="pt-4 flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;