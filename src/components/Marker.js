import React from "react";
import styled from "styled-components";

const Marker = ({ type, color, time, wavesurfer }) => {
	if (type === "range-start") {
		return <RangeStart position={time}></RangeStart>;
	} else if (type === "range-end") {
		return <RangeEnd position={time}></RangeEnd>;
	} else {
		return <Circle position={time}></Circle>;
	}
};

const Circle = styled.div`
	position: absolute;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	transform: translate(-50%);
	background-color: red;
	z-index: 2;
	left: ${(props) => props.position}px;
`;

const RangeStart = styled.div`
	position: absolute;
	width: 10px;
	height: 10px;
	transform: translate(-50%, -50%);
	transform: translateY(5px);
	background-color: red;
	z-index: 2;
	left: ${(props) => props.position}px;
	color: ${(props) => props.color};
`;

const RangeEnd = styled.div`
	position: absolute;
	width: 10px;
	height: 10px;
	transform: translate(-50%, -50%);
	transform: translateY(5px);
	background-color: red;
	z-index: 2;
	left: ${(props) => props.position}px;
	color: ${(props) => props.color};
`;

export default Marker;
