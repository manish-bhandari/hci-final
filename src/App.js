import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import "./App.css";
import Mixes from "./pages/Mixes";
import MixPage from "./pages/MixPage";
import LoginPage from "./pages/LoginPage";
import React, { useEffect, useState } from "react";
import { auth } from "./components/firebase";
import Profile from "./pages/Profile";

function App() {
	const [user, setUser] = useState(null);
	const [findingUser, setFindingUser] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// User is logged in
				console.log("user is logged in");
				setUser(authUser);
			} else {
				// User is logged out
				console.log("user is logged out");
				setUser(null);
			}
			setFindingUser(false);
		});

		// Clean up the subscription on unmount
		return unsubscribe;
	}, []);

	if (findingUser) {
		return;
	}
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<React.Fragment>
								{user ? <Mixes /> : <Navigate to="/login" />}
							</React.Fragment>
						}
					/>
					<Route
						path="/login"
						element={user ? <Navigate to="/" /> : <LoginPage />}
					/>
					<Route
						path="/mix/:id"
						element={user ? <MixPage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/profile"
						element={user ? <Profile /> : <Navigate to="/login" />}
					/>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
