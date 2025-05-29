import { useRouter } from 'expo-router';
import { TouchableOpacity, SafeAreaView, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#5E418F] justify-center items-center">
      <View className = 'w-full items-center justify-center'>
        <Text className='text-3xl font-bold text-white'>
          dreamify
        </Text>
        <TouchableOpacity
          className="w-4/5 mt-4 py-2 bg-white rounded-full items-center justify-center"
          onPress={() => router.navigate('/mainscreen')}
        >
          <Text className="text-black text-2xl font-bold">Get started</Text>
        </TouchableOpacity>      
      </View>
    </SafeAreaView>
  );
}