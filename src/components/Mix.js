import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

function Mix({ data }) {
	return (
		<Link to={`/mix/${data.id}`}>
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
						{["hiphop", "whatamma"].map((marker, index) => (
							<Marker key={index}>{marker}</Marker>
						))}
					</Markers>
				</Content>
			</MixContainer>
		</Link>
	);
}

const MixContainer = styled.div`
	display: flex;
	flex-direction: row;
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
	border-top-left-radius: 7;
	border-bottom-left-radius: 7;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 7px;
	}
`;

export default Mix;
