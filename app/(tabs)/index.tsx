import { Image } from 'expo-image';
import { Platform, StyleSheet, SafeAreaView, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <SafeAreaView className='justify-center items-center'>
      <View>
        <Text className='text-3xl font-bold'>
          hi
        </Text>
      </View>
    </SafeAreaView>
  );
}
