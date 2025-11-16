import { onCall, HttpsError } from "firebase-functions/v2/https";
import { google } from "googleapis";
import { db } from "./index.js";
import { createOAuth2Client } from "./index.js";

export const prenotaPostazione = onCall(
	{
		enforceAppCheck: true,
		minInstances: 1,
		region: "europe-west8",
	},
	async (req) => {
		const uid = req.data.id;
		const id_postazione = req.data.index;
		const date = req.data.date;

		const userDoc = await db.collection("users").doc(uid).get();
		if (!userDoc.exists) {
			throw new HttpsError("not-found", "Utente non trovato.");
		}
		const refreshToken = userDoc.data()?.refreshToken;
		const oAuth2Client = createOAuth2Client(); // Create a new, isolated client for this request
		oAuth2Client.setCredentials({ refresh_token: refreshToken });

		const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

		const nextDay = new Date(date);
		nextDay.setDate(nextDay.getDate() + 1);
		const endDate = nextDay.toISOString().split("T")[0]; // YYYY-MM-DD

		const event = {
			summary: "Prenotazione postazione",
			description: "Hai prenotato una postazione!",
			start: {
				date: date,
			},
			end: {
				date: endDate,
			},
			attendees: [{ email: id_postazione }],
		};

		try {
			const res = await calendar.events.insert({
				auth: oAuth2Client,
				calendarId: "primary",
				requestBody: event,
			});

			return { ok: true, event: res.data.id };
		} catch (error) {
			console.error("Creazione dell'evento fallito", error);
			throw new HttpsError(
				"internal",
				"Impossibile prenotare la postazione."
			);
		}
	}
);
