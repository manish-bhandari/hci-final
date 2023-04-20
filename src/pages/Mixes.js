import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import Mix from "../components/Mix";
import { getDatabase, ref, onValue, set, child, push } from "firebase/database";
import { app, auth, rtdb } from "../components/firebase";
import {
	getDownloadURL,
	getStorage,
	uploadBytes,
	ref as storageRef,
} from "firebase/storage";
import { PulseLoader } from "react-spinners";

Modal.setAppElement("#root");

// Custom styles for the modal
const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		width: "50vw",
		transform: "translate(-50%, -50%)",
		// padding: "30px",
		// borderRadius: "5px",
		boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
		backgroundColor: "#3b3c46",
		border: "none",
		color: "white",
	},
	overlay: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
};

const Mixes = () => {
	const [user] = useAuthState(auth);

	const [mixes, setMixes] = useState([]);

	const navigate = useNavigate();

	const [selectedAudioFile, setSelectedAudioFile] = useState(null);
	const [selectedImageFile, setSelectedImageFile] = useState(null);

	const [newMixName, setNewMixName] = useState("");
	const [artistName, setArtistName] = useState("");

	const [modalIsOpen, setModalIsOpen] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!user) return;
		const db = getDatabase(app);
		const userMixesRef = ref(db, `mixes/${user.uid}`);
		const unsubscribe = onValue(userMixesRef, (snapshot) => {
			const fetchedMixes = [];
			snapshot.forEach((childSnapshot) => {
				fetchedMixes.push({
					id: childSnapshot.key,
					...childSnapshot.val(),
				});
			});
			setMixes(fetchedMixes);
			setIsLoading(false);
		});
		return () => {
			unsubscribe();
		};
	}, [user]);

	const fileChangedHandler = (event) => {
		setSelectedAudioFile(event.target.files[0]);
		setModalIsOpen(true);
	};

	const imageChangedHandler = (event) => {
		setSelectedImageFile(event.target.files[0]);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};
	const uploadHandler = async () => {
		if (!selectedAudioFile || !selectedImageFile) return;

		const mixId = Date.now();
		const storage = getStorage(app);

		// Upload MP3 file
		const musicRef = storageRef(
			storage,
			`mixes/${mixId}/${selectedAudioFile.name}`
		);
		await uploadBytes(musicRef, selectedAudioFile);

		let imageRef;
		if (selectedImageFile !== null) {
			// Upload image
			imageRef = storageRef(
				storage,
				`mixes/${mixId}/${selectedImageFile.name}`
			);
			await uploadBytes(imageRef, selectedImageFile);
		}

		// Get download URLs for both files
		const musicURL = await getDownloadURL(musicRef);
		const imageURL =
			selectedImageFile == null ? null : await getDownloadURL(imageRef);

		// Save mix metadata to Realtime Database
		const newMix = {
			id: mixId,
			name: newMixName,
			artist: artistName,
			data: musicURL,
			image: imageURL,
			markers: [],
			userId: user.uid,
		};
		console.log("new mix created", newMix);

		const mixRef = ref(rtdb, `mixes/${user.uid}/${mixId}`);
		await set(mixRef, newMix);

		const updatedMixes = [...mixes, newMix];
		setMixes(updatedMixes);
		closeModal();
	};

	const handleProfileClick = () => {
		navigate("/profile");
	};

	if (isLoading) {
		return (
			<Loader>
				<PulseLoader color="#5D7C86" loading={true} size={15} />
			</Loader>
		);
	}

	return (
		<Container>
			<MainContent>
				<Logo src="/assets/Logo.png" />
				<Title>Mixes</Title>
				<ProfileButton onClick={handleProfileClick}>
					<FontAwesomeIcon icon={faUser} />
				</ProfileButton>
				<MixesContainer>
					{mixes.length === 0 ? (
						<p>No mixes :(</p>
					) : (
						mixes.map((mix, index) => <Mix data={mix} key={index} />)
					)}
				</MixesContainer>
			</MainContent>

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Upload Modal"
			>
				<p>{selectedAudioFile && selectedAudioFile.name}</p>
				<input
					className="mix-name"
					type="text"
					placeholder="Name"
					onChange={(e) => setNewMixName(e.target.value)}
				/>
				<input
					className="artist"
					type="text"
					placeholder="Artist"
					onChange={(e) => setArtistName(e.target.value)}
				/>

				<input
					type="file"
					accept="image/*"
					id="imageUploader"
					onChange={imageChangedHandler}
				/>

				<br />
				<br />
				<button onClick={uploadHandler}>Upload</button>
				<button onClick={closeModal}>Cancel</button>
			</Modal>
			<AddButton>
				<input
					type="file"
					accept=".mp3, .wav"
					id="fileUploader"
					onChange={fileChangedHandler}
					style={{ display: "none" }}
				/>
				<label htmlFor="fileUploader" className="upload-button">
					+
				</label>
			</AddButton>
		</Container>
	);
};

export default Mixes;

const AddButton = styled.button`
	position: absolute;
	bottom: 0;
	right: 0;
	font-size: 50px;
	font-weight: bold;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	border: none;
	margin: 50px;
	background-color: #758a8d;
	cursor: pointer;
`;

const ProfileButton = styled.button`
	position: absolute;
	top: 0;
	right: 0;
	font-size: 16px;
	padding: 8px; // Update padding
	margin: 30px;
	background-color: #758a8d;
	color: white;
	border: none;
	cursor: pointer;
	border-radius: 50%; // Add this line for a circular shape
	text-transform: uppercase;
	font-weight: bold;
	width: 40px; // Add this line for a fixed width
	height: 40px; // Add this line for a fixed height
	display: flex; // Add this line to center the icon
	justify-content: center; // Add this line to center the icon
	align-items: center; // Add this line to center the icon
`;

const Logo = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 40px;
	padding: 30px;
`;

const MixesContainer = styled.div`
	display: flex;
	flex-direction: column;
	color: #ababab;
	gap: 10px;
	width: 80vw;
`;

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
`;

const MainContent = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 120px;
	align-items: center;
`;

const Title = styled.div`
	color: grey;
	background-color: #3b3c46;
	padding: 5px 60px;
	font-size: 25px;
	width: fit-content;
	margin-bottom: 20px;
`;

const Loader = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;
