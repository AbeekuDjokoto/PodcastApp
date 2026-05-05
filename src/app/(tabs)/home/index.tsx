import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { fetchTrending } from "../../services/podcast-index";
import { useQuery } from "@tanstack/react-query";

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
            renderItem={({ item }) => <Text>{item.title}</Text>}
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