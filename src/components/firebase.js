import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: "AIzaSyAZxVL64pzCcR-exlxQkSRn1qqQb-zrB0U",
	authDomain: "audioink-db881.firebaseapp.com",
	projectId: "audioink-db881",
	databaseUrl: "audioink-db881.appspot.com",
	storageBucket: "audioink-db881.appspot.com",
	messagingSenderId: "230041263323",
	appId: "1:230041263323:web:3e8cf7ab561b53eaea40fe",
	measurementId: "G-8BPW4KY9J4",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // Export the auth object
const rtdb = getDatabase(app); // Export the db object
const storage = getStorage(app); // Export the storage object

export { app, auth, rtdb, storage };
