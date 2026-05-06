// @ts-nocheck
import { Animated as RNAnimated } from "react-native";

// Use React Native's built-in Animated as a stable fallback.
// (Reanimated is great, but importing it can crash in misconfigured setups.)
// Keep this file dependency-free to avoid circular imports with `./index`.
export const Animated = RNAnimated;
