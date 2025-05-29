import { useRouter } from 'expo-router';
import { TouchableOpacity, SafeAreaView, Text, View, Image } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#5E418F]">
      <Image
        source={require('../assets/images/dreamify.png')}
        className="w-full"
        resizeMode="contain">
      </Image>  
      <TouchableOpacity
        className=" bottom-72 mt-4 w-4/5 items-center justify-center rounded-full bg-white py-2"
        onPress={() => router.navigate('/mainscreen')}
      >
        <Text className="text-2xl font-bold text-[#361274]">Get started</Text>
      </TouchableOpacity> 
      <Image
        source={require('../assets/images/moon.png')}
        className="absolute bottom-0 w-full"
        resizeMode="contain">
      </Image>  
    </SafeAreaView>
  );
}