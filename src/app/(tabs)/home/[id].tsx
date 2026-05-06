import { ActivityIndicator, Text, View } from "react-native"
    ;
import { useLocalSearchParams } from "expo-router";
import { fetchFeedById } from "@/services/podcast-index";
import { useQuery } from "@tanstack/react-query";

export default function PodcastDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ["feed", id],
        queryFn: () => fetchFeedById(id),
    });

    const podcast = data?.feed;

    if (isLoading) return <ActivityIndicator />;
    if (error || !podcast) return <Text>Failed to fetch feed</Text>;

    return (
        <View>
            <Text>{podcast.title}</Text>
        </View>
    )
}