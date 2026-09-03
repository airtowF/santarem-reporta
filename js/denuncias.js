import "./firebase.js";

const {
  db, storage, collection, addDoc, updateDoc, doc, query, where, orderBy,
  getDocs, serverTimestamp, secretariaDoTipo, novoProtocolo, ref, uploadBytes, getDownloadURL,
} = window.SR;

export async function criarDenuncia({ cidadaoId, tipo, descricao, lat, lng, endereco, arquivo }) {
  const protocolo = novoProtocolo();
  const payload = {
    protocolo,
    tipo,
    descricao,
    fotoUrl: null,
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
  if (arquivo) {
    const arquivoRef = ref(storage, `denuncias/${cidadaoId}/${criado.id}.jpg`);
    await uploadBytes(arquivoRef, arquivo);
    const fotoUrl = await getDownloadURL(arquivoRef);
    await updateDoc(doc(db, "denuncias", criado.id), { fotoUrl, atualizadoEm: serverTimestamp() });
  }
  return { id: criado.id, protocolo };
}

export async function listarDoCidadao(cidadaoId) {
  const q = query(
    collection(db, "denuncias"),
    where("cidadaoId", "==", cidadaoId),
    orderBy("criadoEm", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listarDaSecretaria(secretaria) {
  const q = query(
    collection(db, "denuncias"),
    where("secretaria", "==", secretaria),
    orderBy("criadoEm", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function alterarStatus(denunciaId, status, servidorId) {
  await updateDoc(doc(db, "denuncias", denunciaId), {
    status,
    servidorId,
    atualizadoEm: serverTimestamp(),
  });
}

window.SRDenuncias = { criarDenuncia, listarDoCidadao, listarDaSecretaria, alterarStatus };
