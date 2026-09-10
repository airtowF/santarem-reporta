import "./firebase.js";

const {
  db,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} = window.SR;

export function ouvirMensagens(denunciaId, render) {
  const q = query(
    collection(db, "mensagens"),
    where("denunciaId", "==", denunciaId),
  );
  return onSnapshot(q, (snap) => {
    const lista = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort(
        (a, b) =>
          (a.criadoEm?.toMillis?.() || 0) - (b.criadoEm?.toMillis?.() || 0),
      );
    render(lista);
  });
}

export async function enviarMensagem({
  denunciaId,
  autorId,
  autorPerfil,
  texto,
}) {
  await addDoc(collection(db, "mensagens"), {
    denunciaId,
    autorId,
    autorPerfil,
    texto,
    criadoEm: serverTimestamp(),
  });
}

window.SRChat = { ouvirMensagens, enviarMensagem };
