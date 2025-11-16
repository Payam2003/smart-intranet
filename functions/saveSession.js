import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "./index.js";
import admin from "firebase-admin";
import { google } from "googleapis";
import { createOAuth2Client } from "./index.js";

//ottenere il client secret dal file .env
//inizializzare l'oAuth2Client con il client id e secret e redirect uri

const saveSession = onCall(
	{
		minInstances: 1,
		enforceAppCheck: true,
		region: "europe-west8",
	},
	async (req) => {
		const { code } = req.data;
		if (!code) {
			throw new HttpsError(
				"invalid-argument",
				"La funzione deve essere chiamata con 'code'"
			);
		}

		const oAuth2Client = createOAuth2Client(); // Create a new, isolated client for this request
		// scambiare il code con token e id_token
		const { tokens } = await oAuth2Client.getToken({
			code,
		});
		oAuth2Client.setCredentials(tokens);
		const refreshToken = tokens.refresh_token;

		const oauth2 = google.oauth2({
			auth: oAuth2Client,
			version: "v2",
		});

		//const { data: profile } = await oauth2.userinfo.get();
		const {
			data: { id: uid, name, email, picture },
		} = await oauth2.userinfo.get();
		//const uid = profile.id;
		const userData = {
			uid,
			name,
			email,
			picture,
		};

		try {
			const userRef = db.collection("users").doc(uid);
			const userDoc = await userRef.get();

			if (!userDoc.exists) {
				// Crea un nuovo documento per lo user
				await userRef.set({
					refreshToken,
					createdAt: admin.firestore.FieldValue.serverTimestamp(),
				});
				return { status: "created", user: userData };
			} else {
				await userRef.update({
					refreshToken,
					updatedAt: admin.firestore.FieldValue.serverTimestamp(),
				});
				return { status: "updated", user: userData };
			}
		} catch (error) {
			console.error("Errore durante l'autorizzazione:", error);
			throw new HttpsError(
				"internal",
				"Errore interno del server durante il controllo dell'autorizzazione."
			);
		}
	}
);

export default saveSession;
