// client/src/components/TravelMap.jsx
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issue with CRA/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
});

// Custom coloured icons
const createIcon = (color) => new L.Icon({
  iconUrl:       `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl:     markerShadow,
  iconSize:      [25, 41],
  iconAnchor:    [12, 41],
  popupAnchor:   [1, -34],
  shadowSize:    [41, 41],
});

const redIcon    = createIcon('red');
const blueIcon   = createIcon('blue');
const greenIcon  = createIcon('green');

// ─── Haversine ────────────────────────────────────────────────────────────────
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ─── Nearest-neighbor ordering from airport ───────────────────────────────────
function orderClusters(clusters) {
  const start = { lat: 7.18, lon: 79.88 }; // Bandaranaike Airport
  const remaining = [...clusters];
  const ordered   = [];
  let current = start;
  while (remaining.length > 0) {
    let closestIdx = 0, minDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const c = remaining[i];
      const d = getDistance(current.lat, current.lon, c.lat, c.lon);
      if (d < minDist) { minDist = d; closestIdx = i; }
    }
    const next = remaining.splice(closestIdx, 1)[0];
    ordered.push(next);
    current = next;
  }
  return ordered;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function TravelMap({ clusters, selectedPlaces, suggestions = [] }) {
  const [routeCoords, setRouteCoords] = useState([]);
  const airport = [7.18, 79.88];

  const validClusters = (clusters || []).filter(c => c.lat && c.lon);
  const orderedClusters = orderClusters(validClusters);

  // Fetch OSRM road route
  useEffect(() => {
    if (validClusters.length === 0) return;
    const fetchRoute = async () => {
      const points = [airport, ...orderedClusters.map(c => [c.lat, c.lon])];
      let fullRoute = [];
      for (let i = 0; i < points.length - 1; i++) {
        const url = `https://router.project-osrm.org/route/v1/driving/${points[i][1]},${points[i][0]};${points[i+1][1]},${points[i+1][0]}?overview=full&geometries=geojson`;
        try {
          const res  = await fetch(url);
          const data = await res.json();
          if (data.routes?.[0]) {
            const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            fullRoute = [...fullRoute, ...coords];
          }
        } catch (e) { /* silently skip if OSRM is down */ }
      }
      setRouteCoords(fullRoute);
    };
    fetchRoute();
  }, [airport, orderedClusters, validClusters.length]);

  if (validClusters.length === 0) return null;

  // Flatten selected places across all clusters
  const allSelectedPlaces = Object.entries(selectedPlaces || {}).flatMap(
    ([clusterName, places]) => (places || []).map(p => ({ ...p, clusterName }))
  );

  return (
    <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.08)', marginTop: '24px' }}>
      <MapContainer
        center={airport}
        zoom={7}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✈️ Airport */}
        <Marker position={airport} icon={greenIcon}>
          <Popup><strong>✈️ Bandaranaike Airport</strong><br />Your starting point</Popup>
        </Marker>

        {/* 📍 Selected Clusters (Red) */}
        {orderedClusters.map((c, i) => (
          <Marker key={`cluster-${i}`} position={[c.lat, c.lon]} icon={redIcon}>
            <Popup>
              <strong>📍 Stop #{i + 1}: {c.cluster}</strong><br />
              Match Score: {c.score?.toFixed(1)}<br />
              {c.places?.length || 0} places available
            </Popup>
          </Marker>
        ))}

        {/* 💡 Suggestions (lighter icon) */}
        {(suggestions || []).filter(s => s.lat && s.lon).map((s, i) => (
          <Marker key={`suggest-${i}`} position={[s.lat, s.lon]} icon={blueIcon}>
            <Popup>
              <strong>💡 Suggestion: {s.cluster}</strong><br />
              Score: {s.score?.toFixed(1)}
            </Popup>
          </Marker>
        ))}

        {/* 🏝️ Selected Place Markers (Blue) */}
        {allSelectedPlaces.filter(p => p.lat && p.lon).map((place, i) => (
          <Marker key={`place-${i}`} position={[place.lat, place.lon]} icon={blueIcon}>
            <Popup>
              <strong>{place.place}</strong><br />
              📍 {place.clusterName}<br />
              🏙️ {place.city}<br />
              ⭐ {place.rating}<br />
              🏷️ {place.category}
            </Popup>
          </Marker>
        ))}

        {/* 🔵 Route Polyline */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="#1a6b2e" weight={4} opacity={0.7} />
        )}
      </MapContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '24px', padding: '16px 24px', background: 'white', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }}></div> Airport
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></div> Selected Clusters
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6' }}></div> Places / Suggestions
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
          <div style={{ width: 4, height: 12, background: '#1a6b2e', borderRadius: 2 }}></div> Driving Route
        </div>
      </div>
    </div>
  );
}

export default TravelMap;
