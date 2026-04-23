import React from 'react';

function MatchCard({ match }) {
  const getCompatibilityColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-orange-500';
  };

  const getCompatibilityLabel = (score) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    return 'Possible Match';
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{match.user_name}</h3>
          <p className="text-sm text-gray-500">{match.route_name}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getCompatibilityColor(match.compatibility)}`}>
            {Math.round(match.compatibility * 100)}%
          </div>
          <p className="text-xs text-gray-500">{getCompatibilityLabel(match.compatibility)}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-green-500 mt-1">●</span>
          <div>
            <p className="text-gray-600">Their Start (Your Destination)</p>
            <p className="font-medium">{match.start_address}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-500 mt-1">●</span>
          <div>
            <p className="text-gray-600">Their End (Your Start)</p>
            <p className="font-medium">{match.end_address}</p>
          </div>
        </div>
      </div>

      <button className="mt-4 w-full border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50">
        Connect
      </button>
    </div>
  );
}

export default MatchCard;