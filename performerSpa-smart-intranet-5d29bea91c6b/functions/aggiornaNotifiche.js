import { onCall } from "firebase-functions/v2/https";
import { db } from "./index.js";
import * as functions from "firebase-functions";

const aggiornaNotifiche = onCall(
	{
		enforceAppCheck: true,
		region: "europe-west8",
		minInstances: 1,
	},
	async (req) => {
		const uid = req.data.id;
		const type = req.data.type;
		const value = req.data.value;

		if (type === "all" && typeof value === "object") {
			try {
				const userRef = db.collection("users").doc(uid);

				await userRef.set(
					{
						notificationPreferences: value,
					},
					{ merge: true }
				);

				return {
					success: true,
					message: "Preferenze aggiornate con successo.",
					updated: value,
				};
			} catch (error) {
				console.error("Errore durante update preferenze:", error);
				throw new functions.https.HttpsError(
					"internal",
					"Errore durante l'aggiornamento delle preferenze."
				);
			}
		}

		const validTypes = ["chiusure", "compleanni", "news"];
		if (!validTypes.includes(type) || typeof value !== "boolean") {
			throw new functions.https.HttpsError(
				"invalid-argument",
				"I dati forniti non sono validi."
			);
		}

		try {
			const userRef = db.collection("users").doc(uid);
			await userRef.update({
				[`notificationPreferences.${type}`]: value,
			});

			console.log(
				`Updated preference '${type}' to '${value}' for user ${uid}.`
			);
			return {
				success: true,
				message: `Campo '${type}' aggiornato a ${value}.`,
				updated: { [type]: value },
			};
		} catch (error) {
			console.error(
				"Errore durante l'aggiornamento delle preferenze:",
				error
			);
			throw new functions.https.HttpsError(
				"internal",
				"Impossibile aggiornare le preferenze."
			);
		}
	}
);

export default aggiornaNotifiche;
