import { Button, StyleSheet, Text, View } from "react-native";
import { fetchTrending } from "../../services/podcast-index";

export default function HomeScreen() {

    const onPress = async () => {
        try {
            const data = await fetchTrending();
            console.log(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Failed to fetch trending podcasts:", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>

            <Button title="Fetch Trending" onPress={onPress} />
        </View>
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