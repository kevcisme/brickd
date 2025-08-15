import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Vibration } from "react-native";
import {
  AlertCircle,
  CheckCircle,
  PlusCircle,
  Trash2,
  Zap,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface NFCTag {
  id: string;
  name: string;
  dateAdded: string;
}

interface NFCTagManagerProps {
  onTagScanned?: (tagId: string) => void;
  onTagRegistered?: (tag: NFCTag) => void;
  onTagRemoved?: (tagId: string) => void;
  onScanError?: () => void;
  registeredTags?: NFCTag[];
}

const NFCTagManager = ({
  onTagScanned = () => {},
  onTagRegistered = () => {},
  onTagRemoved = () => {},
  onScanError = () => {},
  registeredTags = [
    { id: "tag-001", name: "Office Tag", dateAdded: "2023-10-15" },
    { id: "tag-002", name: "Home Tag", dateAdded: "2023-10-20" },
  ],
}: NFCTagManagerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          simulateTagFound();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const simulateTagFound = () => {
    // Simulate finding a tag after scanning completes
    setTimeout(() => {
      setIsScanning(false);

      // Simulate random chance of finding a tag (70% success rate)
      const tagFound = Math.random() > 0.3;

      if (!tagFound) {
        // Tag not found - show error and call onScanError
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          "No Tag Found",
          "No NFC tag was detected. Please try again or make sure the tag is close to your device.",
          [
            {
              text: "OK",
              onPress: () => onScanError(),
            },
          ],
        );
        return;
      }

      // Tag found successfully
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // In a real implementation, this would be the actual tag ID from NFC scan
      const newTagId = `tag-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

      // Use Alert.alert with input simulation instead of Alert.prompt
      Alert.alert("Tag Found", "Give this tag a name:", [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setIsScanning(false),
        },
        {
          text: "Register",
          onPress: () => {
            // For now, use a default name. In a real app, you'd use a TextInput modal
            const defaultName = `Tag ${newTagId.slice(-3)}`;
            const newTag = {
              id: newTagId,
              name: defaultName,
              dateAdded: new Date().toISOString().split("T")[0],
            };
            onTagRegistered(newTag);
            Alert.alert(
              "Success",
              `Tag "${defaultName}" registered successfully!`,
            );
          },
        },
      ]);
    }, 500);
  };

  const removeTag = (tagId: string) => {
    Alert.alert("Remove Tag", "Are you sure you want to remove this tag?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          onTagRemoved(tagId);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  };

  return (
    <View className="bg-white p-4 rounded-xl shadow-md w-full">
      <Text className="text-xl font-bold mb-4 text-center">
        NFC Tag Manager
      </Text>

      {/* Registered Tags Section */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Registered Tags</Text>
        <ScrollView className="max-h-40">
          {registeredTags.length > 0 ? (
            registeredTags.map((tag) => (
              <View
                key={tag.id}
                className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg mb-2"
              >
                <View className="flex-row items-center">
                  <CheckCircle size={20} color="#10b981" />
                  <View className="ml-2">
                    <Text className="font-medium">{tag.name}</Text>
                    <Text className="text-xs text-gray-500">
                      Added: {tag.dateAdded}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeTag(tag.id)}
                  className="p-2"
                >
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="p-4 bg-gray-50 rounded-lg items-center">
              <Text className="text-gray-500">No tags registered yet</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Scan New Tag Section */}
      <View className="items-center">
        {isScanning ? (
          <View className="items-center w-full">
            <View className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <View
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </View>
            <View className="flex-row items-center justify-center mb-4">
              <Zap size={24} color="#3b82f6" className="mr-2" />
              <Text className="text-lg font-medium">
                Scanning for NFC tag...
              </Text>
            </View>
            <Text className="text-sm text-gray-500 mb-4 text-center">
              Hold your iPhone near an NFC tag until it's detected
            </Text>
            <TouchableOpacity
              onPress={() => setIsScanning(false)}
              className="bg-gray-200 py-3 px-6 rounded-lg"
            >
              <Text className="font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={startScan}
            className="bg-blue-500 py-4 px-6 rounded-lg flex-row items-center"
          >
            <PlusCircle size={20} color="white" className="mr-2" />
            <Text className="text-white font-medium text-lg">Scan New Tag</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Instructions */}
      <View className="mt-6 p-4 bg-blue-50 rounded-lg">
        <View className="flex-row items-start">
          <AlertCircle size={20} color="#3b82f6" className="mr-2 mt-0.5" />
          <Text className="text-sm text-gray-700">
            Tap "Scan New Tag" and hold your iPhone near an NFC tag to register
            it. Once registered, you can use this tag to toggle focus mode.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NFCTagManager;
