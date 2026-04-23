"""ML Service - Distance Calculations and Matching"""
import math
from typing import List, Dict


class MLService:
    
    @staticmethod
    def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate distance in kilometers using Haversine formula"""
        R = 6371
        
        lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    @staticmethod
    def find_route_matches(user_route: Dict, all_routes: List[Dict], threshold: float = 2.0) -> List[Dict]:
        """Find users with opposite commute routes"""
        matches = []
        
        user_start = (user_route['start_lat'], user_route['start_lng'])
        user_end = (user_route['end_lat'], user_route['end_lng'])
        
        for route in all_routes:
            if route['user_id'] == user_route['user_id']:
                continue
            
            other_start = (route['start_lat'], route['start_lng'])
            other_end = (route['end_lat'], route['end_lng'])
            
            start_match = MLService.calculate_distance(
                user_start[0], user_start[1],
                other_end[0], other_end[1]
            )
            
            end_match = MLService.calculate_distance(
                user_end[0], user_end[1],
                other_start[0], other_start[1]
            )
            
            if start_match <= threshold and end_match <= threshold:
                compatibility = 1 - ((start_match + end_match) / (2 * threshold))
                matches.append({
                    'user_id': route['user_id'],
                    'user_name': route.get('user_name', 'User'),
                    'compatibility': round(compatibility, 2),
                    'route_name': route.get('route_name', ''),
                    'start_address': route.get('start_address', ''),
                    'end_address': route.get('end_address', '')
                })
        
        matches.sort(key=lambda x: x['compatibility'], reverse=True)
        return matches[:5]