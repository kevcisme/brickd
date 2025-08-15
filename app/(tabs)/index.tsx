import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Zap } from "lucide-react-native";
import FocusStatus from "../components/FocusStatus";
import OnboardingFlow from "../components/OnboardingFlow";
import SelectedAppsDisplay from "../components/SelectedAppsDisplay";
import { focusSessionService, FocusSession } from "../services/FocusSessionService";

export default function HomeScreen() {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [focusStartTime, setFocusStartTime] = useState<Date | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);

  // Simulate checking if user is first time user
  useEffect(() => {
    // In a real app, check AsyncStorage or similar
    setTimeout(() => {
      setIsFirstTimeUser(false);
      setShowOnboarding(false);
    }, 1000);
  }, []);

  const handleSessionEnd = async (duration: number) => {
    if (focusStartTime) {
      const endTime = new Date();
      await focusSessionService.createSession(focusStartTime, endTime);
    }
  };

  const handleToggleFocusMode = () => {
    if (isBlocked) {
      // Deactivate focus mode
      setIsBlocked(false);
      setFocusStartTime(null);
    } else {
      // Activate focus mode
      setIsBlocked(true);
      setFocusStartTime(new Date());
    }
  };

  const handleNFCTagScanned = (isRegistered: boolean) => {
    if (isRegistered) {
      handleToggleFocusMode();
    }
  };

  const handlePermissionsGranted = () => {
    setHasPermissions(true);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <OnboardingFlow onComplete={handlePermissionsGranted} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-2 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Focus Mode</Text>
        </View>

        {/* Focus Status Component */}
        <FocusStatus
          isActive={isBlocked}
          startTime={focusStartTime || new Date()}
          onStateChange={setIsBlocked}
          onSessionEnd={handleSessionEnd}
        />

        {/* Main Content Area */}
        <ScrollView className="flex-1 mt-6">
          <View className="space-y-6">
            {/* Instructions */}
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-lg font-medium text-gray-800 mb-2">
                How it works
              </Text>
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Zap size={18} color="#3b82f6" />
                </View>
                <Text className="text-gray-600 flex-1">
                  Tap your NFC tag to toggle focus mode on/off
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Clock size={18} color="#3b82f6" />
                </View>
                <Text className="text-gray-600 flex-1">
                  When active, distracting apps will be blocked
                </Text>
              </View>
            </View>

            {/* Selected Apps Display */}
            <SelectedAppsDisplay maxDisplay={3} />

            {/* Quick Actions */}
            <View className="bg-blue-50 p-4 rounded-xl">
              <Text className="text-lg font-medium text-gray-800 mb-3">
                Quick Actions
              </Text>
              <Text className="text-gray-600 mb-4">
                Use the tabs below to manage your apps, view focus sessions, and
                configure settings.
              </Text>
              <View className="flex-row space-x-2">
                <View className="flex-1 bg-white p-3 rounded-lg">
                  <Text className="font-medium text-gray-800">Apps Tab</Text>
                  <Text className="text-sm text-gray-600">
                    Select apps to block
                  </Text>
                </View>
                <View className="flex-1 bg-white p-3 rounded-lg">
                  <Text className="font-medium text-gray-800">
                    Settings Tab
                  </Text>
                  <Text className="text-sm text-gray-600">Manage NFC tags</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
