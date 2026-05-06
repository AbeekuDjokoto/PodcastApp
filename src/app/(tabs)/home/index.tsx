import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { fetchTrending } from "@/services/podcast-index";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/tw";

export default function HomeScreen() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["trending"],
        queryFn: () => fetchTrending(),
    });

    console.log("data", data);
    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Failed to fetch trending</Text>;

    return (
        <FlatList
            data={data?.feeds}
            renderItem={({ item }) => (
                <Text className="text-2xl font-bold bg-red-400">{item.title}</Text>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentInsetAdjustmentBehavior="automatic"
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});