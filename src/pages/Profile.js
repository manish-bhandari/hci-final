import React from "react";
import { auth } from "../components/firebase"; // Add this import

function Profile({ name }) {
	// Function to handle logout
	const handleLogout = () => {
		auth
			.signOut()
			.then(() => {
				console.log("User signed out.");
				// You can navigate to the login page or another page after successful logout if needed
			})
			.catch((error) => {
				console.error("Error signing out:", error);
			});
	};
	return (
		<div>
			<h1>Profile</h1>
			<p>{name}</p>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default Profile;
