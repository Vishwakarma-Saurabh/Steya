import React, { useState, useEffect } from 'react';
import { matchApi } from '../services/matchApi';
import RouteForm from '../components/RouteForm';
import MatchCard from '../components/MatchCard';

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [myRoutes, setMyRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetchMyRoutes();
  }, []);

  const fetchMyRoutes = async () => {
    try {
      const response = await matchApi.getMyRoutes();
      setMyRoutes(response.data.routes);
      if (response.data.routes.length > 0) {
        setSelectedRoute(response.data.routes[0]);
      }
    } catch (error) {
      console.error('Failed to fetch routes:', error);
    }
  };

  const findMatches = async (route) => {
    setLoading(true);
    try {
      const response = await matchApi.findMatches({
        start_location: {
          lat: route.start_latitude,
          lng: route.start_longitude
        },
        end_location: {
          lat: route.end_latitude,
          lng: route.end_longitude
        }
      });
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Failed to find matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    findMatches(route);
  };

  const handleRouteSaved = () => {
    setShowForm(false);
    fetchMyRoutes();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Smart Matching</h1>
          <p className="text-gray-600">Find users with opposite commutes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : '+ Add Route'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add Your Commute Route</h2>
          <RouteForm onSuccess={handleRouteSaved} />
        </div>
      )}

      {myRoutes.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Route:</label>
          <select
            value={selectedRoute?.id || ''}
            onChange={(e) => {
              const route = myRoutes.find(r => r.id === e.target.value);
              handleRouteSelect(route);
            }}
            className="border rounded px-3 py-2 w-64"
          >
            {myRoutes.map(route => (
              <option key={route.id} value={route.id}>
                {route.route_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Finding matches...</div>
      ) : matches.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map(match => (
            <MatchCard key={match.user_id} match={match} />
          ))}
        </div>
      ) : selectedRoute ? (
        <div className="text-center py-8 text-gray-500">
          No matches found. Try adding more routes or check back later!
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Add a route to find matching commuters!
        </div>
      )}
    </div>
  );
}

export default MatchesPage;