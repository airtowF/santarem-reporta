const CENTRO_SANTAREM = [-2.443, -54.708];

const COR_TIPO = {
  buraco: "#ef4444",
  rua: "#f97316",
  lixo: "#14b8a6",
  iluminacao: "#f59e0b",
  sinalizacao: "#3b82f6",
  ambiental: "#22c55e",
};

export function criarMapa(
  elementoId,
  { lat, lng, arrastavel = false, comMarcador = true } = {},
) {
  const mapa = L.map(elementoId).setView(
    [lat || CENTRO_SANTAREM[0], lng || CENTRO_SANTAREM[1]],
    13,
  );
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(mapa);
  let marcador = null;
  if (comMarcador) {
    marcador = L.marker(
      [lat || CENTRO_SANTAREM[0], lng || CENTRO_SANTAREM[1]],
      {
        draggable: arrastavel,
      },
    ).addTo(mapa);
  }
  return { mapa, marcador };
}

export function plotarDenuncias(mapa, denuncias) {
  const pontos = [];
  denuncias.forEach((d) => {
    if (d.lat == null || d.lng == null) return;
    const pino = L.marker([d.lat, d.lng]).addTo(mapa);
    pino.bindPopup(
      `<strong>${d.protocolo || ""}</strong><br>${d.tipo} · ${d.status}`,
    );
    pontos.push([d.lat, d.lng]);
  });
  if (pontos.length) mapa.fitBounds(pontos, { padding: [40, 40], maxZoom: 15 });
}

export async function buscarEndereco(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", "Accept-Language": "pt-BR" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.display_name || null;
}

export function usarMinhaLocalizacao(marcador, mapa) {
  if (!navigator.geolocation)
    return Promise.reject(new Error("GPS indisponível"));
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        marcador.setLatLng(coords);
        mapa.setView(coords, 16);
        resolve({ lat: coords[0], lng: coords[1] });
      },
      reject,
      { enableHighAccuracy: true, timeout: 8000 },
    );
  });
}

window.SRMapa = {
  criarMapa,
  usarMinhaLocalizacao,
  plotarDenuncias,
  buscarEndereco,
  CENTRO_SANTAREM,
};
