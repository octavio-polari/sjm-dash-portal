var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./FirebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
onAuthStateChanged(auth, (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user) {
        // não logado
        window.location.replace("/");
        return;
    }
    const ref = doc(db, "usuarios", user.uid);
    const snap = yield getDoc(ref);
    if (!snap.exists()) {
        yield signOut(auth);
        window.location.replace("/");
        return;
    }
    const dados = snap.data();
    if (dados.posto !== "Admin Account") {
        yield signOut(auth);
        window.location.replace("/");
        return;
    }
    // ✅ usuário autorizado → dashboard liberado
}));
//# sourceMappingURL=dash.js.map