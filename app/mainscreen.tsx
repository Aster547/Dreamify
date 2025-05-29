import { useRouter } from 'expo-router';
import { SafeAreaView, View, Image, Text, FlatList, Pressable, ImageBackground } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import images from '../assets/images';
import FloatingNoteButton from '../components/FloatingNoteButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'NOTES_KEY';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        try {
          const saved = await AsyncStorage.getItem(NOTES_KEY);
          if (saved) setNotes(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load notes', e);
        }
      };
      loadNotes();
    }, [])
  );

  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      } catch (e) {
        console.error('Failed to save notes', e);
      }
    };
    saveNotes();
  }, [notes]);

  const addNote = (title: string, content: string, date: string, imageUrl?: string) => {
    setNotes(prev => [...prev, { 
      id: Date.now().toString(), 
      title, 
      content,
      date,
      imageUrl 
    }]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
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
                params: { 
                  id: item.id, 
                  title: item.title, 
                  content: item.content,
                  date: item.date,
                  imageUrl: item.imageUrl || '' 
                },
              })}
            >
              <View className="bg-white rounded-2xl p-4 mb-4 shadow">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[#5E418F] font-bold text-lg">{item.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text className="text-gray-500 text-xs mr-2">{item.date}</Text>
                    <Pressable onPress={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent Pressable
                      deleteNote(item.id);
                    }}>
                      <Ionicons name="trash-outline" size={24} color="#5E418F" />
                    </Pressable>
                  </View>
                </View>
                <Text className="text-[#333] mt-1" numberOfLines={3}>
                  {item.content}
                </Text>
                {item.imageUrl && (
                  <View className="mt-2">
                    <Image 
                      source={{ uri: item.imageUrl }}
                      style={{ width: '100%', height: 150, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>
            </Pressable>
          )}
        />

        <FloatingNoteButton 
          onSave={(title, content, date, imageUrl) => addNote(title, content, date, imageUrl)} 
        />
      </SafeAreaView>
    </ImageBackground>
  );
}