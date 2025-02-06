import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyB0xHleUMWvYaCw12Otx6S_oBOJ3eA3l1A",
//     authDomain: "office-expenses-7f0d1.firebaseapp.com",
//     projectId: "office-expenses-7f0d1",
//     storageBucket: "office-expenses-7f0d1.firebasestorage.app",
//     messagingSenderId: "142230867666",
//     appId: "1:142230867666:web:0f863ad93a9150d846270b",
//     measurementId: "G-S7Z7B9QY2S"
// };

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3q7Wj1FzLVcON52Ra1ovlFXIzZIrVMbI",
    authDomain: "office-expenses-de258.firebaseapp.com",
    projectId: "office-expenses-de258",
    storageBucket: "office-expenses-de258.firebasestorage.app",
    messagingSenderId: "661570586036",
    appId: "1:661570586036:web:a347a0301a0554c9e65ee1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Show Message Function
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.classList.remove('d-none');
    messageDiv.textContent = message;
    setTimeout(() => messageDiv.classList.add('d-none'), 2000);
}

// Sign Up with Email Verification
document.getElementById('registrationForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('name').value;
    const lastName = document.getElementById('lastname').value;
    const phone = document.getElementById('phone').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            sendEmailVerification(user)
                .then(() => {
                    showMessage("A verification email has been sent. Please check your inbox.", "signUpMessage");
                });

            return setDoc(doc(db, "users", user.uid), { firstName, lastName, email, phone, verified: false });
        })
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => showMessage('Error: ' + error.message, 'signUpMessage'));
});

// Prevent Login if Email is Not Verified
document.getElementById('loginForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            if (!user.emailVerified) {
                showMessage("Please verify your email before logging in.", "signInMessage");
                return;
            }
            window.location.href = 'Home.html';
            clearInterval(interval);
        })
        .catch((error) => showMessage('Error: ' + error.message, 'signInMessage'));
});

document.getElementById("sendResetEmailBtn").addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("resetEmail").value.trim();
    const forgotPasswordMessage = document.getElementById("forgotPasswordMessage");

    forgotPasswordMessage.classList.add('d-none');

    const emailPattern = /^[^ ]+@[^ ]+\.(com|in)$/;
    if (!email.match(emailPattern)) {
        forgotPasswordMessage.classList.remove('d-none');
        forgotPasswordMessage.textContent = "Please enter a valid email address.";
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            forgotPasswordMessage.classList.remove('d-none');
            forgotPasswordMessage.textContent = "Password reset email sent. Please check your inbox.";

            let modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
            modal.hide();

            alert('Password reset link has been sent to your email!');
        })
        .catch((error) => {
            forgotPasswordMessage.classList.remove('d-none');
            forgotPasswordMessage.textContent = "Error: " + error.message;
        });
});

// Google Login
document.getElementById("google-login")?.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;

            const userDocRef = doc(db, "users", user.uid);
            setDoc(userDocRef, {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                lastLogin: new Date().toISOString(),
            }, { merge: true })
                .then(() => {
                    window.location.href = 'Home.html';
                })
                .catch((error) => {
                    console.error("Error saving user data to Firestore:", error);
                });
        })
        .catch((error) => {
            console.error("Google Login Error:", error);
        });
});
