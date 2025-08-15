import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Info,
  ChevronRight,
} from "lucide-react-native";
import NFCTagManager from "../components/NFCTagManager";

export default function SettingsScreen() {
  const [showNFCManager, setShowNFCManager] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoLock, setAutoLock] = useState(false);

  const handleTagScanned = (tagId: string) => {
    console.log("Tag scanned:", tagId);
  };

  const handleTagRegistered = (tag: any) => {
    console.log("Tag registered:", tag);
    setShowNFCManager(false);
  };

  const handleTagRemoved = (tagId: string) => {
    console.log("Tag removed:", tagId);
  };

  const handleScanError = () => {
    // Return to settings main screen when scan fails
    setShowNFCManager(false);
  };

  if (showNFCManager) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-4 pt-2 bg-white">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => setShowNFCManager(false)}
              className="mr-4"
            >
              <Text className="text-blue-500 font-medium">← Back</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800">NFC Tags</Text>
          </View>

          <NFCTagManager
            onTagScanned={handleTagScanned}
            onTagRegistered={handleTagRegistered}
            onTagRemoved={handleTagRemoved}
            onScanError={handleScanError}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-2 bg-white">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Settings
          </Text>
          <Text className="text-gray-600">
            Configure your focus mode preferences
          </Text>
        </View>

        <ScrollView className="flex-1">
          {/* NFC Tags Section */}
          <View className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
            <TouchableOpacity
              onPress={() => setShowNFCManager(true)}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <SettingsIcon size={20} color="#3b82f6" />
                </View>
                <View>
                  <Text className="font-medium text-gray-800">NFC Tags</Text>
                  <Text className="text-sm text-gray-500">
                    Manage registered NFC tags
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Notifications Section */}
          <View className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <Bell size={20} color="#4b5563" className="mr-2" />
                <Text className="font-medium text-gray-800">Notifications</Text>
              </View>
            </View>

            <View className="p-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Focus Reminders
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Get notified when focus sessions start/end
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                  thumbColor={notificationsEnabled ? "#ffffff" : "#f3f4f6"}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Haptic Feedback
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Vibrate when toggling focus mode
                  </Text>
                </View>
                <Switch
                  value={hapticFeedback}
                  onValueChange={setHapticFeedback}
                  trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                  thumbColor={hapticFeedback ? "#ffffff" : "#f3f4f6"}
                />
              </View>
            </View>
          </View>

          {/* Security Section */}
          <View className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <Shield size={20} color="#4b5563" className="mr-2" />
                <Text className="font-medium text-gray-800">Security</Text>
              </View>
            </View>

            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Auto-lock on Reboot
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Automatically clear restrictions after device restart
                  </Text>
                </View>
                <Switch
                  value={autoLock}
                  onValueChange={setAutoLock}
                  trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                  thumbColor={autoLock ? "#ffffff" : "#f3f4f6"}
                />
              </View>
            </View>
          </View>

          {/* About Section */}
          <View className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                  <Info size={20} color="#4b5563" />
                </View>
                <View>
                  <Text className="font-medium text-gray-800">About</Text>
                  <Text className="text-sm text-gray-500">
                    App version and information
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View className="bg-gray-50 p-4 rounded-xl">
            <Text className="text-center text-gray-500 text-sm">
              Focus Mode v1.0.0
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-1">
              Built with React Native & Expo
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
