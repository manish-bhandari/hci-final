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
	setIsWaveformReady,
	isWaveformReady,
	mode,
	currentTime,
	activeMarkerType,
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

	const handleWSMount = useCallback((waveSurfer) => {
		wavesurferRef.current = waveSurfer;

		if (wavesurferRef.current) {
			wavesurferRef.current.load(audioFileUrl);
			wavesurferRef.current.on("ready", () => {
				console.log("WaveSurfer is ready");
				setIsWaveformReady(true);
				wavesurferRef.current.play();
				// Calculate the zoom value based on the screen width and the duration of the audio file
				const screenWidth = window.innerWidth;
				const duration = wavesurferRef.current.getDuration();
				const zoomValue = screenWidth / duration;

				wavesurferRef.current.zoom(zoomValue);
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

	useEffect(() => {
		if (activeMarkerType == "range") {
		}
	}, [activeMarkerType]);

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
						cursorColor="#13BB9D "
						waveColor="#999"
						progressColor="#4AEAEA"
						barWidth={3}
						barGap={1}
						height={60}
					/>
					{isWaveformReady &&
						mode === "play" &&
						timecodes.map((timecode, index) => {
							const duration = wavesurferRef.current.getDuration();
							const containerWidth = containerRef.current.offsetWidth;
							const startPos = containerWidth * (timecode.start / duration);
							const stopPos = containerWidth * (timecode.stop / duration);

							return (
								<Marker
									wavesurfer={wavesurferRef.current}
									startPos={startPos}
									stopPos={stopPos}
									key={index}
									color={timecode.color}
								/>
							);
						})}
				</WaveSurfer>
			</div>
			{isWaveformReady && <CurrentTime>{currentTime}</CurrentTime>}
			{isWaveformReady && (
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
			)}
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
	cursor: pointer;
`;

const CurrentTime = styled.div`
	color: white;
	text-align: center;
	margin: 20px;
	color: #71ffd4;
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
	cursor: pointer;
`;

const AudioControls = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 10px;
	margin: 30px 0;
`;
