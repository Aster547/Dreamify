// app/dream/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View, Text } from 'react-native';

export default function DreamDetail() {
  const { title, content } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-[#5E418F] px-4 pt-6">
      <View className="bg-white rounded-3xl p-6">
        <Text className="text-center text-xl font-bold text-[#5E418F] mb-4">{title}</Text>

        <Text className="text-[#5E418F] font-bold mb-2">Description</Text>
        <Text className="text-[#333] mb-4">{content}</Text>

        <Text className="text-[#5E418F] font-bold mb-2">Dreamified</Text>
        <View className="h-48 bg-gray-200 rounded-xl items-center justify-center">
          <Text className="text-[#999] italic">[Image placeholder]</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
