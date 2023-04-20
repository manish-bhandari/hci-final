import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getDatabase, ref, update } from "firebase/database";
import { app } from "./firebase";

const Timecodes = ({
	timecodes,
	onTimecodeClick,
	selectedLabel,
	userId,
	mixId,
}) => {
	function secondsToTimeFormat(seconds) {
		if (seconds == null) return "-";
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);

		const paddedMinutes = String(minutes).padStart(2, "0");
		const paddedSeconds = String(remainingSeconds).padStart(2, "0");

		return `${paddedMinutes}:${paddedSeconds}`;
	}

	const [markers, setMarkers] = useState([...timecodes]);

	const deleteTimecode = async (index) => {
		const updatedMarkers = markers.filter((_, i) => i !== index);
		setMarkers(updatedMarkers);

		// Update the markers array in Firebase
		const db = getDatabase(app);
		const mixRef = ref(db, `mixes/${userId}/${mixId}/markers`);
		await update(mixRef, { [index]: null });
	};

	return (
		<Table>
			<Row>
				<HeadElement></HeadElement>
				<HeadElement style={{ textAlign: "left" }}>Label</HeadElement>
				<HeadElement>Start</HeadElement>
				<HeadElement>Stop</HeadElement>
			</Row>
			<TBody>
				{markers.map((timecode, index) => (
					<Row
						className={
							timecode.stop != null && selectedLabel === index ? "active" : ""
						}
						key={index}
						onClick={() => onTimecodeClick(index, timecode)} // Add onClick event here
					>
						<Color color={timecode.color}></Color>
						<p style={{ textAlign: "left" }}>{timecode.label}</p>
						<p>{secondsToTimeFormat(timecode.start)}</p>
						<p>{secondsToTimeFormat(timecode.stop)}</p>
						<DeleteButton
							onClick={(e) => {
								e.stopPropagation();
								deleteTimecode(index);
							}}
						>
							<FontAwesomeIcon icon={faTrash} />
						</DeleteButton>
					</Row>
				))}
			</TBody>
		</Table>
	);
};

export default Timecodes;

const DeleteButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	color: #a1a1a1;
	font-size: 10px;

	&:hover {
		color: #ff8080;
		cursor: pointer;
	}
`;

const THead = styled.thead`
	color: #a1a1a1;
	font-weight: 300;
`;

const Color = styled.div`
	background-color: ${(props) => props.color};
	border-radius: 50%;
	width: 10px;
	height: 10px;
	margin: 0 auto;
`;

const Table = styled.div`
	height: 35vh;
	margin: 20px;
`;

const TBody = styled.div`
	background-color: rgba(0, 0, 0, 0.3);
	height: 100%;
	overflow-y: scroll;
`;

const HeadElement = styled.div`
	color: #a1a1a1;
	font-weight: 500;
`;

const Row = styled.div`
	display: grid;
	grid-template-columns: 10% 45% 20% 20% 5%; // Add an extra column for the delete button
	grid-template-rows: 1fr;
	color: #e9e9e9;
	font-weight: 400;
	padding: 5px 0;
	align-items: center;
	p {
		margin: 0;
	}
	&:hover {
		background-color: rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
	&.active {
		background-color: #153935;
	}
`;
