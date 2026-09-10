import "./firebase.js";

const {
  db,
  storage,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  secretariaDoTipo,
  novoProtocolo,
  ref,
  uploadBytes,
  getDownloadURL,
} = window.SR;

function comprimirFoto(arquivo, maxLado = 1000, qualidade = 0.6) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(arquivo);
    img.onload = () => {
      const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", qualidade));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function criarDenuncia({
  cidadaoId,
  tipo,
  descricao,
  lat,
  lng,
  endereco,
  arquivo,
}) {
  const protocolo = novoProtocolo();
  let fotoUrl = null;
  if (arquivo) {
    fotoUrl = await comprimirFoto(arquivo);
  }
  const payload = {
    protocolo,
    tipo,
    descricao,
    fotoUrl,
    lat,
    lng,
    endereco: endereco || null,
    status: "pendente",
    secretaria: secretariaDoTipo(tipo),
    cidadaoId,
    servidorId: null,
    protocoloMunicipal: null,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  };
  const criado = await addDoc(collection(db, "denuncias"), payload);
  return { id: criado.id, protocolo };
}

function ordenarPorData(lista) {
  return lista.sort((a, b) => {
    const ta = a.criadoEm?.toMillis?.() || 0;
    const tb = b.criadoEm?.toMillis?.() || 0;
    return tb - ta;
  });
}

export async function listarDoCidadao(cidadaoId) {
  const q = query(
    collection(db, "denuncias"),
    where("cidadaoId", "==", cidadaoId),
  );
  const snap = await getDocs(q);
  return ordenarPorData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function listarDaSecretaria(secretaria) {
  const q = query(
    collection(db, "denuncias"),
    where("secretaria", "==", secretaria),
  );
  const snap = await getDocs(q);
  return ordenarPorData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function alterarStatus(denunciaId, status, servidorId) {
  await updateDoc(doc(db, "denuncias", denunciaId), {
    status,
    servidorId,
    atualizadoEm: serverTimestamp(),
  });
}

window.SRDenuncias = {
  criarDenuncia,
  listarDoCidadao,
  listarDaSecretaria,
  alterarStatus,
};
