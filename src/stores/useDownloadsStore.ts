import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Episode } from "@/types";
import type { StateStorage } from "zustand/middleware";

export interface DownloadedEpisode {
  guid: string;
  title: string;
  image?: string;
  feedId: string;
  feedTitle: string;
  localUri: string;
  downloadedAt: number;
  episodeData: Episode;
}

interface DownloadsState {
  episodes: Record<string, DownloadedEpisode>;
  addDownload: (episode: DownloadedEpisode) => void;
  removeDownload: (guid: string) => void;
  isDownloaded: (guid: string) => boolean;
  getDownload: (guid: string) => DownloadedEpisode | undefined;
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function getDownloadsStorage(): StateStorage {
  try {
    const storageModule = require("expo-sqlite/kv-store") as {
      default: StateStorage;
    };
    return storageModule.default;
  } catch {
    return memoryStorage;
  }
}

export const useDownloadsStore = create<DownloadsState>()(
  persist(
    (set, get) => ({
      episodes: {},
      addDownload: (episode) =>
        set((state) => ({
          episodes: { ...state.episodes, [episode.guid]: episode },
        })),
      removeDownload: (guid) =>
        set((state) => {
          const { [guid]: _, ...rest } = state.episodes;
          return { episodes: rest };
        }),
      isDownloaded: (guid) => guid in get().episodes,
      getDownload: (guid) => get().episodes[guid],
    }),
    {
      name: "downloads",
      storage: createJSONStorage(getDownloadsStorage),
    },
  ),
);
