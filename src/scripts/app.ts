import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./FirebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

const form = document.getElementById("form_login") as HTMLFormElement;
const alertModal = document.getElementById("alertModal") as HTMLDialogElement;
const modalTitle = document.getElementById("modalTitle") as HTMLElement;
const modalText = document.getElementById("modalText") as HTMLElement;

// const back = document.getElementById("back") as HTMLElement;

function openAlertModal(title: string = "Alert", message: string = ""): void {
    if (!alertModal) return;
    
    modalTitle.textContent = title;
    modalText.textContent = message;
    alertModal.showModal();
}

function closeAlertModal(): void {
    if (!alertModal) return;
    alertModal.close();
}

// expõe para o HTML
(window as any).openAlertModal = openAlertModal;
(window as any).closeAlertModal = closeAlertModal;

// back.addEventListener("click", async (e) => {
    //     openAlertModal("Atenção!", "Você está fazendo logout\nAté Mais!");
    //     await signOut(auth);
    //     return;
    // })
    
function logout() {
    openAlertModal("Atenção!", "Você está fazendo logout\nAté Mais!");
    signOut(auth);
    return;
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();
        
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
        // 1️⃣ Autenticação
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        // 2️⃣ Busca do usuário no Firestore
        const ref = doc(db, "usuarios", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            await signOut(auth);
            openAlertModal("Atenção!", "Usuário não autorizado");
            return;
        }

        const dados = snap.data();

        // 3️⃣ Validação por regra de negócio
        if (dados.posto !== "Admin Account") {
            await signOut(auth);
            openAlertModal("Atenção!", "Acesso restrito");
            return;
        }

        // ✅ Usuário autorizado
        // Remover em produção
        // window.location.href = "src/pages/dashboard.html";

    } catch (error) {
        openAlertModal("Atenção!", "Email ou senha inválidos");
        console.error(error);
    }
});
