import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { functions } from "../FireBaseInit";
import { httpsCallable } from "firebase/functions";
import { useMyContext } from "../App";

const saveSession = httpsCallable(functions, "saveSession");

function OAuthCallback() {
	const location = useLocation();
	const navigate = useNavigate();
	const { setUser } = useMyContext();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const code = params.get("code");
		const state = params.get("state");
		if (state !== import.meta.env.VITE_CSRF_CHECK_CONTROL) {
			console.error("redirect state non valido");
			return;
		}
		if (code) {
			// TODO: Inviare il code al backend e poi eseguire il flusso seguente
			/* 
        1. Your backend must securely exchange the code for tokens.
        2. It makes a POST request to Google's token endpoint (https://oauth2.googleapis.com/token).
        This request includes the code, your client_id, your client_secret (which must be kept secret on the server), and the redirect_uri.
        Google validates the request and returns an access_token, a refresh_token, and, importantly, an id_token.
        3. Get User Data from id_token: The id_token is a JSON Web Token (JWT). Your backend can decode and verify this token. It contains basic user profile information like their Google ID, name, email, and profile picture URL. This is the most efficient way to get the user's identity data.
        4. Store Data: Your backend can then store the tokens and the user profile information in your database, associated with the uid you passed along.
      */
			saveSession({ code })
				.then((res) => {
					const user = res.data.user;
					console.log("Sessione salvata:", res.data);
					localStorage.setItem("user", JSON.stringify(user));
					setUser(user);
					navigate("/main");
				})
				.catch((error) => {
					console.error(
						"Errore nel salvataggio della sessione:",
						error
					);
				});
		}
	}, [location]);

	return <div>Salvataggio della sessione utente...</div>;
}

export default OAuthCallback;
