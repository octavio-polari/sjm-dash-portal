var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./FirebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
const form = document.getElementById("form_login");
const alertModal = document.getElementById("alertModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
// const back = document.getElementById("back") as HTMLElement;
function openAlertModal(title = "Alert", message = "") {
    if (!alertModal)
        return;
    modalTitle.textContent = title;
    modalText.textContent = message;
    alertModal.showModal();
}
function closeAlertModal() {
    if (!alertModal)
        return;
    alertModal.close();
}
// expõe para o HTML
window.openAlertModal = openAlertModal;
window.closeAlertModal = closeAlertModal;
// back.addEventListener("click", async (e) => {
//     openAlertModal("Atenção!", "Você está fazendo logout\nAté Mais!");
//     await signOut(auth);
//     return;
// })
function logout() {
    openAlertModal("Atenção!", "Você está fazendo logout\nAté Mais!");
    signOut(auth);
    return;
}
;
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        // 1️⃣ Autenticação
        const cred = yield signInWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;
        // 2️⃣ Busca do usuário no Firestore
        const ref = doc(db, "usuarios", uid);
        const snap = yield getDoc(ref);
        if (!snap.exists()) {
            yield signOut(auth);
            openAlertModal("Atenção!", "Usuário não autorizado");
            return;
        }
        const dados = snap.data();
        // 3️⃣ Validação por regra de negócio
        if (dados.posto !== "Admin Account") {
            yield signOut(auth);
            openAlertModal("Atenção!", "Acesso restrito");
            return;
        }
        // ✅ Usuário autorizado
        // Remover em produção
        // window.location.href = "src/pages/dashboard.html";
    }
    catch (error) {
        openAlertModal("Atenção!", "Email ou senha inválidos");
        console.error(error);
    }
}));
//# sourceMappingURL=app.js.map