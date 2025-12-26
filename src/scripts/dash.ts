import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./FirebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // não logado
    window.location.replace("/");
    return;
  }

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await signOut(auth);
    window.location.replace("/");
    return;
  }

  const dados = snap.data();

  if (dados.posto !== "Admin Account") {
    await signOut(auth);
    window.location.replace("/");
    return;
  }

  // ✅ usuário autorizado → dashboard liberado
});
