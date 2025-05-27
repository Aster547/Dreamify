import { useRouter } from 'expo-router';
import { Button, SafeAreaView, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View>
        <Text className='text-3xl font-bold'>
          THIS IS THE START SCREEN 
        </Text>
        <Button title="Go to mainscreen" onPress={() => router.navigate('/mainscreen')}/>
      </View>
    </SafeAreaView>
  );}
