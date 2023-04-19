import React, { useRef, useState } from "react";
import styled from "styled-components";
import Waveform from "../components/Waveform";
import Timecodes from "../components/Timecodes";

const MixPage = ({ title, artist }) => {
	title = "Texas Talaash";
	artist = "DJ Bunny";

	const timecodes = [
		{
			label: "Beginning",
			start: 0,
			stop: null,
		},
		{
			label: "Whatamma",
			start: 0,
			stop: 12,
		},
		{
			label: "HipHop",
			start: 62,
			stop: 80,
		},
	];

	const wavesurferRef = useRef();

	const [currRegion, setCurrRegion] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const onTimecodeClick = (timecode) => {
		wavesurferRef.current.seekTo(
			timecode.start / wavesurferRef.current.getDuration()
		);
		if (!wavesurferRef.current.isPlaying()) {
			wavesurferRef.current.play();
			setIsPlaying(true);
		}
		if (currRegion != null) {
			currRegion.remove();
			setCurrRegion(null);
		}

		if (timecode.stop != null) {
			const newRegion = wavesurferRef.current.addRegion({
				start: timecode.start,
				end: timecode.stop,
				color: "rgba(255, 0, 0, 0.3)",
				drag: false,
				resize: false,
				loop: true,
			});
			setCurrRegion(newRegion);
		} else {
			wavesurferRef.current.seekTo(
				timecode.start / wavesurferRef.current.getDuration()
			);
		}
	};
	return (
		<Container>
			<Header>
				<Title>{title}</Title>
				<ArtistSubtitle>{artist}</ArtistSubtitle>
			</Header>
			<Waveform
				timecodes={timecodes}
				wavesurferRef={wavesurferRef}
				isPlaying={isPlaying}
				setIsPlaying={setIsPlaying}
			/>
			<Timecodes timecodes={timecodes} onTimecodeClick={onTimecodeClick} />
			<AddButton>+</AddButton>
		</Container>
	);
};

const AddButton = styled.button`
	position: absolute;
	bottom: -30px;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 50px;
	font-weight: bold;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	border: none;
	background-color: #758a8d;
	cursor: pointer;
	transition: transform 0.1s ease-in;
	&:hover {
		transform: translate(-50%, -50%) scale(1.05);
	}
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 100px;
`;

const Title = styled.div`
	display: flex;
	flex-direction: column;
	color: white;
	font-weight: 600;
`;

const ArtistSubtitle = styled.div`
	color: #ababab;
	font-size: 13px;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

export default MixPage;
