import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Settings, Zap } from "lucide-react-native";
import FocusStatus from "./components/FocusStatus";
import AppSelector from "./components/AppSelector";
import NFCTagManager from "./components/NFCTagManager";
import OnboardingFlow from "./components/OnboardingFlow";

export default function HomeScreen() {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [focusStartTime, setFocusStartTime] = useState<Date | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [showNFCManager, setShowNFCManager] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  // Simulate checking if user is first time user
  useEffect(() => {
    // In a real app, check AsyncStorage or similar
    setTimeout(() => {
      setIsFirstTimeUser(false);
      setShowOnboarding(false);
    }, 1000);
  }, []);

  const handleToggleFocusMode = () => {
    if (isBlocked) {
      // Deactivate focus mode
      setIsBlocked(false);
      setFocusStartTime(null);
    } else {
      // Activate focus mode
      setIsBlocked(true);
      setFocusStartTime(new Date());
      setShowAppSelector(false);
    }
  };

  const handleNFCTagScanned = (isRegistered: boolean) => {
    if (isRegistered) {
      handleToggleFocusMode();
    } else {
      // Show NFC tag registration flow
      setShowNFCManager(true);
    }
  };

  const handleCloseAppSelector = () => {
    setShowAppSelector(false);
  };

  const handleCloseNFCManager = () => {
    setShowNFCManager(false);
  };

  const handlePermissionsGranted = () => {
    setHasPermissions(true);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handlePermissionsGranted} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-2 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Focus Mode</Text>
          <TouchableOpacity
            onPress={() => setShowNFCManager(true)}
            className="p-2 rounded-full bg-gray-100"
          >
            <Settings size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>

        {/* Focus Status Component */}
        <FocusStatus
          isActive={isBlocked}
          startTime={focusStartTime || new Date()}
          onStateChange={setIsBlocked}
        />

        {/* Main Content Area */}
        <ScrollView className="flex-1 mt-6">
          {showAppSelector ? (
            <AppSelector
              onSelectionChange={(selectedApps) => {
                console.log("Selected apps:", selectedApps);
              }}
              initialSelectedApps={[]}
            />
          ) : showNFCManager ? (
            <NFCTagManager
              onTagScanned={(tagId) => {
                console.log("Tag scanned:", tagId);
                handleNFCTagScanned(true);
              }}
              onTagRegistered={(tag) => {
                console.log("Tag registered:", tag);
                setShowNFCManager(false);
              }}
              onTagRemoved={(tagId) => {
                console.log("Tag removed:", tagId);
              }}
            />
          ) : (
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

              {/* Action Buttons */}
              <View className="space-y-3">
                <TouchableOpacity
                  onPress={() => setShowAppSelector(true)}
                  className="bg-blue-500 p-4 rounded-xl"
                >
                  <Text className="text-white text-center font-medium">
                    Select Apps to Block
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowNFCManager(true)}
                  className="bg-gray-100 p-4 rounded-xl"
                >
                  <Text className="text-gray-800 text-center font-medium">
                    Manage NFC Tags
                  </Text>
                </TouchableOpacity>

                {/* Close buttons for overlays */}
                {showAppSelector && (
                  <TouchableOpacity
                    onPress={handleCloseAppSelector}
                    className="bg-red-500 p-4 rounded-xl"
                  >
                    <Text className="text-white text-center font-medium">
                      Close App Selector
                    </Text>
                  </TouchableOpacity>
                )}

                {showNFCManager && (
                  <TouchableOpacity
                    onPress={handleCloseNFCManager}
                    className="bg-red-500 p-4 rounded-xl"
                  >
                    <Text className="text-white text-center font-medium">
                      Close NFC Manager
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
