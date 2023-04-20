import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { app, rtdb } from "../components/firebase";
import { getDatabase, ref, remove } from "firebase/database";
import { getStorage, deleteObject, ref as storageRef } from "firebase/storage";

function Mix({ data }) {
	console.log("data", data);
	const markers = data.markers ? data.markers : [];

	const handleDelete = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("Delete mix", data.id);

		// Delete mix data from Realtime Database
		const db = getDatabase(app);
		const mixRef = ref(db, `mixes/${data.userId}/${data.id}`);
		await remove(mixRef);

		// Delete mix audio file from Firebase Storage
		const storage = getStorage(app);
		const audioFileRef = storageRef(storage, data.data);
		await deleteObject(audioFileRef);

		// Delete mix image file from Firebase Storage if it exists
		if (data.image) {
			const imageFileRef = storageRef(storage, data.image);
			await deleteObject(imageFileRef);
		}
	};

	return (
		<Link to={`/mix/${data.id}`} style={{ textDecoration: "none" }}>
			<MixContainer>
				<ImageContainer>
					<img src={data.image} alt="mix" />
				</ImageContainer>
				<Content>
					<Header>
						<Name>{data.name}</Name>
						<Artist>{data.artist}</Artist>
					</Header>
					<Markers>
						{markers.map((marker, index) => (
							<Marker key={index}>{marker.label}</Marker>
						))}
					</Markers>
				</Content>
				<DeleteButton onClick={handleDelete}>
					<FontAwesomeIcon icon={faTrash} />
				</DeleteButton>
			</MixContainer>
		</Link>
	);
}
const MixContainer = styled.div`
	display: flex;
	flex-direction: row;
	position: relative;
	width: 100%;
	background-color: #1a1e20;
	color: white;
	border-radius: 7px;
	border: 1px solid rgba(255, 255, 255, 0.4);
	cursor: pointer;
	&:hover {
		border: 1px solid rgba(100, 215, 205, 0.8);
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	width: 100%;
	margin: 5px 10px;
`;

const Markers = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 5px;
	margin-top: 5px;
`;

const Marker = styled.div`
	font-size: 12px;
	background-color: #3b3c46;
	padding: 2px 5px;
	border-radius: 5px;
`;

const Header = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const Name = styled.div`
	font-weight: 500;
`;
const Artist = styled.div`
	font-weight: 300;
	font-size: 12px;
	color: #baaeae;
`;

const ImageContainer = styled.div`
	overflow: "hidden";
	width: 100px;
	height: 100px;
	border-top-left-radius: 7px;
	border-bottom-left-radius: 7px;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-top-left-radius: 7px;
		border-bottom-left-radius: 7px;
	}
`;

const DeleteButton = styled.button`
	position: absolute;
	bottom: 10px;
	right: 10px;
	font-size: 16px;
	background-color: transparent;
	border: none;
	color: #baaeae;
	cursor: pointer;

	&:hover {
		color: red;
	}
`;

export default Mix;
