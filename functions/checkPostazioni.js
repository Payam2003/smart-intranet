import { onCall, HttpsError } from "firebase-functions/v2/https";
import { google } from "googleapis";
import { db } from "./index.js";
import { createOAuth2Client } from "./index.js";

const postazioni = [
	{
		id: "c_1886baj76da2chm9kpjt5sqeusv5s@resource.calendar.google.com",
		label: "Primo piano - Postazione 1",
	},
	{
		id: "c_188cfqiji20c2ii4ipqc5j0sl8ucm@resource.calendar.google.com",
		label: "Primo piano - Postazione 2",
	},
	{
		id: "c_188am8l893qioiqdmd1itnd4dnr0s@resource.calendar.google.com",
		label: "Secondo piano - Sala Jolly",
	},
];

const checkPostazioni = onCall(
	{
		enforceAppCheck: true,
		region: "europe-west8",
		minInstances: 1,
	},
	async (request) => {
		const uid = request.data.id;
		const startDate = request.data.date;
		console.log("uid", uid, "date", startDate);

		if (!uid) {
			throw new HttpsError("unauthenticated", "Utente non autenticato.");
		}
		const userDoc = await db.collection("users").doc(uid).get();
		if (!userDoc.exists) {
			throw new HttpsError("not-found", "Utente non trovato.");
		}
		const refreshToken = userDoc.data()?.refreshToken;
		const oAuth2Client = createOAuth2Client(); // Create a new, isolated client for this request
		oAuth2Client.setCredentials({ refresh_token: refreshToken });

		const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

		// Data a giornata intera
		const timeMin = new Date(`${startDate}T00:00:00Z`);
		const timeMax = new Date(`${startDate}T23:59:59Z`);

		// FreeBusy API per verificare disponibilità
		const res = await calendar.freebusy.query({
			requestBody: {
				timeMin: timeMin.toISOString(),
				timeMax: timeMax.toISOString(),
				timeZone: "Europe/Rome",
				items: postazioni,
			},
		});
		console.log(res);

		const busyData = res.data.calendars;

		const disponibili = Object.entries(busyData).map(
			([calendarId, value]) => ({
				calendarId,
				label:
					postazioni.find((p) => p.id === calendarId)?.label ||
					calendarId,
				disponibile: value.busy.length === 0,
			})
		);

		return {
			ok: true,
			data: disponibili,
		};
	}
);

export default checkPostazioni;
