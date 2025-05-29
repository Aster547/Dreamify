import { useRouter } from 'expo-router';
import { TouchableOpacity, SafeAreaView, Text, Image, ImageBackground } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/background.png')} 
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 items-center bg-transparent relative">
        <Image
          source={require('../assets/images/dreamify.png')}
          className="w-full mt-8"
          resizeMode="contain"
        />
        <TouchableOpacity
          className="w-4/5 py-4 mt-44 bg-white rounded-full items-center justify-center"
          onPress={() => router.push('/mainscreen')}
          style={{ zIndex: 1 }}
        >
          <Text className="text-[#361274] text-2xl font-bold">Get started</Text>
        </TouchableOpacity>
        <Image
          source={require('../assets/images/moon.png')}
          className="w-full absolute bottom-0"
          resizeMode="contain"
          style={{ zIndex: 0 }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}