import { Link } from "expo-router";
import Stack from "expo-router/stack";
import { Pressable, Text } from "react-native";

export default function HomeStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerLargeTitle: true,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Home",
                    headerRight: () => (
                        <Link href="/profile" asChild>
                            <Pressable
                                hitSlop={12}
                                style={{ paddingHorizontal: 4 }}
                                accessibilityRole="button"
                                accessibilityLabel="Open profile"
                            >
                                <Text style={{ color: "#007AFF", fontSize: 17 }}>
                                    Profile
                                </Text>
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: "Podcast",
                    headerLargeTitle: false,
                }}
            />
        </Stack>
    );
}
