import React from "react";
import { auth } from "../components/firebase"; // Add this import
import styled from "styled-components";

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
			<Title>Profile</Title>
			<p>{name}</p>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

const Title = styled.h2`
	font-size: 1.5rem;
	font-weight: 400;
	margin-bottom: 1rem;
	color: #fff;
`;

export default Profile;
