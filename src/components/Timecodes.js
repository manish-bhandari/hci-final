import React from "react";
import styled from "styled-components";

const Timecodes = ({ timecodes, onTimecodeClick }) => {
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
						<p>{index + 1}</p>
						<p>{timecode.label}</p>
						<p>{timecode.start}</p>
						<p>{timecode.stop}</p>
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

	p {
		margin: 0;
	}
	&:hover {
		background-color: rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
`;
