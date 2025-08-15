import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { appService, App } from '../services/AppService';

interface SelectedAppsDisplayProps {
  maxDisplay?: number;
  showCount?: boolean;
}

const SelectedAppsDisplay: React.FC<SelectedAppsDisplayProps> = ({
  maxDisplay = 5,
  showCount = true,
}) => {
  const [selectedApps, setSelectedApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSelectedApps();
  }, []);

  const loadSelectedApps = async () => {
    try {
      setIsLoading(true);
      const apps = await appService.getSelectedAppDetails();
      setSelectedApps(apps);
    } catch (error) {
      console.error('Error loading selected apps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="bg-gray-50 p-4 rounded-xl">
        <Text className="text-sm text-gray-500">Loading selected apps...</Text>
      </View>
    );
  }

  if (selectedApps.length === 0) {
    return (
      <View className="bg-gray-50 p-4 rounded-xl">
        <Text className="text-sm text-gray-500 text-center">
          No apps selected for blocking
        </Text>
        <Text className="text-xs text-gray-400 text-center mt-1">
          Go to the Apps tab to select apps to block during focus mode
        </Text>
      </View>
    );
  }

  const displayApps = selectedApps.slice(0, maxDisplay);
  const remainingCount = selectedApps.length - maxDisplay;

  return (
    <View className="bg-gray-50 p-4 rounded-xl">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-medium text-gray-800">
          Apps to Block
        </Text>
        {showCount && (
          <Text className="text-xs text-gray-500">
            {selectedApps.length} selected
          </Text>
        )}
      </View>
      
      <View className="flex-row flex-wrap">
        {displayApps.map((app) => (
          <View key={app.id} className="flex-row items-center bg-white rounded-lg px-2 py-1 mr-2 mb-2 shadow-sm">
            <Image
              source={{ uri: app.icon }}
              className="w-4 h-4 rounded mr-1"
            />
            <Text className="text-xs text-gray-700">{app.name}</Text>
          </View>
        ))}
        
        {remainingCount > 0 && (
          <View className="bg-blue-100 rounded-lg px-2 py-1 mb-2">
            <Text className="text-xs text-blue-600 font-medium">
              +{remainingCount} more
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SelectedAppsDisplay;
