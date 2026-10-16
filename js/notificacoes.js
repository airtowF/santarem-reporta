import "./firebase.js";

const {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} = window.SR;

export async function criarNotificacao({
  cidadaoId,
  denunciaId,
  tipo,
  texto,
  para = "cidadao",
  secretaria = null,
}) {
  if (para === "cidadao" && !cidadaoId) return;
  if (para === "servidor" && !secretaria) return;
  await addDoc(collection(db, "notificacoes"), {
    cidadaoId: cidadaoId || null,
    denunciaId: denunciaId || null,
    tipo,
    texto,
    para,
    secretaria,
    lida: false,
    criadoEm: serverTimestamp(),
  });
}

export async function listarNotificacoes(cidadaoId) {
  const snap = await getDocs(
    query(collection(db, "notificacoes"), where("cidadaoId", "==", cidadaoId)),
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((n) => n.para !== "servidor")
    .sort(
      (a, b) =>
        (b.criadoEm?.toMillis?.() || 0) - (a.criadoEm?.toMillis?.() || 0),
    );
}

export async function listarNotificacoesServidor(secretaria) {
  const snap = await getDocs(
    query(
      collection(db, "notificacoes"),
      where("para", "==", "servidor"),
      where("secretaria", "==", secretaria),
    ),
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort(
      (a, b) =>
        (b.criadoEm?.toMillis?.() || 0) - (a.criadoEm?.toMillis?.() || 0),
    );
}

export async function marcarLidas(lista) {
  await Promise.all(
    lista
      .filter((n) => !n.lida)
      .map((n) => updateDoc(doc(db, "notificacoes", n.id), { lida: true })),
  );
}

window.SRNotificacoes = {
  criarNotificacao,
  listarNotificacoes,
  listarNotificacoesServidor,
  marcarLidas,
};
