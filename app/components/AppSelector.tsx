import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Search, Check, Filter } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface App {
  id: string;
  name: string;
  icon: string;
  category: string;
}

interface AppSelectorProps {
  onSelectionChange?: (selectedApps: string[]) => void;
  initialSelectedApps?: string[];
}

const AppSelector = ({
  onSelectionChange = () => {},
  initialSelectedApps = [],
}: AppSelectorProps) => {
  // Mock data for installed apps
  const mockApps: App[] = [
    {
      id: "com.instagram.ios",
      name: "Instagram",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=instagram",
      category: "Social",
    },
    {
      id: "com.facebook.Facebook",
      name: "Facebook",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=facebook",
      category: "Social",
    },
    {
      id: "com.atebits.Tweetie2",
      name: "Twitter",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=twitter",
      category: "Social",
    },
    {
      id: "com.burbn.tiktok",
      name: "TikTok",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=tiktok",
      category: "Entertainment",
    },
    {
      id: "com.netflix.Netflix",
      name: "Netflix",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=netflix",
      category: "Entertainment",
    },
    {
      id: "com.youtube.ios",
      name: "YouTube",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=youtube",
      category: "Entertainment",
    },
    {
      id: "com.reddit.Reddit",
      name: "Reddit",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=reddit",
      category: "Social",
    },
    {
      id: "com.spotify.client",
      name: "Spotify",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=spotify",
      category: "Music",
    },
    {
      id: "com.amazon.Amazon",
      name: "Amazon",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=amazon",
      category: "Shopping",
    },
    {
      id: "com.apple.mobilesafari",
      name: "Safari",
      icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=safari",
      category: "Productivity",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApps, setSelectedApps] =
    useState<string[]>(initialSelectedApps);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(mockApps.map((app) => app.category)));

  const filteredApps = mockApps.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? app.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const toggleAppSelection = (appId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedApps((prev) => {
      const newSelection = prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId];

      return newSelection;
    });
  };

  const handleConfirmSelection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectionChange(selectedApps);
  };

  const renderAppItem = ({ item }: { item: App }) => {
    const isSelected = selectedApps.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => toggleAppSelection(item.id)}
        className={`flex-row items-center p-4 border-b border-gray-200 ${isSelected ? "bg-blue-50" : ""}`}
      >
        <Image
          source={{ uri: item.icon }}
          className="w-10 h-10 rounded-lg mr-3"
        />
        <View className="flex-1">
          <Text className="text-base font-medium">{item.name}</Text>
          <Text className="text-xs text-gray-500">{item.category}</Text>
        </View>
        <View
          className={`w-6 h-6 rounded-full border ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"} justify-center items-center`}
        >
          {isSelected && <Check size={16} color="white" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-white rounded-xl shadow-md overflow-hidden w-full h-full">
      <View className="p-4 bg-blue-500">
        <Text className="text-xl font-bold text-white mb-2">
          Select Apps to Block
        </Text>
        <Text className="text-white text-opacity-80">
          Choose which apps to block during focus mode
        </Text>
      </View>

      <View className="p-4 flex-row items-center bg-gray-100">
        <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 py-2">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search apps"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          className="ml-3 p-2 bg-white rounded-lg"
          onPress={() => setSelectedCategory(null)}
        >
          <Filter size={20} color={selectedCategory ? "#3b82f6" : "#9ca3af"} />
        </TouchableOpacity>
      </View>

      {/* Category filters */}
      <View className="px-4 py-2 flex-row flex-wrap">
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() =>
              setSelectedCategory((prev) =>
                prev === category ? null : category,
              )
            }
            className={`mr-2 mb-2 px-3 py-1 rounded-full ${selectedCategory === category ? "bg-blue-500" : "bg-gray-200"}`}
          >
            <Text
              className={
                selectedCategory === category ? "text-white" : "text-gray-700"
              }
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredApps}
        renderItem={renderAppItem}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />

      <View className="p-4 border-t border-gray-200 space-y-3">
        <Text className="text-center text-gray-500">
          {selectedApps.length} app{selectedApps.length !== 1 ? "s" : ""}{" "}
          selected
        </Text>
        <TouchableOpacity
          onPress={handleConfirmSelection}
          className={`py-3 px-6 rounded-lg ${selectedApps.length > 0 ? "bg-blue-500" : "bg-gray-300"}`}
          disabled={selectedApps.length === 0}
        >
          <Text
            className={`text-center font-medium ${selectedApps.length > 0 ? "text-white" : "text-gray-500"}`}
          >
            Confirm Selection
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppSelector;
