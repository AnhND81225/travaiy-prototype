import {useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type {Place} from './api';

export function GeoapifyMap({places}: {places: Place[]}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const key = import.meta.env.VITE_GEOAPIFY_API_KEY?.trim();
  const located = places.filter(p => p.location && Number.isFinite(p.location.lat) && Number.isFinite(p.location.lng));

  useEffect(() => {
    if (!key || !container.current) return;
    setFailed(false);
    const instance = L.map(container.current, {scrollWheelZoom: false}).setView([10.7769, 106.7009], 12);
    map.current = instance;
    const tiles = L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${encodeURIComponent(key)}`, {
      maxZoom: 20,
      attribution: 'Powered by <a href="https://www.geoapify.com/">Geoapify</a> | © OpenMapTiles | <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>',
    }).addTo(instance);
    tiles.on('tileerror', () => setFailed(true));
    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(container.current);
    return () => { observer.disconnect(); instance.remove(); map.current = null; markers.current.clear(); };
  }, [key, attempt]);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();
    const bounds = L.latLngBounds([]);
    places.forEach((place, index) => {
      if (!place.location || !Number.isFinite(place.location.lat) || !Number.isFinite(place.location.lng)) return;
      const point: L.LatLngTuple = [place.location.lat, place.location.lng];
      const label = document.createElement('span');
      label.textContent = place.name;
      const marker = L.marker(point, {title: place.name, icon: L.divIcon({
        className: 'ai-map-marker', html: String(index + 1), iconSize: [30, 30], iconAnchor: [15, 15],
      })}).bindPopup(label).addTo(instance);
      markers.current.set(place.id, marker);
      bounds.extend(point);
    });
    if (bounds.isValid()) instance.fitBounds(bounds, {padding: [30, 30], maxZoom: 15});
  }, [places, key, attempt]);

  return <section className="ai-card">
    <h2>Bản đồ chuyến đi</h2>
    {!key ? <p>Bản đồ chưa được cấu hình. Bạn vẫn có thể xem danh sách địa điểm bên dưới.</p> : <>
      <div ref={container} className="ai-geoapify-map" role="region" aria-label="Bản đồ Geoapify các địa điểm trong chuyến đi" />
      {failed && <p role="status">Chưa tải được bản đồ. <button onClick={() => setAttempt(value => value + 1)}>Thử lại</button></p>}
      {!located.length && <p>Chưa có tọa độ để đánh dấu địa điểm.</p>}
    </>}
    <p>Chọn địa điểm để xem vị trí trên bản đồ.</p>
    {places.map((place, index) => <p key={place.id}><button disabled={!key || !located.some(p => p.id === place.id)} onClick={() => {
      const marker = markers.current.get(place.id);
      if (marker) { map.current?.setView(marker.getLatLng(), 16); marker.openPopup(); }
    }}>{index + 1}. {place.name}</button>{!place.location && ' · Chưa có tọa độ'}</p>)}
  </section>;
}
