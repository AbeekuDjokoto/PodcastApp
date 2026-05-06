import { Feed } from "@/types";
import { Image, Text, View } from "@/tw";
import { Link } from "expo-router";
import { Pressable } from "react-native";

type PodcastCardProps = {
    podcast: Feed;
};

export function PodcastCard({ podcast }: PodcastCardProps) {
    const coverImage = podcast.image || podcast.artwork;
    const author = podcast.author || podcast.ownerName || "Unknown creator";

    return (
        <Link href={`/home/${podcast.id}`} asChild>
            <Pressable className="flex-1 gap-2">
                <Image
                    source={coverImage}
                    className="aspect-square w-full rounded-2xl"
                    contentFit="cover"
                />

                <View>
                    <Text className="text-xs font-medium" numberOfLines={2}>
                        {podcast.title}
                    </Text>

                    <Text className="text-[13px] text-neutral-400" numberOfLines={1}>
                        {podcast.author}
                    </Text>
                    {/* 
                <Text className="text-xs text-neutral-400" numberOfLines={1}>
                    {details.join(" • ")}
                </Text> */}
                </View>
            </Pressable>
        </Link>

    );
}
