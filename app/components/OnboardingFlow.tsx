import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  ChevronRight,
  Check,
  Shield,
  Clock,
  Smartphone,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingFlowProps {
  onComplete?: () => void;
  initialStep?: number;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete = () => {},
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const steps: OnboardingStep[] = [
    {
      title: "Welcome to Focus Mode",
      description:
        "This app helps you stay focused by blocking distracting apps when you tap your iPhone against an NFC tag.",
      icon: <Shield size={48} color="#3b82f6" />,
    },
    {
      title: "Screen Time Permissions",
      description:
        "We'll need access to Screen Time to block distracting apps. This permission is required for the app to function.",
      icon: <Smartphone size={48} color="#3b82f6" />,
    },
    {
      title: "Register Your NFC Tag",
      description:
        "Tap your iPhone against an NFC tag to register it. This tag will be your physical key to toggle focus mode.",
      icon: (
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1628815113969-0487917fc6a1?w=400&q=80",
          }}
          style={{ width: 48, height: 48, borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Select Apps to Block",
      description:
        "Choose which apps you want to block during focus mode. You can always change this selection later.",
      icon: <Clock size={48} color="#3b82f6" />,
    },
    {
      title: "You're All Set!",
      description:
        "Tap your NFC tag to enter focus mode and block distractions. Tap again to exit focus mode.",
      icon: <Check size={48} color="#22c55e" />,
    },
  ];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete();
  };

  const renderProgressDots = () => {
    return (
      <View className="flex-row justify-center mt-8 space-x-2">
        {steps.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentStep ? "bg-blue-500" : "bg-gray-300"}`}
          />
        ))}
      </View>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <View className="flex-1 bg-white p-6 justify-between">
      {/* Header */}
      <View className="items-end">
        <TouchableOpacity onPress={handleSkip} className="py-2 px-4">
          <Text className="text-blue-500 font-medium">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-blue-100 p-6 rounded-full mb-8">
          {currentStepData.icon}
        </View>

        <Text className="text-2xl font-bold text-center mb-4">
          {currentStepData.title}
        </Text>

        <Text className="text-base text-gray-600 text-center mb-8">
          {currentStepData.description}
        </Text>

        {renderProgressDots()}
      </View>

      {/* Footer */}
      <View className="mt-8">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-500 py-4 px-6 rounded-xl flex-row justify-center items-center"
        >
          <Text className="text-white font-semibold text-lg mr-2">
            {currentStep < steps.length - 1 ? "Continue" : "Get Started"}
          </Text>
          {currentStep < steps.length - 1 && (
            <ChevronRight size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingFlow;
