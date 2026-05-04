import Stack from "expo-router/stack";

export default function HomeStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerLargeTitle: true,
            }}
        >
            <Stack.Screen name="index" options={{ title: "Home" }} />
        </Stack>
    );
}
