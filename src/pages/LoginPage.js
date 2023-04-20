import React, { useState } from "react";
import { auth } from "../components/firebase";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import styled from "styled-components";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isRegistering, setIsRegistering] = useState(false);

	const handleLogin = (e) => {
		e.preventDefault();
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Logged in successfully
				const user = userCredential.user;
				console.log(user);
			})
			.catch((error) => {
				// Handle errors here
				console.error(error);
			});
	};

	const handleRegister = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Registered successfully
				const user = userCredential.user;
				console.log(user);
			})
			.catch((error) => {
				// Handle errors here
				console.error(error);
			});
	};

	const handleSubmit = (e) => {
		if (isRegistering) {
			handleRegister(e);
		} else {
			handleLogin(e);
		}
	};

	return (
		<Container>
			<Title>{isRegistering ? "Register" : "Login"}</Title>
			<Logo src="/assets/Logo.png" />
			<form onSubmit={handleSubmit}>
				<div>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
					/>
				</div>
				<div>
					<input
						type="password"
						value={password}
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{isRegistering && (
					<div>
						<input
							type="password"
							value={confirmPassword}
							placeholder="Confirm Password"
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
				)}
				<button type="submit">{isRegistering ? "Register" : "Log in"}</button>
				<div>
					<p>
						{isRegistering
							? "Already have an account?"
							: "Don't have an account?"}
					</p>
					<button
						type="button"
						onClick={() => setIsRegistering(!isRegistering)}
					>
						{isRegistering ? "Log in" : "Register"}
					</button>
				</div>
			</form>
		</Container>
	);
}

const Logo = styled.img`
	position: absolute;
	top: 50px;
	left: 50%;
	width: 40px;
	padding: 30px;
	transform: translateX(-50%);
`;
const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 80vh;

	form {
		color: white;
		gap: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		label {
			margin: 5px;
		}
		input {
			background-color: #c5c9c8;
			border: none;
			color: #000;
			padding: 5px;
		}
	}

	button {
		margin: 20px;
		background-color: #758a8d;
		color: black;
		border: none;
		color: white;
		padding: 5px 10px;
		width: 100px;
		border-radius: 5px;
		cursor: pointer;
	}

	p {
		color: white;
		margin: 5px;
	}

	div > button {
		background-color: #378891;
		border: none;
		color: #ffff;
		padding: 5px 10px;
		border-radius: 5px;
		cursor: pointer;
	}
`;

const Title = styled.div`
	display: flex;
	font-size: 1.5rem;
	color: #fff;
	margin-bottom: 1rem;
`;
export default LoginPage;
