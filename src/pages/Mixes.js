import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

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
	const [selectedFile, setSelectedFile] = useState(null);
	const [mixes, setMixes] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	useEffect(() => {
		const savedMixes = JSON.parse(localStorage.getItem("mixes"));
		if (savedMixes) {
			setMixes(savedMixes);
		}
	}, []);

	const fileChangedHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	const uploadHandler = async () => {
		if (!selectedFile) return;

		const fileReader = new FileReader();
		fileReader.onloadend = () => {
			const newMix = {
				id: Date.now(),
				name: selectedFile.name,
				// data: fileReader.result,
			};

			const updatedMixes = [...mixes, newMix];
			setMixes(updatedMixes);
			localStorage.setItem("mixes", JSON.stringify(updatedMixes));
		};
		fileReader.readAsDataURL(selectedFile);
		closeModal();
	};

	return (
		<Container>
			<MainContent>
				<Logo src="/assets/Logo.png" />
				<Title>Mixes</Title>

				<MixesContainer>
					{mixes.length === 0 ? (
						<p>No mixes :(</p>
					) : (
						mixes.map((mix) => <h1>{mix.name}</h1>)
					)}
				</MixesContainer>
			</MainContent>

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Upload Modal"
			>
				<p>{selectedFile && selectedFile.name}</p>
				<input type="text" placeholder="Name" />
				<br />
				<br />
				<button onClick={uploadHandler}>Upload</button>
				<button onClick={closeModal}>Cancel</button>
			</Modal>
			<AddButton>
				<input
					type="file"
					accept=".mp3"
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

const Logo = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 50px;
	padding: 30px;
`;

const MixesContainer = styled.div`
	display: flex;
	flex-direction: column;
	color: #ababab;
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
	margin-top: 100px;
`;

const Title = styled.div`
	color: grey;
	background-color: #3b3c46;
	padding: 5px 20px;
	font-size: 25px;
`;
