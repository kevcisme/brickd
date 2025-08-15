import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Play, Square, BarChart3 } from "lucide-react-native";
import FocusStatus from "../components/FocusStatus";

interface FocusSession {
  id: string;
  date: string;
  duration: string;
  appsBlocked: number;
}

export default function FocusScreen() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [focusStartTime, setFocusStartTime] = useState<Date | null>(null);
  const [focusSessions] = useState<FocusSession[]>([
    {
      id: "1",
      date: "Today, 2:30 PM",
      duration: "1h 25m",
      appsBlocked: 5,
    },
    {
      id: "2",
      date: "Yesterday, 10:15 AM",
      duration: "45m",
      appsBlocked: 3,
    },
    {
      id: "3",
      date: "Dec 20, 3:45 PM",
      duration: "2h 10m",
      appsBlocked: 7,
    },
  ]);

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-2 bg-white">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Focus Sessions
          </Text>
          <Text className="text-gray-600">
            Track your focus time and manage active sessions
          </Text>
        </View>

        <ScrollView className="flex-1">
          {/* Current Focus Status */}
          <View className="mb-6">
            <FocusStatus
              isActive={isBlocked}
              startTime={focusStartTime || new Date()}
              onStateChange={setIsBlocked}
            />
          </View>

          {/* Manual Controls */}
          <View className="bg-gray-50 p-4 rounded-xl mb-6">
            <Text className="text-lg font-medium text-gray-800 mb-3">
              Manual Control
            </Text>
            <TouchableOpacity
              onPress={handleToggleFocusMode}
              className={`flex-row items-center justify-center p-4 rounded-lg ${
                isBlocked ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {isBlocked ? (
                <Square size={20} color="white" className="mr-2" />
              ) : (
                <Play size={20} color="white" className="mr-2" />
              )}
              <Text className="text-white font-medium text-lg">
                {isBlocked ? "Stop Focus Session" : "Start Focus Session"}
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-500 text-center mt-2">
              You can also use your NFC tag to toggle focus mode
            </Text>
          </View>

          {/* Focus History */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <BarChart3 size={24} color="#4b5563" className="mr-2" />
              <Text className="text-lg font-medium text-gray-800">
                Recent Sessions
              </Text>
            </View>

            {focusSessions.map((session) => (
              <View
                key={session.id}
                className="bg-white border border-gray-200 p-4 rounded-lg mb-3 shadow-sm"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      {session.duration}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {session.date}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm text-blue-600 font-medium">
                      {session.appsBlocked} apps blocked
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Stats Summary */}
          <View className="bg-blue-50 p-4 rounded-xl mb-6">
            <Text className="text-lg font-medium text-gray-800 mb-3">
              This Week
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">12h</Text>
                <Text className="text-sm text-gray-600">Total Focus</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">8</Text>
                <Text className="text-sm text-gray-600">Sessions</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">1h 30m</Text>
                <Text className="text-sm text-gray-600">Avg Session</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
