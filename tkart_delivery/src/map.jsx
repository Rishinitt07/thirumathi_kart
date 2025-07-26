import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdMyLocation, MdRefresh } from 'react-icons/md';
import { FaMapMarkerAlt, FaTruck, FaWarehouse, FaHome, FaRoute, FaBoxOpen, FaRuler } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Import route optimization functions
import { optimizeRoute, haversineDistance } from './utils/dijkstra';

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [debugInfo, setDebugInfo] = useState({});
  const [username, setUsername] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routingControlsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsernameFromToken();
  }, []);

  useEffect(() => {
    if (username) {
      getCurrentLocation();
    }
  }, [username]);

  useEffect(() => {
    if (currentLocation && route.length > 0) {
      optimizeAndDisplayRoute();
    }
  }, [currentLocation, route]);

  const getUsernameFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.username) {
        setUsername(payload.username);
      } else {
        toast.error('Invalid token - no username found');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('Invalid token');
      navigate('/login');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          };
          setCurrentLocation(location);
          fetchRoute(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          const defaultLocation = { lat: 13.0827, lng: 80.2707 };
          setCurrentLocation(defaultLocation);
          fetchRoute(defaultLocation);
          toast.info('Using default location (Chennai). Enable location access for better accuracy.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
      const defaultLocation = { lat: 13.0827, lng: 80.2707 };
      setCurrentLocation(defaultLocation);
      fetchRoute(defaultLocation);
    }
  };

  const fetchRoute = async (location) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8082/map/${username}?lat=${location.lat}&lng=${location.lng}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('🗺️ Raw route response:', response.data);
      
      const routeData = response.data.route || [];
      const debugData = response.data.debug || {};
      
      console.log('📊 Debug info:', debugData);
      console.log('📍 Route data points:', routeData.length);
      
      // Log each waypoint for debugging
      routeData.forEach((point, index) => {
        console.log(`${index}: ${point.type} - ${point.address || 'No address'} (${point.lat}, ${point.lng}) Order: ${point.order_id || 'N/A'}`);
      });
      
      setRoute(routeData);
      setDebugInfo(debugData);
    } catch (error) {
      console.error('Error fetching route:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to fetch route data');
      }
    } finally {
      setLoading(false);
    }
  };

  const optimizeAndDisplayRoute = () => {
    if (route.length <= 1) {
      setOptimizedRoute(route);
      setTotalDistance(0);
      initializeMapWithoutRoute();
      return;
    }

    const optimized = optimizeRoute(route);
    setOptimizedRoute(optimized);

    // Use single route approach for better reliability
    initializeMapWithSingleRoute(optimized);
  };

  const handleRefreshRoute = async () => {
    setRefreshing(true);
    try {
      if (currentLocation) {
        await fetchRoute(currentLocation);
        toast.success('Route refreshed and optimized!');
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // FIXED: Single route approach that handles all waypoints properly
  const initializeMapWithSingleRoute = (optimizedRouteData) => {
    if (!mapRef.current || !currentLocation) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Clear previous routing controls
    routingControlsRef.current.forEach(control => {
      if (map.hasLayer(control)) {
        map.removeControl(control);
      }
    });
    routingControlsRef.current = [];

    // Add current location marker
    const currentLocationIcon = L.divIcon({
      html: `<div style="background-color: #3B82F6; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">
               🚚
             </div>`,
      iconSize: [30, 30],
      className: 'current-location-icon'
    });

    L.marker([currentLocation.lat, currentLocation.lng], { icon: currentLocationIcon })
      .addTo(map)
      .bindPopup('<b>🚚 Your Current Location</b>')
      .openPopup();

    if (optimizedRouteData.length > 1) {
      // Add ALL markers first
      let pickupCount = 1;
      let deliveryCount = 1;

      optimizedRouteData.slice(1).forEach((point, index) => {
        const isPickup = point.type === 'pickup';
        const markerColor = isPickup ? '#F59E0B' : '#10B981';
        const count = isPickup ? pickupCount++ : deliveryCount++;
        const typeLabel = isPickup ? 'PICKUP' : 'DELIVERY';
        const icon = isPickup ? '📦' : '🏠';
        
        const deliveryIcon = L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 14px; font-weight: bold;">${count}</span>
                 </div>`,
          iconSize: [40, 40],
          className: 'delivery-marker-icon'
        });

        L.marker([point.lat, point.lng], { icon: deliveryIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; min-width: 200px;">
              <b style="font-size: 16px;">${icon} ${typeLabel} ${count}</b><br>
              <small><strong>Order #${point.order_id || 'N/A'}</strong></small><br>
              <small style="color: #666;">📍 ${point.address || 'Address'}</small><br>
              <small style="color: #999;">${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</small>
            </div>
          `);
      });

      // FIXED: Create ONE route with ALL waypoints
      console.log(`🛣️ Creating single route with ${optimizedRouteData.length} waypoints`);
      
      const waypoints = optimizedRouteData.map((point, index) => {
        console.log(`Waypoint ${index}: ${point.type} at ${point.lat}, ${point.lng}`);
        return L.latLng(point.lat, point.lng);
      });

      // Try single route first
      createSingleRouteWithFallback(map, waypoints, optimizedRouteData);

      // Fit map to show all points
      const group = new L.featureGroup(
        optimizedRouteData.map(point => L.marker([point.lat, point.lng]))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }

    mapInstanceRef.current = map;
  };

  // FIXED: Create single route with intelligent fallback
  const createSingleRouteWithFallback = (map, waypoints, routeData) => {
    console.log(`🚀 Attempting single route with ${waypoints.length} waypoints`);

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      lineOptions: {
        styles: [{ 
          color: '#10B981', 
          weight: 5, 
          opacity: 0.8,
          className: 'complete-route-line'
        }]
      },
      createMarker: function() { 
        return null; // Don't create markers (we have our own)
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving',
        timeout: 45000 // Extended timeout for long routes
      })
    });

    // Success handler
    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const totalDistanceKm = routes[0].summary.totalDistance / 1000;
        setTotalDistance(totalDistanceKm);
        console.log(`✅ Complete route found: ${totalDistanceKm.toFixed(2)} km through ${waypoints.length} stops`);
        toast.success(`Complete route: ${totalDistanceKm.toFixed(2)} km through ${waypoints.length - 1} stops`);
      }
    });

    // Error handler with intelligent fallback
    routingControl.on('routingerror', function(e) {
      console.error(`❌ Single route failed:`, e.error);
      
      // Remove failed routing control
      if (map.hasLayer(routingControl)) {
        map.removeControl(routingControl);
      }
      
      console.log('🔄 Falling back to segmented routing...');
      
      // Fallback to segmented approach
      createIntelligentSegmentedRoutes(map, routeData);
    });

    routingControl.addTo(map);
    routingControlsRef.current.push(routingControl);
  };

  // FIXED: Intelligent segmented routing as fallback
  const createIntelligentSegmentedRoutes = (map, routeData) => {
    let totalDistance = 0;
    let routesCompleted = 0;
    
    console.log(`🔧 Creating segmented routes for ${routeData.length} points`);

    // Create point-to-point segments (no overlapping)
    for (let i = 0; i < routeData.length - 1; i++) {
      const startPoint = routeData[i];
      const endPoint = routeData[i + 1];
      
      console.log(`📍 Segment ${i + 1}: ${startPoint.type} → ${endPoint.type}`);

      const waypoints = [
        L.latLng(startPoint.lat, startPoint.lng),
        L.latLng(endPoint.lat, endPoint.lng)
      ];
      
      const routingControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        lineOptions: {
          styles: [{ 
            color: i % 2 === 0 ? '#10B981' : '#059669',
            weight: 4, 
            opacity: 0.7,
            className: `route-segment-${i}`
          }]
        },
        createMarker: function() { 
          return null;
        },
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving',
          timeout: 30000
        })
      });

      // Success handler
      routingControl.on('routesfound', function(e) {
        routesCompleted++;
        const routes = e.routes;
        if (routes && routes.length > 0) {
          const segmentDistance = routes[0].summary.totalDistance / 1000;
          totalDistance += segmentDistance;
          console.log(`✅ Segment ${i + 1} completed: ${segmentDistance.toFixed(2)} km`);
          
          // Update total when all segments complete
          if (routesCompleted === routeData.length - 1) {
            setTotalDistance(totalDistance);
            console.log(`🎯 All segments completed! Total: ${totalDistance.toFixed(2)} km`);
            toast.success(`Segmented route: ${totalDistance.toFixed(2)} km through ${routeData.length - 1} stops`);
          }
        }
      });

      // Error handler for individual segments
      routingControl.on('routingerror', function(e) {
        console.error(`❌ Segment ${i + 1} failed:`, e.error);
        
        // Create straight line fallback
        const polyline = L.polyline(waypoints, {
          color: '#EF4444',
          weight: 3,
          opacity: 0.6,
          dashArray: '10, 10'
        }).addTo(map);
        
        const fallbackDistance = haversineDistance(
          startPoint.lat, startPoint.lng,
          endPoint.lat, endPoint.lng
        );
        totalDistance += fallbackDistance;
        
        console.log(`⚠️ Segment ${i + 1} fallback: ${fallbackDistance.toFixed(2)} km (straight line)`);
      });

      routingControl.addTo(map);
      routingControlsRef.current.push(routingControl);
    }

    console.log(`🚀 Created ${routeData.length - 1} route segments`);
  };

  const initializeMapWithoutRoute = () => {
    if (!mapRef.current || !currentLocation) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const currentLocationIcon = L.divIcon({
      html: `<div style="background-color: #3B82F6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
               🚚
             </div>`,
      iconSize: [24, 24],
      className: 'current-location-icon'
    });

    L.marker([currentLocation.lat, currentLocation.lng], { icon: currentLocationIcon })
      .addTo(map)
      .bindPopup('<b>🚚 Your Current Location</b>')
      .openPopup();

    mapInstanceRef.current = map;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading and optimizing India-wide route...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-0 m-0 p-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <MdArrowBack className="text-xl" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">🗺️ India-Wide Delivery Map</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 flex items-center">
                <FaRoute className="mr-2" />
                {optimizedRoute.length > 0 ? `${optimizedRoute.length - 1} stops` : 'No deliveries'}
              </div>
              
              {totalDistance > 0 && (
                <div className="text-sm text-green-600 flex items-center font-semibold">
                  <FaRuler className="mr-2" />
                  {totalDistance.toFixed(2)} km total
                </div>
              )}

              {debugInfo.message && (
                <div className="text-xs text-blue-600 max-w-xs truncate">
                  {debugInfo.message}
                </div>
              )}
              
              <button
                onClick={handleRefreshRoute}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                <MdRefresh className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Optimizing...' : 'Refresh & Optimize'}
              </button>
              
              <button
                onClick={getCurrentLocation}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MdMyLocation className="mr-2" />
                Update Location
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Map and Sidebar */}
      <div className="flex h-screen" style={{marginTop: '0', paddingTop: '0'}}>
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <FaRoute className="mr-2" />
              🛣️ Complete Route
            </h3>
            {username && (
              <p className="text-sm text-gray-600">User: {username}</p>
            )}
            {totalDistance > 0 && (
              <p className="text-sm text-green-600 font-semibold">
                📏 Total Distance: {totalDistance.toFixed(2)} km
              </p>
            )}
            {debugInfo.total_points > 0 && (
              <div className="text-xs text-blue-600 mt-2">
                <p>📊 {debugInfo.delivery_orders} active orders</p>
                <p>📦 {debugInfo.pickup_points} pickups | 🏠 {debugInfo.drop_points} drops</p>
                <p>🔧 Single route with intelligent fallback</p>
              </div>
            )}
          </div>
          
          {optimizedRoute.length === 0 ? (
            <div className="p-4 text-center">
              <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No active deliveries</h4>
              <p className="text-gray-500 mb-4">
                You don't have any deliveries assigned yet.
              </p>
              <Link
                to="/available"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Available Orders
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Current Location */}
              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <FaTruck className="text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">🚚 Your Location (Start)</h4>
                    <p className="text-sm text-gray-600">
                      📍 {currentLocation?.lat.toFixed(4)}, {currentLocation?.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* All Route Stops */}
              {optimizedRoute.slice(1).map((point, index) => {
                const isPickup = point.type === 'pickup';
                const globalCount = index + 1; // Simple sequential numbering
                
                return (
                  <div
                    key={`${point.type}-${point.order_id || index}`}
                    className={`rounded-lg p-3 border-l-4 ${
                      isPickup 
                        ? 'bg-orange-50 border-orange-400' 
                        : 'bg-green-50 border-green-400'
                    }`}
                  >
                    <div className="flex items-start">
                      {isPickup ? (
                        <FaWarehouse className="text-orange-600 mt-1 mr-3 flex-shrink-0" />
                      ) : (
                        <FaHome className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          <span className={`inline-block w-6 h-6 rounded-full text-white text-xs font-bold text-center leading-6 mr-2 ${
                            isPickup ? 'bg-orange-500' : 'bg-green-500'
                          }`}>
                            {globalCount}
                          </span>
                          {isPickup ? '📦 Pickup' : '🏠 Delivery'} Stop
                        </h4>
                        <p className="text-sm text-gray-600">
                          📍 {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                        </p>
                        {point.address && (
                          <p className="text-xs text-gray-500 mt-1">
                            🏠 {point.address}
                          </p>
                        )}
                        {point.order_id && (
                          <p className="text-xs text-blue-600">
                            📋 Order #{point.order_id}
                          </p>
                        )}
                        <p className="text-xs text-green-600">
                          🛣️ Connected via roads
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative" style={{margin: '0', padding: '0'}}>
          <div ref={mapRef} className="w-full h-full" style={{margin: '0', padding: '0'}}></div>
          
          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <h4 className="font-semibold text-gray-900 mb-2">🗺️ Map Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span>🚚 Your Location</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                <span>📦 Pickup Points</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>🏠 Delivery Points</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-1 bg-green-500 mr-2"></div>
                <span>🛣️ Complete Route</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-1 bg-red-500 mr-2" style={{borderTop: '2px dashed #EF4444'}}></div>
                <span>⚠️ Fallback Segments</span>
              </div>
              {totalDistance > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="font-semibold text-green-600">📏 {totalDistance.toFixed(2)} km total</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
