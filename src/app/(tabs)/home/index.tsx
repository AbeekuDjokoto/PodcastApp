import { ActivityIndicator, FlatList } from "react-native";
import { fetchTrending } from "@/services/podcast-index";
import { useQuery } from "@tanstack/react-query";
import { PodcastCard } from "@/components/home/PodcastCard";
import { Text, View } from "@/tw";

export default function HomeScreen() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["trending"],
        queryFn: () => fetchTrending(),
    });

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Failed to fetch trending</Text>;

    return (
        <FlatList
            data={data?.feeds}
            contentContainerStyle={{ rowGap: 20, paddingTop: 8, paddingHorizontal: 12, paddingBottom: 96 }}
            columnWrapperStyle={{ columnGap: 12 }}
            renderItem={({ item }) =>
                <View key={item.id} className='flex-1 max-w-1/2'>
                    <PodcastCard podcast={item} />
                </View>
            }
            contentInsetAdjustmentBehavior="automatic"
            numColumns={2}
        />
    );
}

