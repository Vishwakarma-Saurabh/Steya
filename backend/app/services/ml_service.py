import math


class MLService:
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        radius_earth_km = 6371
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return radius_earth_km * c

    @staticmethod
    def find_route_matches(user_route, all_routes, threshold_km: float = 5.0):
        matches = []
        user_start = (float(user_route.start_latitude), float(user_route.start_longitude))
        user_end = (float(user_route.end_latitude), float(user_route.end_longitude))

        for route in all_routes:
            if route.id == user_route.id or route.user_id == user_route.user_id:
                continue
            other_start = (float(route.start_latitude), float(route.start_longitude))
            other_end = (float(route.end_latitude), float(route.end_longitude))
            start_distance = MLService.haversine_distance(*user_start, *other_end)
            end_distance = MLService.haversine_distance(*user_end, *other_start)
            if start_distance <= threshold_km and end_distance <= threshold_km:
                avg_distance = (start_distance + end_distance) / 2
                compatibility = max(0.0, 1 - (avg_distance / threshold_km))
                matches.append(
                    {
                        "user_id": route.user_id,
                        "route_id": route.id,
                        "route_name": route.route_name,
                        "compatibility_score": round(compatibility, 3),
                        "start_distance_km": round(start_distance, 3),
                        "end_distance_km": round(end_distance, 3),
                    }
                )
        return sorted(matches, key=lambda item: item["compatibility_score"], reverse=True)