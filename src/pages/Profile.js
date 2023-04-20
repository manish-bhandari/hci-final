import React from "react";
import { auth } from "../components/firebase"; // Add this import
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";

function Profile({ name }) {
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

	const [user] = useAuthState(auth);

	return (
		<Container>
			<Title>Profile</Title>
			<Email>{user.email}</Email>
			<p>{name}</p>
			<button onClick={handleLogout}>Logout</button>
		</Container>
	);
}

const Email = styled.div`
	display: flex;
	font-size: 1.2rem;
	font-weight: 300;
	color: white;
`;

const Container = styled.h2`
	display: flex;
	flex-direction: column;
	align-items: center;
	button {
		background-color: #f56d76;
		border: none;
		color: white;
		padding: 5px 10px;
		cursor: pointer;

		&:hover {
			opacity: 0.8;
		}
	}
`;

const Title = styled.h2`
	font-size: 1.5rem;
	font-weight: 400;
	margin-bottom: 1rem;
	color: #fff;
	background-color: #787774;
	width: fit-content;
	padding: 5px 15px;
`;

export default Profile;
