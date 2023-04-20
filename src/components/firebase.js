import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBrzBj4GWgtdTTeoztU4ujjSXO8qQqKSGg",
	authDomain: "hci-final-deb49.firebaseapp.com",
	projectId: "hci-final-deb49",
	databaseUrl: "https://hci-final-deb49-default-rtdb.firebaseio.com",
	storageBucket: "hci-final-deb49.appspot.com",
	messagingSenderId: "9675116311",
	appId: "1:9675116311:web:39e1d78f9ce44c53287152",
	measurementId: "G-NJTC8VW04N",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // Export the auth object
const rtdb = getDatabase(app); // Export the db object
const storage = getStorage(app); // Export the storage object

export { app, auth, rtdb, storage };
