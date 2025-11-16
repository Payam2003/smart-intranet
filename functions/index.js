import admin from "firebase-admin";
import saveSession from "./saveSession.js";
import checkPostazioni from "./checkPostazioni.js";
import getPreferenzeUtente from "./getPreferenzeUtente.js";
import aggiornaNotifiche from "./aggiornaNotifiche.js";
import { prenotaPostazione } from "./prenotaPostazione.js";
import { google } from "googleapis";
import { defineString } from "firebase-functions/params";

// Define parameters using the modern, recommended approach.
// The Firebase CLI will automatically load values from the correct .env file.
const GOOGLE_CLIENT_ID = defineString("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = defineString("GOOGLE_CLIENT_SECRET");
const GOOGLE_REDIRECT_URI = defineString("GOOGLE_REDIRECT_URI");

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Factory function to create a new, isolated OAuth2 client for each request.
// This is critical to prevent race conditions between concurrent users.
const createOAuth2Client = () =>
  new google.auth.OAuth2(
    GOOGLE_CLIENT_ID.value(),
    GOOGLE_CLIENT_SECRET.value(),
    GOOGLE_REDIRECT_URI.value()
  );

export {
  saveSession,
  checkPostazioni,
  db,
  createOAuth2Client,
  prenotaPostazione,
  aggiornaNotifiche,
  getPreferenzeUtente,
};
