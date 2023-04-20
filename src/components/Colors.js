import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Colors = ({ setActiveColor, setActiveIndex, activeIndex }) => {
	const colors = ["#DF5E5E", "#5EA1DF", "#5EDFC8", "#F2DE2B", "#875EDF"];

	const handleClick = (index) => {
		setActiveIndex(index);
		setActiveColor(colors[index]);
	};

	return (
		<ColorsWrapper>
			{colors.map((color, index) => {
				return (
					<Color
						className={activeIndex === index ? "active" : ""}
						key={index}
						color={color}
						onClick={() => handleClick(index)}
					></Color>
				);
			})}
		</ColorsWrapper>
	);
};

export default Colors;

const Color = styled.div`
	border-radius: 50%;
	background-color: ${(props) => props.color};
	width: 20px;
	height: 20px;
	cursor: pointer;
	&.active {
		border: 1px solid white;
	}
`;

const ColorsWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-gap: 10px;
	border: 1px solid #565656;
	padding: 10px;
	margin: 20px;
`;
