import { onCall } from "firebase-functions/v2/https";
import { db } from "./index.js";
import * as functions from "firebase-functions";

const getPreferenzeUtente = onCall(
	{
		enforceAppCheck: true,
		region: "europe-west8",
		minInstances: 1,
	},
	async (req) => {
		const uid = req.data.id;

		try {
			const userRef = db.collection("users").doc(uid);
			const userDoc = await userRef.get();

			if (!userDoc.exists) {
				return { chiusure: false, compleanni: false, news: false };
			}
			const preferences = userDoc.data().notificationPreferences || {};
			console.log(preferences);
			return preferences;
		} catch (error) {
			console.error(
				"Errore durante il recupero delle preferenze:",
				error
			);
			throw new functions.https.HttpsError(
				"internal",
				"Impossibile recuperare le preferenze."
			);
		}
	}
);

export default getPreferenzeUtente;
