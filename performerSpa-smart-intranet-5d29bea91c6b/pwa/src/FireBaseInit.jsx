import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
//import { getMessaging } from "firebase/messaging";
import {
	initializeAppCheck,
	ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const FireBaseApp = initializeApp(firebaseConfig);
const auth = getAuth(FireBaseApp);
const db = getFirestore(FireBaseApp);
//const messaging = getMessaging(app);

let appCheckProvider;
const LOCAL =
	typeof window !== "undefined" &&
	(window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1");

if (import.meta.env.MODE === "development") {
	// attivazione debug mode: questo espone in console il token di debug
	// che andrà inserito nel campo "Debug token" della console di Firebase
	appCheckProvider = new ReCaptchaEnterpriseProvider(
		import.meta.env.VITE_APPCHECK_DEBUG_TOKEN
	);
	self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
	console.log(
		"Source running in local",
		import.meta.env.VITE_APPCHECK_DEBUG_TOKEN
	);
} else if (LOCAL) {
	// Use debug token in emulator mode
	self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
	appCheckProvider = new ReCaptchaEnterpriseProvider(
		import.meta.env.VITE_APPCHECK_DEBUG_TOKEN
	);
	console.log("Build running in emulator");
} else {
	appCheckProvider = new ReCaptchaEnterpriseProvider(
		import.meta.env.VITE_APPCHECK_TOKEN
	);
	console.log("Build running in production");
}
if (appCheckProvider) {
	initializeAppCheck(FireBaseApp, {
		provider: appCheckProvider,
		isTokenAutoRefreshEnabled: true,
	});
}
const functions = getFunctions(FireBaseApp, "europe-west8");
if (LOCAL) {
	// inizializza l'emulatore Auth
	// connectAuthEmulator(auth, "http://localhost:9099");
	// const functions = getFunctions(FireBaseApp);
	connectFunctionsEmulator(functions, "localhost", 5001);
}

export { auth, db, functions };
export default FireBaseApp;
