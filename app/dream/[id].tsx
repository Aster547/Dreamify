import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Header from '../../components/Header'

export default function DreamDetail() {
  const { title, content } = useLocalSearchParams();  

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')} // Use your local image here
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <Header/>

      <SafeAreaView className="flex-1 bg-transparent px-4 pt-6 items-center mt-40">
        <View className="bg-white rounded-3xl p-6 w-4/5">
          <Text className="text-center text-xl font-bold text-[#5E418F] mb-4">{title}</Text>

          <Text className="text-[#5E418F] font-bold mb-2">Description</Text>
          <Text className="text-[#333] mb-4">{content}</Text>

          <Text className="text-[#5E418F] font-bold mb-2">Dreamified</Text>
        <View className="h-48 bg-gray-200 rounded-xl items-center justify-center">
              <Text className="text-[#999] italic">[Image placeholder]</Text>
              </View>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
