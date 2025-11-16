import { useState, useEffect } from "react";
import { checkActionCode, onAuthStateChanged } from "firebase/auth";
import { auth } from "./FireBaseInit";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createContext, useContext } from "react";

import { AppFrame } from "./AppFrame";
import Login from "./Auth/Login";
import { Main } from "./Pages/Main";
import { TOS, Privacy } from "./Auth/Legal";
import { Provider } from "@/components/ui/provider";

import Preferences from "./Pages/Preferences";
import QRCode from "./Pages/QRCode";
import Postazioni from "./Pages/Postazioni";

import OAuthCallback from "./Pages/OAuthCallback";
import { Toaster, toaster } from "@/components/ui/toaster";

const MyContext = createContext();

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppFrame />,
		handle: { title: "Home" },
		children: [
			{
				path: "main",
				element: <Main />,
				handle: { title: "Menu principale" },
			},
			{
				path: "login",
				element: <Login />,
				handle: { title: "Login" },
			},
			{
				path: "Preferences",
				element: <Preferences />,
				handle: { title: "Preferenze utente" },
			},
			{
				path: "QRcode",
				element: <QRCode />,
				handle: { title: "QR-Login" },
			},
			{
				path: "events",
				element: <Postazioni />,
				handle: { title: "Prenota Postazione" },
			},
			{
				path: "__/auth/handler",
				element: <OAuthCallback />,
				handle: { title: "Autenticazione" },
			},
		],
	},
	{
		path: "terms-of-service",
		element: <TOS />,
	},
	{
		path: "privacy",
		element: <Privacy />,
	},
]);

export const redirectToGoogleOAuth = () => {
	// passare client id e redirect uri come variabile d'ambiente
	const clientId = import.meta.env.VITE_CLIENT_ID;
	const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI);

	const scope = encodeURIComponent(
		"https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
	);
	const state = import.meta.env.VITE_CSRF_CHECK_CONTROL;

	const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

	window.location.href = url;
};

function App() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// currentUser ha un array providerData con i provider collegati
		// per ciascuno di essi c'è un oggetto con i dati specifici
		// visto che questa app utilizza solo Google, vengono presi i dati del primo provider
		// nota bene: la chiave uid è diversa da provider.uid: la prima è l'uid di Firebase, la seconda è l'uid del provider
		// noi teniamo la seconda perché potrebbe venire utile per chiamate API specifiche del provider
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	if (loading) {
		console.log("loading", loading);
		return <div>Splashscreen here...wait please</div>; // sostituire con Splash Screen
	}

	return (
		<Provider>
			<MyContext.Provider value={{ user, setUser, isLoading: loading }}>
				<RouterProvider router={router} />
			</MyContext.Provider>
			<Toaster />
		</Provider>
	);
}

export default App;

export const useMyContext = () => {
	return useContext(MyContext);
};

export const useToasterCreate = () => {
	return (props) => toaster.create({ ...props, duration: 3000 });
};
