import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function Location() {
  // List of locations with coordinates and labels
  const locations = [
    {
      name: 'Sundhara (Dharahara)',
      position: [27.6994, 85.3114],
    },
    {
      name: 'Patan (Lalitpur)',
      position: [27.6674, 85.3206],
    },
    {
      name: 'Bouddha',
      position: [27.7215, 85.3616],
    },
  ];

  return (
    <section id="location">
        <h2 className='text-5xl font-bold text-center py-6'>Our Parking Locations</h2>
    <MapContainer center={[27.6994, 85.33]} zoom={13} style={{ height: '500px', width: '100%', zIndex:1  }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {locations.map((loc, index) => (
        <Marker key={index} position={loc.position}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
    </section>
  );
}
export default Location