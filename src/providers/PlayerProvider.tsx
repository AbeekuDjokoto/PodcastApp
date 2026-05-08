import { Episode } from '@/types';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useDownloadsStore } from '@/stores/useDownloadsStore';


type PlayerLike = {
    playbackRate: number;
    volume: number;
    replace: (source: { uri?: string }) => void;
    play: () => void;
    pause: () => void;
    seekTo: (time: number) => void;
    setPlaybackRate: (rate: number) => void;
    setActiveForLockScreen: (active: boolean, metadata?: {
        title?: string;
        artist?: string;
        albumTitle?: string;
        artworkUrl?: string;
    }) => void;
}

type PlayerStatusLike = {
    playing: boolean;
    currentTime: number;
    duration: number;
    isLoaded: boolean;
    isBuffering: boolean;
    didJustFinish: boolean;
}

type PlayerContext = {
    episode: Episode | null;
    setEpisode: (ep: Episode | null) => void;
    player: PlayerLike;
    playerStatus: PlayerStatusLike;
}

const PlayerContext = createContext<PlayerContext | null>(null)

const defaultStatus: PlayerStatusLike = {
    playing: false,
    currentTime: 0,
    duration: 0,
    isLoaded: false,
    isBuffering: false,
    didJustFinish: false,
};

function createNoopPlayer(): PlayerLike {
    return {
        playbackRate: 1,
        volume: 1,
        replace: () => { },
        play: () => { },
        pause: () => { },
        seekTo: () => { },
        setPlaybackRate: () => { },
        setActiveForLockScreen: () => { },
    };
}

function getExpoAudioRuntime() {
    try {
        return require('expo-audio') as {
            createAudioPlayer: (source: null, options?: { updateInterval?: number }) => PlayerLike;
            setAudioModeAsync: (mode: {
                playsInSilentMode: boolean;
                shouldPlayInBackground: boolean;
                interruptionMode: 'doNotMix' | 'duckOthers' | 'mixWithOthers';
            }) => Promise<void>;
        };
    } catch {
        return null;
    }
}

const expoAudio = getExpoAudioRuntime();
const player = expoAudio?.createAudioPlayer(null, { updateInterval: 500 }) ?? createNoopPlayer();

export default function PlayerProvider({ children }: PropsWithChildren) {
    const [episode, setEpisode] = useState<Episode | null>(null);
    const [status, setStatus] = useState<PlayerStatusLike>(defaultStatus);

    useEffect(() => {
        if (!expoAudio) return;
        expoAudio.setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionMode: 'doNotMix',
        });
    }, []);

    const getDownload = useDownloadsStore((s) => s.getDownload);

    const setActiveEpisode = (episode: Episode | null) => {
        setEpisode(episode);

        const download = episode ? getDownload(episode.guid) : undefined;
        player.replace({ uri: download?.localUri ?? episode?.enclosureUrl })

        // Adjust with actual data
        player.setActiveForLockScreen(true, {
            title: 'My Audio Title',
            artist: 'Artist Name',
            albumTitle: 'Album Name',
            artworkUrl: 'https://example.com/artwork.jpg', // optional
        });


        player.play();
        setStatus((prev) => ({ ...prev, playing: !!episode, isLoaded: !!episode }));
    }
    console.log("Currently playing: ", episode)

    return (
        <PlayerContext.Provider
            value={{
                episode,
                setEpisode: setActiveEpisode,
                player,
                playerStatus: status
            }}>
            {children}
        </PlayerContext.Provider>
    )
}


export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
}