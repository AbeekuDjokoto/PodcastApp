import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    Image,
    Pressable,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const { user, isLoaded } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    if (!isLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    const displayName =
        user?.fullName ||
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        user?.primaryEmailAddress?.emailAddress ||
        "Account";

    const initial = displayName.trim().slice(0, 1).toUpperCase() || "?";

    return (
        <View
            style={{
                flex: 1,
                padding: 24,
                paddingTop: 16,
                paddingBottom: Math.max(24, insets.bottom + 16),
                gap: 20,
            }}
        >
            {user?.imageUrl ? (
                <Image
                    source={{ uri: user.imageUrl }}
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        alignSelf: "center",
                    }}
                    accessibilityLabel="Profile photo"
                />
            ) : (
                <View
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        alignSelf: "center",
                        backgroundColor: "#E5E5EA",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    accessibilityRole="image"
                    accessibilityLabel="Profile placeholder"
                >
                    <Text
                        style={{ fontSize: 40, fontWeight: "600" }}
                        selectable
                    >
                        {initial}
                    </Text>
                </View>
            )}
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: "600",
                    textAlign: "center",
                }}
                selectable
            >
                {displayName}
            </Text>
            {user?.primaryEmailAddress?.emailAddress ? (
                <Text
                    style={{
                        fontSize: 15,
                        color: "#666",
                        textAlign: "center",
                        marginTop: -8,
                    }}
                    selectable
                >
                    {user.primaryEmailAddress.emailAddress}
                </Text>
            ) : null}
            <Pressable
                onPress={async () => {
                    await signOut();
                    router.replace("/auth/sign-in");
                }}
                style={({ pressed }) => ({
                    marginTop: "auto",
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: pressed ? "#D70015" : "#FF3B30",
                    alignItems: "center",
                })}
                accessibilityRole="button"
                accessibilityLabel="Sign out"
            >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 17 }}>
                    Sign out
                </Text>
            </Pressable>
        </View>
    );
}
