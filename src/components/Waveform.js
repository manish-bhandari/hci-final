import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { WaveSurfer, WaveForm } from "wavesurfer-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlay,
	faPause,
	faRedoAlt,
	faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";

import styled from "styled-components";
import Marker from "./Marker";

import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";

function Waveform({
	timecodes,
	wavesurferRef,
	isPlaying,
	setIsPlaying,
	audioFileUrl,
	imageUrl,
}) {
	const plugins = useMemo(() => {
		return [
			{
				plugin: RegionsPlugin,
				options: { dragSelection: false },
			},
		];
	}, []);

	const containerRef = useRef();

	const [wavesurferReady, setWavesurferReady] = useState(false);

	const handleWSMount = useCallback((waveSurfer) => {
		wavesurferRef.current = waveSurfer;

		if (wavesurferRef.current) {
			wavesurferRef.current.load(audioFileUrl);

			wavesurferRef.current.on("ready", () => {
				console.log("WaveSurfer is ready");
				setWavesurferReady(true);

				// Calculate the zoom value based on the screen width and the duration of the audio file
				const screenWidth = window.innerWidth;
				const duration = wavesurferRef.current.getDuration();
				const zoomValue = screenWidth / duration;

				wavesurferRef.current.zoom(zoomValue);

				// wavesurferRef.current.seekTo(62 / wavesurferRef.current.getDuration());
			});

			wavesurferRef.current.on("audioprocess", () => {
				const scrollLeft = wavesurferRef.current.drawer.getScrollX();
				containerRef.current.scrollLeft = scrollLeft;
			});
		}
	}, []);

	const playPause = useCallback(() => {
		wavesurferRef.current.playPause();
		setIsPlaying(!isPlaying);
	}, [isPlaying]);

	const skipForward = useCallback(() => {
		wavesurferRef.current.skipForward(10);
	}, []);

	const skipBackward = useCallback(() => {
		wavesurferRef.current.skipBackward(10);
	}, []);

	useEffect(() => {}, [timecodes]);

	return (
		<WaveformWrapper>
			<div
				ref={containerRef}
				style={{
					overflow: "auto",
					width: "100%",
				}}
			>
				<WaveSurfer onMount={handleWSMount} plugins={plugins}>
					<WaveForm
						id="waveform"
						cursorColor="transparent"
						waveColor="#999"
						progressColor="#555"
						barWidth={3}
						barGap={1}
						height={60}
					/>
					{wavesurferReady &&
						timecodes.map((timecode, index) => {
							const duration = wavesurferRef.current.getDuration();
							const containerWidth = containerRef.current.offsetWidth;
							console.log("containerWidth", containerWidth);
							const currTimePercentage = timecode.start / duration;
							const position = containerWidth * currTimePercentage;
							return (
								<Marker
									wavesurfer={wavesurferRef.current}
									time={position}
									key={index}
								/>
							);
						})}
				</WaveSurfer>
			</div>

			<AudioControls>
				<TimeSkipButton onClick={skipBackward}>
					<FontAwesomeIcon icon={faUndoAlt} />
				</TimeSkipButton>
				<PlayPauseButton onClick={playPause}>
					<FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
				</PlayPauseButton>
				<TimeSkipButton onClick={skipForward}>
					<FontAwesomeIcon icon={faRedoAlt} />
				</TimeSkipButton>
			</AudioControls>
		</WaveformWrapper>
	);
}

export default Waveform;

const PlayPauseButton = styled.button`
	background-color: #e9e9e9;
	border: none;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	font-size: 30px;
	text-align: center;
	color: rgb(21, 37, 49);
	line-height: 50px; // Added line-height property
`;

const WaveformWrapper = styled.div`
	margin-top: 50px;
`;

const TimeSkipButton = styled.button`
	background-color: transparent;
	border: none;
	border-radius: 50%;
	font-size: 30px;
	color: #e9e9e9;
`;

const AudioControls = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 10px;
	margin: 50px 0;
`;
