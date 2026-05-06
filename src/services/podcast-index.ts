import * as Crypto from "expo-crypto";
import { Feed } from "../types";

const stripWrappingQuotes = (value: string) =>
  value.replace(/^['"]|['"]$/g, "").trim();

const apiKey = process.env.EXPO_PUBLIC_PODCAST_INDEX_API_KEY?.trim();
const apiSecret = process.env.EXPO_PUBLIC_PODCAST_INDEX_API_SECRET
  ? stripWrappingQuotes(process.env.EXPO_PUBLIC_PODCAST_INDEX_API_SECRET)
  : undefined;

if (!apiKey || !apiSecret) {
  throw new Error(
    "EXPO_PUBLIC_PODCAST_INDEX_API_KEY or EXPO_PUBLIC_PODCAST_INDEX_API_SECRET is not defined",
  );
}

const fetchIndex = async (path: string, options: RequestInit = {}) => {
  // Read more about Podcast Index Authorization:
  // https://podcastindex-org.github.io/docs-api/#auth

  // ======== Hash them to get the Authorization token ========
  const time = Math.floor(Date.now() / 1000);
  const dataToHash = apiKey + apiSecret + time;

  const authHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    dataToHash,
  );

  const optionsWithAuth = {
    ...options,
    method: options.method || "get",
    headers: {
      "User-Agent": "notJustPodcast/1.0",
      "X-Auth-Date": "" + time,
      "X-Auth-Key": apiKey,
      Authorization: authHash,
      ...options.headers,
    },
  };

  const url = `https://api.podcastindex.org/api/1.0${path}`;
  return fetch(url, optionsWithAuth);
};

export async function fetchTrending(): Promise<{ feeds: Feed[] }> {
  const res = await fetchIndex(`/podcasts/trending?lang=en`);
  const rawBody = await res.text();

  if (!res.ok) {
    throw new Error(
      `Podcast Index request failed (${res.status}): ${rawBody || "No response body"}`,
    );
  }

  try {
    return JSON.parse(rawBody) as { feeds: Feed[] };
  } catch {
    throw new Error(
      `Podcast Index returned non-JSON response: ${rawBody.slice(0, 200)}`,
    );
  }
}

export async function fetchFeedById(id: string): Promise<{ feed: Feed }> {
  const res = await fetchIndex(`/podcasts/byfeedid?id=${id}`);
  return res.json();
}
