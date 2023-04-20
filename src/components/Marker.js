import React from "react";
import styled from "styled-components";
import { ReactComponent as RangeStartSVG } from "../assets/range-start.svg";
import { ReactComponent as RangeStopSVG } from "../assets/range-stop.svg";

const Marker = ({ type, color, startPos, stopPos, wavesurfer }) => {
	console.log("startPos", startPos);
	console.log("stopPos", stopPos);
	if (stopPos) {
		return (
			<Range>
				<RangeLabel position={startPos} color={color}>
					<RangeStartSVG />
				</RangeLabel>
				<RangeLabel position={stopPos} color={color}>
					<RangeStopSVG />
				</RangeLabel>
			</Range>
		);
	} else {
		return <Circle position={startPos} color={color}></Circle>;
	}
};

const Circle = styled.div`
	position: absolute;
	width: 7px;
	height: 7px;
	border-radius: 50%;
	transform: translate(-50%);
	background-color: ${(props) => props.color};
	z-index: 2;
	left: ${(props) => props.position}px;
`;

const Range = styled.div`
	position: absolute;
`;

const RangeLabel = styled.div`
	position: absolute;
	transform: translate(-50%, -30%);
	left: ${(props) => props.position}px;
	svg {
		fill: ${(props) => props.color};
	}
`;

export default Marker;
