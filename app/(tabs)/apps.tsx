import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSelector from "../components/AppSelector";
import { appService } from "../services/AppService";

export default function AppsScreen() {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSelectedApps();
  }, []);

  const loadSelectedApps = async () => {
    try {
      setIsLoading(true);
      const apps = await appService.getSelectedApps();
      setSelectedApps(apps);
    } catch (error) {
      console.error('Error loading selected apps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = async (newSelectedApps: string[]) => {
    try {
      setSelectedApps(newSelectedApps);
      
      // Show success message
      Alert.alert(
        "Apps Updated",
        `${newSelectedApps.length} app${newSelectedApps.length !== 1 ? 's' : ''} will be blocked during focus mode.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error updating app selection:', error);
      Alert.alert(
        "Error",
        "Failed to update app selection. Please try again.",
        [{ text: "OK" }]
      );
    }
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
          {selectedApps.length > 0 && (
            <Text className="text-sm text-blue-600 mt-2">
              {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} currently selected
            </Text>
          )}
        </View>

        {/* App Selector Component */}
        <View className="flex-1">
          <AppSelector
            onSelectionChange={handleSelectionChange}
            initialSelectedApps={selectedApps}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
