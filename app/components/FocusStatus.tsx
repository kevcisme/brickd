import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Clock } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface FocusStatusProps {
  isActive?: boolean;
  startTime?: Date;
  onStateChange?: (isActive: boolean) => void;
}

const FocusStatus = ({
  isActive = false,
  startTime = new Date(),
  onStateChange = () => {},
}: FocusStatusProps) => {
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [animation] = useState(new Animated.Value(0));

  // Update the timer when in active focus mode
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      intervalId = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        setElapsedTime(
          `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
        );
      }, 1000);

      // Trigger haptic feedback when focus mode is activated
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setElapsedTime("00:00:00");

      // Trigger haptic feedback when focus mode is deactivated
      if (startTime.getTime() !== new Date().getTime()) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, startTime]);

  // Animate background color change when status changes
  useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isActive, animation]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f3f4f6", "#dcfce7"], // gray-100 to green-100
  });

  const borderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#d1d5db", "#86efac"], // gray-300 to green-300
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor, borderColor }]}
      className="bg-white rounded-xl shadow-sm border-2 p-6 items-center justify-center w-full"
    >
      <View className="items-center">
        <Text
          className={`text-2xl font-bold mb-2 ${isActive ? "text-green-700" : "text-gray-700"}`}
        >
          {isActive ? "Focus Mode Active" : "Ready to Focus"}
        </Text>

        <View className="flex-row items-center justify-center mb-4">
          <Clock
            size={24}
            className={isActive ? "text-green-600" : "text-gray-500"}
            color={isActive ? "#059669" : "#6b7280"}
          />
          <Text
            className={`text-xl ml-2 font-mono ${isActive ? "text-green-600" : "text-gray-500"}`}
          >
            {elapsedTime}
          </Text>
        </View>

        <Text className="text-center text-gray-500">
          {isActive
            ? "Distracting apps are currently blocked"
            : "Tap your NFC tag to block distracting apps"}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 2,
  },
});

export default FocusStatus;
