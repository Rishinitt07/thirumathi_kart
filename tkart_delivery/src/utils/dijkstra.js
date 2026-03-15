// Haversine distance calculation
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Nearest neighbor TSP approximation for route optimization
function nearestNeighborTSP(coordinates) {
  if (coordinates.length <= 1) return coordinates;

  const graph = buildGraph(coordinates);
  const visited = new Set();
  const route = [];
  let current = 0; // Start from first coordinate (current location)

  route.push(coordinates[current]);
  visited.add(current);

  while (visited.size < coordinates.length) {
    let nearest = null;
    let minDistance = Infinity;

    for (let i = 0; i < coordinates.length; i++) {
      if (!visited.has(i) && graph[current][i] < minDistance) {
        minDistance = graph[current][i];
        nearest = i;
      }
    }

    if (nearest !== null) {
      current = nearest;
      route.push(coordinates[current]);
      visited.add(current);
    }
  }

  return route;
}

// Build graph from coordinates
function buildGraph(coordinates) {
  const graph = {};
  for (let i = 0; i < coordinates.length; i++) {
    graph[i] = {};
    for (let j = 0; j < coordinates.length; j++) {
      if (i !== j) {
        const distance = haversineDistance(
          coordinates[i].lat, coordinates[i].lng,
          coordinates[j].lat, coordinates[j].lng
        );
        graph[i][j] = distance;
      }
    }
  }
  return graph;
}

// Main route optimization function
function optimizeRoute(coordinates) {
  if (coordinates.length <= 2) return coordinates;
  
  // Separate pickups and deliveries
  const currentLocation = coordinates[0];
  const pickups = coordinates.slice(1).filter(point => point.type === 'pickup');
  const deliveries = coordinates.slice(1).filter(point => point.type === 'drop');
  
  // Optimize pickup order first
  const optimizedPickups = pickups.length > 1 ? 
    nearestNeighborTSP([currentLocation, ...pickups]).slice(1) : pickups;
  
  // Then optimize delivery order
  const optimizedDeliveries = deliveries.length > 1 ? 
    nearestNeighborTSP([optimizedPickups[optimizedPickups.length - 1] || currentLocation, ...deliveries]).slice(1) : deliveries;
  
  // Return optimized route: current location -> pickups -> deliveries
  return [currentLocation, ...optimizedPickups, ...optimizedDeliveries];
}

export { haversineDistance, nearestNeighborTSP, buildGraph, optimizeRoute };
