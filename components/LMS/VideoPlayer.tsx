"use client"
// biome-ignore lint/style/useImportType:
import React, { useState, useRef, useCallback } from 'react';
import screenfull from 'screenfull';

import { ButtonGroup, Button } from "@heroui/button";

import { IoPauseOutline, IoVolumeMediumOutline, IoVolumeMute, IoPlayBackOutline, IoPlayForwardOutline, IoPlayOutline } from "react-icons/io5";
import { GoScreenFull } from "react-icons/go";
import { TbSettings } from "react-icons/tb";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@heroui/dropdown";
import { Slider } from "@heroui/slider";

import { version } from '../../package.json';
import ReactPlayer from 'react-player';
import Duration from './Duration';

const items = [
  { key: "new", label: "New file" },
  { key: "copy", label: "Copy link" },
  { key: "edit", label: "Edit file" },
  { key: "delete", label: "Delete file" },
];

const App = () => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  const initialState = {
    src: undefined,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seeking: false,
    loadedSeconds: 0,
    playedSeconds: 0,
    isVolumeOpened: false
  };

  type PlayerState = Omit<typeof initialState, 'src'> & { src?: string };
  const [state, setState] = useState<PlayerState>(initialState);

  const load = (src?: string) => setState(prev => ({ ...prev, src, played: 0, loaded: 0, pip: false }));

  const handlePlayPause = () => setState(prev => ({ ...prev, playing: !prev.playing }));
  const handleStop = () => setState(prev => ({ ...prev, src: undefined, playing: false }));
  const handleToggleControls = () => setState(prev => ({ ...prev, controls: !prev.controls }));
  const handleToggleLight = () => setState(prev => ({ ...prev, light: !prev.light }));
  const handleToggleLoop = () => setState(prev => ({ ...prev, loop: !prev.loop }));
  const handleVolumeChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = e.target as HTMLInputElement;
    setState(prev => ({ ...prev, volume: parseFloat(inputTarget.value) }));
  };
  const handleToggleMuted = () => setState(prev => ({ ...prev, muted: !prev.muted }));
  const isVolumeOpenedStart = () => setState(prev => ({ ...prev, isVolumeOpened: !prev.isVolumeOpened }));
  const handleSetPlaybackRate = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const buttonTarget = e.target as HTMLButtonElement;
    setState(prev => ({ ...prev, playbackRate: parseFloat(`${buttonTarget.dataset.value}`) }));
  };

  const handleRateChange = () => {
    const player = playerRef.current;
    if (!player) return;
    setState(prev => ({ ...prev, playbackRate: player.playbackRate }));
  };

  const handleTogglePIP = () => setState(prev => ({ ...prev, pip: !prev.pip }));
  const handlePlay = () => setState(prev => ({ ...prev, playing: true }));
  const handleEnterPictureInPicture = () => setState(prev => ({ ...prev, pip: true }));
  const handleLeavePictureInPicture = () => setState(prev => ({ ...prev, pip: false }));
  const handlePause = () => setState(prev => ({ ...prev, playing: false }));

  const handleSeekMouseDown = () => setState(prev => ({ ...prev, seeking: true }));
  const handleSeekChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = e.target as HTMLInputElement;
    setState(prev => ({ ...prev, played: parseFloat(inputTarget.value) }));
  };
  const handleSeekMouseUp = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = e.target as HTMLInputElement;
    setState(prev => ({ ...prev, seeking: false }));
    if (playerRef.current) playerRef.current.currentTime = parseFloat(inputTarget.value) * playerRef.current.duration;
  };

  const handleProgress = () => {
    const player = playerRef.current;
    if (!player || state.seeking || !player.buffered?.length) return;
    setState(prev => ({
      ...prev,
      loadedSeconds: player.buffered.end(player.buffered.length - 1),
      loaded: player.buffered.end(player.buffered.length - 1) / player.duration,
    }));
  };

  // Rewind 10 seconds
  const handleRewind10 = () => {
    const player = playerRef.current;
    if (!player) return;
    const newTime = Math.max(0, player.currentTime - 10); // ensure >= 0
    player.currentTime = newTime;
    setState(prev => ({
      ...prev,
      played: newTime / player.duration,
      playedSeconds: newTime,
    }));
  };

  // Forward 10 seconds
  const handleForward10 = () => {
    const player = playerRef.current;
    if (!player) return;
    const newTime = Math.min(player.duration, player.currentTime + 10); // ensure <= duration
    player.currentTime = newTime;
    setState(prev => ({
      ...prev,
      played: newTime / player.duration,
      playedSeconds: newTime,
    }));
  };


  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player || state.seeking) return;
    if (!player.duration) return;
    setState(prev => ({
      ...prev,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
    }));
  };

  const handleEnded = () => setState(prev => ({ ...prev, playing: prev.loop }));
  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;
    setState(prev => ({ ...prev, duration: player.duration }));
  };

  const handleClickFullscreen = () => {
    const reactPlayer = document.querySelector('.react-player');
    if (reactPlayer) screenfull.request(reactPlayer);
  };

  const renderLoadButton = (src: string, label: string) => (
    <button type="button" onClick={() => load(src)}>{label}</button>
  );

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  const handleLoadCustomUrl = () => {
    if (urlInputRef.current?.value) {
      setState(prev => ({ ...prev, src: urlInputRef.current.value }));
    }
  };

  const {
    src,
    playing,
    controls,
    light,
    volume,
    muted,
    loop,
    played,
    loaded,
    duration,
    playbackRate,
    pip,
  } = state;

  return (
    <div className="app">
      <section className="section">
        <div className="relative max-w-4xl mx-auto my-4 bg-black">

          {/* Player */}
          <div className="player-wrapper relative z-0">
            <ReactPlayer
              ref={setPlayerRef}
              className="react-player"
              style={{ width: '100%', height: 'auto', aspectRatio: '16/9', zIndex: 0 }}
              src="https://youtu.be/L6htfu4sIKQ?list=RDL6htfu4sIKQ"
              pip
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              config={{
                youtube: { color: 'white' },
                vimeo: { color: 'ffffff' },
                spotify: { preferVideo: true },
                tiktok: {
                  fullscreen_button: true,
                  progress_bar: true,
                  play_button: true,
                  volume_control: true,
                  timestamp: false,
                  music_info: false,
                  description: false,
                  rel: false,
                  native_context_menu: true,
                  closed_caption: false,
                }
              }}
              autoPlay={true}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onProgress={handleProgress}
              onDurationChange={handleDurationChange}
            />
          </div>

          {/* Transparent overlay */}
          <div className="absolute inset-0 z-10 bg-black/10 pointer-events-auto" onClick={handlePlayPause} // overlay click toggles play/pause
>
            {/* Block only left back button */}
            <div
              className="absolute left-1 top-1 bottom-1 w-12 h-full z-20"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            ></div>
          </div>

          {/* Controls */}
          <div className="flex absolute left-0 -bottom-10 w-full bg-black/30 backdrop-blur-2xl px-1 items-center gap-1 z-20">
            <ButtonGroup>
              <Button variant="faded" isIconOnly size="sm" onPress={handleRewind10}><IoPlayBackOutline size={20} /></Button>
              <Button isIconOnly size="sm" onPress={handlePlayPause}>{playing ? <IoPauseOutline size={20} /> : <IoPlayOutline size={20} />}</Button>
              <Button isIconOnly variant="faded" size="sm" onPress={handleForward10}><IoPlayForwardOutline size={20} /></Button>
            </ButtonGroup>

            <input
              id="seek"
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="w-full h-1 bg-blue-300 rounded-lg accent-blue-600"
            />

            <Chip variant="faded" size="sm" className="ml-2">
              <Duration seconds={duration * played} /> / <Duration seconds={duration} />
            </Chip>

            <Dropdown>
              <DropdownTrigger>
                <Button variant="faded" isIconOnly size="sm"><TbSettings size={20} /></Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Player Settings">
                <DropdownSection title="Playback Speed">
                  <DropdownItem onPress={handleSetPlaybackRate} data-value={0.5}>0.5x</DropdownItem>
                  <DropdownItem onPress={handleSetPlaybackRate} data-value={1}>1x</DropdownItem>
                  <DropdownItem onPress={handleSetPlaybackRate} data-value={1.5}>1.5x</DropdownItem>
                  <DropdownItem onPress={handleSetPlaybackRate} data-value={2}>2x</DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>

            <Button variant="faded" isIconOnly size="sm" onPress={isVolumeOpenedStart}><IoVolumeMediumOutline size={20} /></Button>
          </div>

          {state.isVolumeOpened && (
            <div className="absolute flex flex-col items-center justify-center gap-2 right-1 bottom-0">
              <input
                id="volume"
                type="range"
                min={0}
                max={1}
                defaultValue={0.5}
                step="any"
                value={volume}
                onChange={handleVolumeChange}
                className="w-1 h-20 md:h-60 rotate-[-90deg] bg-blue-300 rounded-lg accent-blue-600 vertical-slider"
              />
              <Button variant="faded" isIconOnly size="sm" onPress={handleToggleMuted}>
                {muted ? <IoVolumeMute size={20} /> : <IoVolumeMediumOutline size={20} />}
              </Button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default App;
