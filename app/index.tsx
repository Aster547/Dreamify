import { useRouter } from 'expo-router';
import { TouchableOpacity, SafeAreaView, Text, View, Image } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#5E418F] justify-center items-center">
      <Image
        source={require('../assets/images/dreamify.png')}
        className="w-full absolute top-32"
        resizeMode="contain">
      </Image>  
      <TouchableOpacity
        className="w-4/5 mt-4 py-2 bg-white rounded-full items-center justify-center absolute bottom-72"
        onPress={() => router.navigate('/mainscreen')}
      >
        <Text className="text-[#361274] text-2xl font-bold">Get started</Text>
      </TouchableOpacity> 
      <Image
        source={require('../assets/images/moon.png')}
        className="w-full absolute bottom-0"
        resizeMode="contain">
      </Image>  
    </SafeAreaView>
  );
}