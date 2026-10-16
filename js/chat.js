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
  if (autorPerfil === "servidor" || autorPerfil === "admin") {
    const { getDoc, doc } = window.SR;
    const snap = await getDoc(doc(db, "denuncias", denunciaId));
    const dados = snap.exists() ? snap.data() : {};
    const { criarNotificacao } = await import("./notificacoes.js");
    await criarNotificacao({
      cidadaoId: dados.cidadaoId,
      denunciaId,
      tipo: "chat",
      texto: `Nova mensagem no protocolo ${dados.protocolo || ""}.`,
      para: "cidadao",
    });
  }
  if (autorPerfil === "cidadao") {
    const { getDoc, doc } = window.SR;
    const snap = await getDoc(doc(db, "denuncias", denunciaId));
    const dados = snap.exists() ? snap.data() : {};
    const { criarNotificacao } = await import("./notificacoes.js");
    await criarNotificacao({
      cidadaoId: dados.cidadaoId,
      denunciaId,
      tipo: "chat",
      texto: `Nova mensagem do cidadão no protocolo ${dados.protocolo || ""}.`,
      para: "servidor",
      secretaria: dados.secretaria,
    });
  }
}

window.SRChat = { ouvirMensagens, enviarMensagem };
