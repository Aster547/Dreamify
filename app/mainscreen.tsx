import { useRouter } from 'expo-router';
import { SafeAreaView, View, Image, Text, FlatList, Pressable, ImageBackground, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import images from '../assets/images';
import FloatingNoteButton from '../components/FloatingNoteButton';

export default function Index() {
  const [notes, setNotes] = useState<{ id: string; title: string; content: string }[]>([]);
  const router = useRouter();

  const addNote = (title: string, content: string) => {
    setNotes(prev => [...prev, { id: Date.now().toString(), title, content }]);
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.png')} // Use your local image here
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 bg-transparent relative px-4 pt-6">
        <View className="w-full items-end">
          <Image source={images.logo} style={{ width: 200, height: 100 }} resizeMode="contain" />
        </View>

        <Text className="text-white text-2xl font-bold mb-4">Your Dreams</Text>

        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({
                pathname: '/dream/[id]',
                params: { id: item.id, title: item.title, content: item.content },
              })}
            >
              <View className="bg-white rounded-2xl p-4 mb-4 shadow">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[#5E418F] font-bold text-lg">{item.title}</Text>
                  <Text className="text-[#5E418F] text-xl">↗</Text>
                </View>
                <Text className="text-[#333] mt-1" numberOfLines={3}>
                  {item.content}
                </Text>
              </View>
            </Pressable>
          )}
        />

        <FloatingNoteButton onSave={addNote} />
      </SafeAreaView>
    </ImageBackground>
  );
}
