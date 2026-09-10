import "./firebase.js";

const {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  onAuthStateChanged,
  signOut,
  serverTimestamp,
} = window.SR;

export function esperarAuth() {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }
    const off = onAuthStateChanged(auth, (user) => {
      off();
      resolve(user);
    });
  });
}

export async function usuarioAtual() {
  const user = await esperarAuth();
  if (!user) return null;
  const snap = await getDoc(doc(db, "usuarios", user.uid));
  return snap.exists()
    ? { uid: user.uid, ...snap.data() }
    : { uid: user.uid, perfil: null };
}

export function proteger(perfisPermitidos, destinoLogin) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      location.href = destinoLogin;
      return;
    }
    const perfilSnap = await getDoc(doc(db, "usuarios", user.uid));
    const perfil = perfilSnap.exists() ? perfilSnap.data().perfil : null;
    if (perfisPermitidos.length && !perfisPermitidos.includes(perfil)) {
      location.href = destinoLogin;
    }
  });
}

export async function criarPerfil(uid, dados) {
  await setDoc(doc(db, "usuarios", uid), {
    ...dados,
    criadoEm: serverTimestamp(),
  });
}

export async function sair() {
  await signOut(auth);
  location.href = new URL("../../index.html", location.href).href;
}

window.SRAuth = { usuarioAtual, proteger, criarPerfil, sair };
