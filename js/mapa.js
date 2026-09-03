const CENTRO_SANTAREM = [-2.443, -54.708];

export function criarMapa(elementoId, { lat, lng, arrastavel = false } = {}) {
  const mapa = L.map(elementoId).setView([lat || CENTRO_SANTAREM[0], lng || CENTRO_SANTAREM[1]], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(mapa);
  const marcador = L.marker([lat || CENTRO_SANTAREM[0], lng || CENTRO_SANTAREM[1]], {
    draggable: arrastavel,
  }).addTo(mapa);
  return { mapa, marcador };
}

export function usarMinhaLocalizacao(marcador, mapa) {
  if (!navigator.geolocation) return Promise.reject(new Error("GPS indisponível"));
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        marcador.setLatLng(coords);
        mapa.setView(coords, 16);
        resolve({ lat: coords[0], lng: coords[1] });
      },
      reject,
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

window.SRMapa = { criarMapa, usarMinhaLocalizacao, CENTRO_SANTAREM };
