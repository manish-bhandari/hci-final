import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Waveform from "../components/Waveform";
import Timecodes from "../components/Timecodes";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../components/firebase";
import Colors from "../components/Colors";
import { PulseLoader } from "react-spinners";

function formatTime(seconds) {
	const minutes = Math.floor((seconds % 3600) / 60);
	const secondsLeft = Math.floor(seconds % 60);
	const minutesString = minutes.toString().padStart(2, "0");
	const secondsString = secondsLeft.toString().padStart(2, "0");
	return `${minutesString}:${secondsString}`;
}

const MixPage = ({ title, artist }) => {
	const { id } = useParams(); // get the "id" parameter from the URL
	const database = getDatabase();
	const [user] = useAuthState(auth);

	const [mode, setMode] = useState("play");

	const [mixData, setMixData] = useState(null);

	const [audioFileUrl, setAudioFileUrl] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

	const [activeMarkerType, setActiveMarkerType] = useState("point");
	const [activeColor, setActiveColor] = useState("#DF5E5E");
	const [activeIndex, setActiveIndex] = useState(0);

	const [label, setLabel] = useState("");
	const [startTimecode, setStartTimecode] = useState("");
	const [stopTimecode, setStopTimecode] = useState("");
	const [currentTime, setCurrentTime] = useState("00:00");

	useEffect(() => {
		const fetchMix = async () => {
			console.log("fetching mix");
			const mixRef = ref(database, `mixes/${user.uid}/${id}`);
			get(mixRef)
				.then((snapshot) => {
					if (snapshot.exists()) {
						const data = snapshot.val();
						setMixData(data);
						setAudioFileUrl(data.data);
						setImageUrl(data.image);
					} else {
						console.log("No data available");
					}
				})
				.catch((error) => {
					console.error(error);
				});
		};

		fetchMix();
		console.log("fetched mix");
	}, []);

	useEffect(() => {
		console.log(currentTime);
	}, [currentTime]);

	useEffect(() => {
		console.log(mixData);
	}, [mixData]);

	const wavesurferRef = useRef();

	const [currRegion, setCurrRegion] = useState(null);
	const [isPlaying, setIsPlaying] = useState(true);

	const [isWaveformReady, setIsWaveformReady] = useState(false);
	const [selectedLabel, setSelectedLabel] = useState(null);

	function hexToRGBA(hex) {
		const validHex = hex.replace("#", "");
		const rgb = {
			r: parseInt(validHex.slice(0, 2), 16),
			g: parseInt(validHex.slice(2, 4), 16),
			b: parseInt(validHex.slice(4, 6), 16),
		};

		return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
	}

	const onTimecodeClick = (index, timecode) => {
		if (index === selectedLabel && timecode.stop != null) {
			setSelectedLabel(null);
			currRegion.remove();
			setCurrRegion(null);
			return;
		} else {
			setSelectedLabel(index);
		}

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
				color: hexToRGBA(timecode.color),
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

	function timeStringToSeconds(timeString) {
		const [minutes, seconds] = timeString.split(":");
		return parseInt(minutes) * 60 + parseInt(seconds);
	}

	const saveMarker = async () => {
		const newMarker = {
			label,
			start: timeStringToSeconds(startTimecode),
			stop:
				activeMarkerType === "range" ? timeStringToSeconds(stopTimecode) : null,
			color: activeColor,
		};

		const mixRef = ref(database, `mixes/${user.uid}/${id}`);
		await update(mixRef, {
			markers: [...(mixData.markers || []), newMarker],
		});

		// Update local state
		setMixData((prevState) => ({
			...prevState,
			markers: [...(prevState.markers || []), newMarker],
		}));

		// Reset form fields
		setLabel("");
		setStartTimecode("");
		setStopTimecode("");
	};

	async function createMarkerHandler() {
		await saveMarker();
		setMode("play");
	}

	useEffect(() => {
		console.log("waveform ready", isWaveformReady);
		if (!isWaveformReady) return;
		const intervalId = setInterval(() => {
			setCurrentTime(formatTime(wavesurferRef.current.getCurrentTime()));
		}, 1);
		return () => clearInterval(intervalId);
	}, [isWaveformReady]);

	useEffect(() => {
		if (activeMarkerType === "point") setStartTimecode(currentTime);
	}, [currentTime]);

	useEffect(() => {
		if (!isWaveformReady) return;
		if (activeMarkerType === "point") {
			if (currRegion != null) {
				currRegion.remove();
				setCurrRegion(null);
			}
		}

		const region = wavesurferRef.current.addRegion({
			// id: "edit-region",
			start: wavesurferRef.current.getCurrentTime(),
			end: wavesurferRef.current.getCurrentTime() + 10,
			color: hexToRGBA(activeColor),
			drag: true,
			resize: true,
			handleStyle: {
				height: 10,
				fillColor: "red",
				strokeColor: "red",
			},
		});
		setCurrRegion(region);
		setStartTimecode(formatTime(region.start.toFixed(2)));
		setStopTimecode(formatTime(region.end.toFixed(2)));
		region.on("update", () => {
			setStartTimecode(formatTime(region.start.toFixed(2)));
			setStopTimecode(formatTime(region.end.toFixed(2)));
			if (region.start > wavesurferRef.current.getCurrentTime())
				wavesurferRef.current.setCurrentTime(region.start);
		});

		// wavesurferRef.current.on("play", () => {
		// 	const currentTime = wavesurferRef.current.getCurrentTime();
		// 	if (currentTime < region.start || currentTime > region.end) {
		// 		wavesurferRef.current.pause();
		// 		setIsPlaying(false);
		// 	}
		// });
	}, [activeMarkerType]);

	if (mixData === null)
		return (
			<Loader>
				<PulseLoader color="#5D7C86" loading={true} size={15} />
			</Loader>
		);

	return (
		<Container imageUrl={imageUrl}>
			{!isWaveformReady && (
				<Loader>
					<PulseLoader color="#5D7C86" loading={true} size={15} />
				</Loader>
			)}

			<Header isWaveformReady={isWaveformReady}>
				<Title>{mixData.name}</Title>
				<ArtistSubtitle>{mixData.artist}</ArtistSubtitle>
			</Header>
			<Waveform
				timecodes={mixData.markers ? mixData.markers : []}
				wavesurferRef={wavesurferRef}
				isPlaying={isPlaying}
				setIsPlaying={setIsPlaying}
				isWaveformReady={isWaveformReady}
				setIsWaveformReady={setIsWaveformReady}
				audioFileUrl={audioFileUrl}
				mode={mode}
				currentTime={currentTime}
				setCurrentTime={setCurrentTime}
				activeMarkerType={activeMarkerType}
			/>
			<Content ready={isWaveformReady}>
				{mode === "play" && (
					<>
						<Timecodes
							timecodes={mixData.markers ? mixData.markers : []}
							onTimecodeClick={onTimecodeClick}
							selectedLabel={selectedLabel}
							userId={user.uid}
							mixId={id}
						/>
						<AddButton onClick={() => setMode("edit")}>+</AddButton>
					</>
				)}

				{mode === "edit" && (
					<EditContent
						setActiveMarkerType={setActiveMarkerType}
						activeMarkerType={activeMarkerType}
						setActiveColor={setActiveColor}
						activeIndex={activeIndex}
						setActiveIndex={setActiveIndex}
						label={label}
						setLabel={setLabel}
						startTimecode={startTimecode}
						setStartTimecode={setStartTimecode}
						stopTimecode={stopTimecode}
						setStopTimecode={setStopTimecode}
						createMarkerHandler={createMarkerHandler}
						setMode={setMode}
					/>
				)}
			</Content>
		</Container>
	);
};

const EditContent = ({
	setActiveMarkerType,
	activeMarkerType,
	setActiveColor,
	activeIndex,
	setActiveIndex,
	label,
	setLabel,
	startTimecode,
	setStartTimecode,
	stopTimecode,
	setStopTimecode,
	createMarkerHandler,
	setMode,
}) => {
	return (
		<EditContentContainer>
			<MarkerTypeButtonContainer>
				<button
					className={`${activeMarkerType === "point" && "active"}`}
					onClick={() => setActiveMarkerType("point")}
				>
					Point
				</button>
				<button
					className={`${activeMarkerType === "range" && "active"}`}
					onClick={() => setActiveMarkerType("range")}
				>
					Range
				</button>
			</MarkerTypeButtonContainer>
			<Inputs>
				<TextBoxContainer>
					<label>Label:</label>
					<input
						type="text"
						placeholder="Label"
						value={label}
						onChange={(e) => setLabel(e.target.value)}
					/>
				</TextBoxContainer>
				<StartStopContainer>
					<TextBoxContainer>
						<label>Start:</label>
						<input
							type="text"
							className="timecode"
							placeholder="00:00"
							value={startTimecode}
							onChange={(e) => setStartTimecode(e.target.value)}
						/>
					</TextBoxContainer>
					{activeMarkerType === "range" && (
						<TextBoxContainer>
							<label>Stop:</label>
							<input
								className="timecode"
								type="text"
								placeholder="00:00"
								value={stopTimecode}
								onChange={(e) => setStopTimecode(e.target.value)}
							/>
						</TextBoxContainer>
					)}
				</StartStopContainer>
				<Colors
					setActiveColor={setActiveColor}
					activeIndex={activeIndex}
					setActiveIndex={setActiveIndex}
				/>
			</Inputs>
			<Buttons>
				<CreateButton onClick={() => createMarkerHandler()}>
					Create
				</CreateButton>
				<CancelButton onClick={() => setMode("play")}>Cancel</CancelButton>
			</Buttons>
		</EditContentContainer>
	);
};

const Loader = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const Inputs = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 60vw;
`;

const StartStopContainer = styled.div`
	display: flex;
	gap: 10px;
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: row;
	gap: 20px;
`;

const CancelButton = styled.div`
	gap: 10px;
	background-color: #657374;
	padding: 5px 10px;
	border-radius: 5px;
	cursor: pointer;
	color: #eaeaea;
`;

const CreateButton = styled.div`
	gap: 10px;
	background-color: #9ad5d9;
	padding: 5px 10px;
	cursor: pointer;
	border-radius: 5px;
`;

const TextBoxContainer = styled.div`
	display: flex;
	align-items: center;
	margin: 10px;
	label {
		color: white;
		font-size: 18px;
		margin-right: 10px;
		font-weight: 300;
	}
	input {
		background-color: transparent;
		border: solid 1px #747474;
		padding: 5px;
		color: white;
		width: 100%;
	}
	.timecode {
		width: 35px;
	}
`;

const EditContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
`;

const MarkerTypeButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 10px;
	margin-bottom: 20px;
	button {
		border-radius: 5px;
		border: 1px solid #606162;
		font-size: 15px;
		padding: 4px 10px;
		color: white;
		background-color: transparent;
		cursor: pointer;
	}
	.active {
		border: none;
		background-color: rgba(107, 198, 227, 0.37);
	}
`;

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
	opacity: ${({ isWaveformReady }) => (isWaveformReady ? "1" : "0")};
	transition: opacity 0.2s ease-in;
	will-change: opacity;
`;

const Content = styled.div`
	opacity: ${({ ready }) => (ready ? "1" : "0")};
	transition: opacity 0.2s ease-in;
	will-change: opacity;
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
	position: relative;
	height: 100%;
	::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0.2;
		background-image: ${({ imageUrl }) => `url(${imageUrl})`};
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		pointer-events: none;
	}
`;

export default MixPage;
