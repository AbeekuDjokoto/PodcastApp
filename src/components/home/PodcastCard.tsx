import { Feed } from "@/types";
import { Image, Text, View } from "@/tw";

type PodcastCardProps = {
    item: Feed;
};

export function PodcastCard({ item }: PodcastCardProps) {
    const coverImage = item.image || item.artwork;
    const author = item.author || item.ownerName || "Unknown creator";
    const details = [
        item.episodeCount > 0 ? `${item.episodeCount} eps` : null,
        item.language ? item.language.toUpperCase() : null,
        item.explicit ? "Explicit" : "Clean",
    ].filter(Boolean);

    return (
        <View className="flex-1 gap-2">
            <Image
                source={coverImage}
                className="aspect-square w-full rounded-2xl"
                contentFit="cover"
            />

            <View>
                <Text className="text-xs font-medium" numberOfLines={2}>
                    {item.title}
                </Text>

                <Text className="text-[13px] text-neutral-400" numberOfLines={1}>
                    {author}
                </Text>
                {/* 
                <Text className="text-xs text-neutral-400" numberOfLines={1}>
                    {details.join(" • ")}
                </Text> */}
            </View>
        </View>
    );
}
