import React from "react";
import styled from "styled-components";

const Timecodes = ({ timecodes, onTimecodeClick }) => {
	function secondsToTimeFormat(seconds) {
		if (seconds == null) return "-";
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);

		const paddedMinutes = String(minutes).padStart(2, "0");
		const paddedSeconds = String(remainingSeconds).padStart(2, "0");

		return `${paddedMinutes}:${paddedSeconds}`;
	}
	return (
		<Table>
			<Row>
				<HeadElement></HeadElement>
				<HeadElement>Label</HeadElement>
				<HeadElement>Start</HeadElement>
				<HeadElement>Stop</HeadElement>
			</Row>
			<TBody>
				{timecodes.map((timecode, index) => (
					<Row
						key={index}
						onClick={() => onTimecodeClick(timecode)} // Add onClick event here
					>
						<Color color={timecode.color}></Color>
						<p>{timecode.label}</p>
						<p>{secondsToTimeFormat(timecode.start)}</p>
						<p>{secondsToTimeFormat(timecode.stop)}</p>
					</Row>
				))}
			</TBody>
		</Table>
	);
};

export default Timecodes;

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
	grid-template-columns: 10% 50% 20% 20%;
	grid-template-rows: 1fr;
	color: #fff;
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
`;
