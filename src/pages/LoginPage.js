import React, { useState } from "react";
import { auth } from "../components/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<label>
					Email:
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>
				<br />
				<label>
					Password:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<br />
				<button type="submit">Log in</button>
			</form>
		</div>
	);
}

export default LoginPage;
