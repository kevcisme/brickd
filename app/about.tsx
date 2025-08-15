import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Code, Zap, Shield, Users, Heart } from "lucide-react-native";

export default function AboutScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-2 bg-white">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft size={24} color="#3b82f6" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">About</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* App Info Card */}
          <View className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Zap size={32} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-1">
                Hocus Focus
              </Text>
              <Text className="text-blue-600 font-medium">v1.0.0</Text>
            </View>
            
            <Text className="text-center text-gray-600 leading-6 mb-4">
              Transform your productivity with intelligent app blocking and NFC-powered focus sessions. 
              Break free from digital distractions and unlock your true potential.
            </Text>
          </View>

          {/* What the App Does */}
          <View className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="font-semibold text-gray-800 text-lg">What Hocus Focus Does</Text>
            </View>
            
            <View className="p-4 space-y-4">
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Shield size={16} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800 mb-1">Smart App Blocking</Text>
                  <Text className="text-sm text-gray-600">
                    Selectively block distracting apps during focus sessions while keeping essential tools accessible.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Code size={16} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800 mb-1">NFC Integration</Text>
                  <Text className="text-sm text-gray-600">
                    Use NFC tags to instantly activate focus mode - just tap and focus. Perfect for desk setups and productivity workflows.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Zap size={16} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800 mb-1">Focus Analytics</Text>
                  <Text className="text-sm text-gray-600">
                    Track your focus patterns, identify your biggest distractions, and optimize your productivity over time.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Developer Bio */}
          <View className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="font-semibold text-gray-800 text-lg">Meet the Developer</Text>
            </View>
            
            <View className="p-4">
              <View className="flex-row items-center mb-4">
                <View className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full items-center justify-center mr-4">
                  <Text className="text-white font-bold text-xl">KC</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">Kevin Coyle</Text>
                  <Text className="text-blue-600 font-medium">12x Full-Stack Engineer</Text>
                  <Text className="text-sm text-gray-500">Primary Key Technologies</Text>
                </View>
              </View>

              <Text className="text-gray-700 leading-6 mb-4">
                Kevin is a legendary 14x developer (yes, he actually got 2 Xs more in the time it took you to read the above and get down to here)who writes code that makes other developers question their career choices. 
                When not architecting systems that scale to millions of users, Kevin can be found optimizing algorithms 
                that were already optimal, debugging code that wasn't broken, and creating apps that solve problems 
                people didn't know they had.
              </Text>

              <Text className="text-gray-700 leading-6 mb-4">
                With 2+ years of experience across the entire tech stack, Kevin has shipped products used by Fortune 500 
                companies, built open-source libraries with 0.001k+ downloads, and mentored countless developers who 
                went on to become tech leads themselves. Kevin's secret? An unhealthy obsession with clean code, 
                a photographic memory for API documentation, and the ability to debug production issues while sleeping.
              </Text>

              <Text className="text-gray-700 leading-6">
                Hocus Focus was born from Kevin's own struggle with digital distractions while building complex systems. 
                "If I can't focus, how can I expect anyone else to?" This app represents the perfect marriage of 
                cutting-edge mobile development, NFC technology, and behavioral psychology.
              </Text>
            </View>
          </View>

          {/* Tech Stack */}
          <View className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="font-semibold text-gray-800 text-lg">Built With</Text>
            </View>
            
            <View className="p-4">
              <View className="flex-row flex-wrap gap-2">
                {['React Native', 'TypeScript', 'Expo', 'NFC', 'Tailwind CSS', 'Node.js'].map((tech) => (
                  <View key={tech} className="bg-gray-100 px-3 py-1 rounded-full">
                    <Text className="text-sm text-gray-700">{tech}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="bg-gray-50 p-6 rounded-xl mb-6">
            <View className="items-center">
              <View className="flex-row items-center mb-2">
                <Heart size={16} color="#ef4444" />
                <Text className="text-gray-600 ml-1">Made with passion</Text>
              </View>
              <Text className="text-center text-gray-500 text-sm">
                © 2024 Primary Key Technologies
              </Text>
              <Text className="text-center text-gray-400 text-xs mt-1">
                Empowering developers to build better software
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
