import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSelector from "../components/AppSelector";

export default function AppsScreen() {
  const handleSelectionChange = (selectedApps: string[]) => {
    console.log("Selected apps:", selectedApps);
    // Here you would typically save the selection to storage or state management
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-2 bg-white">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            App Selection
          </Text>
          <Text className="text-gray-600">
            Choose which apps to block during focus mode
          </Text>
        </View>

        {/* App Selector Component */}
        <View className="flex-1">
          <AppSelector
            onSelectionChange={handleSelectionChange}
            initialSelectedApps={[]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
