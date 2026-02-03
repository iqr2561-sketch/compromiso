import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5mN4dQCjBojVKNXd0ie2Bd5gQ5CEVx5k",
    authDomain: "compromisodiario-d0eaf.firebaseapp.com",
    projectId: "compromisodiario-d0eaf",
    storageBucket: "compromisodiario-d0eaf.firebasestorage.app",
    messagingSenderId: "477525099614",
    appId: "1:477525099614:web:942d9b004686ec824b60cf",
    measurementId: "G-L1FKH9XVW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { app, analytics };
