import { useState } from 'react';
import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  SafeAreaView, 
  View, 
  Text, 
  Image, 
  ImageBackground, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Modal,
  TextInput 
} from 'react-native';
import Header from '../../components/Header';
import ImageView from 'react-native-image-viewing';
import { MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'NOTES_KEY';

interface DreamNote {
  id: string | number;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
}

export default function DreamDetail() {
  const { id, title: initialTitle, content: initialContent, date: initialDate, imageUrl } = useLocalSearchParams();
  const imageUri = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  const [visible, setVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [title, setTitle] = useState(Array.isArray(initialTitle) ? initialTitle[0] : initialTitle);
  const [content, setContent] = useState(Array.isArray(initialContent) ? initialContent[0] : initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Dream",
      "Are you sure you want to delete this dream? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const savedNotes = await AsyncStorage.getItem(NOTES_KEY);
              let notes: DreamNote[] = savedNotes ? JSON.parse(savedNotes) : [];
              const dreamId = Array.isArray(id) ? id[0] : id;
              const updatedNotes = notes.filter((note: DreamNote) => note.id.toString() !== dreamId.toString());
              await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
              router.back();
            } catch (error) {
              console.error('Failed to delete note:', error);
              Alert.alert('Error', 'Failed to delete the dream. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('All fields are required', 'Please fill in both the title and description before saving.');
      return;
    }

    setIsLoading(true);
    const dreamId = Array.isArray(id) ? id[0] : id;
    const currentDate = formatDate(new Date());

    try {
      const titleChanged = title !== initialTitle;
      const contentChanged = content !== initialContent;
      
      let newImageUrl: string | null = imageUri;

      if (titleChanged || contentChanged) {
        const saveWithRetry = async (retryCount = 0, maxRetries = 5): Promise<string | null> => {
          try {
            const apiResponse = await fetch('https://nlpmpapi.vercel.app/generate_image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': '8ef3a619-e39b-464a-9cc5-5f42f7412dd8',
              },
              body: JSON.stringify({
                entry: `Title: ${title}. Description: ${content}`
              }),
            });

            if (!apiResponse.ok) {
              throw new Error('Image generation failed');
            }

            const { url: generatedUrl } = await apiResponse.json();
            
            if (!generatedUrl) {
              if (retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return saveWithRetry(retryCount + 1, maxRetries);
              } else {
                throw new Error('Max retries reached without getting a valid URL');
              }
            }
            
            return generatedUrl;
          } catch (error) {
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
              return saveWithRetry(retryCount + 1, maxRetries);
            }
            console.error('Error generating image:', error);
            return null;
          }
        };

        newImageUrl = await saveWithRetry();
      }

      const savedNotes = await AsyncStorage.getItem(NOTES_KEY);
      let notes = savedNotes ? JSON.parse(savedNotes) : [];
      
      const updatedNotes = notes.map((note : DreamNote) => {
        if (note.id.toString() === dreamId.toString()) {
          return { 
            ...note, 
            title,
            content,
            date: currentDate,
            imageUrl: newImageUrl || note.imageUrl
          };
        }
        return note;
      });
      
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
      
      router.replace({
        pathname: `../dream/${dreamId}`,
        params: {
          id: dreamId,
          title,
          content,
          date: currentDate,
          imageUrl: newImageUrl || imageUri
        }
      });
      
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'Failed to update the dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    
    const regenerateWithRetry = async (retryCount = 0, maxRetries = 5): Promise<string | null> => {
      try {
        const apiResponse = await fetch('https://nlpmpapi.vercel.app/generate_image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': '8ef3a619-e39b-464a-9cc5-5f42f7412dd8',
          },
          body: JSON.stringify({
            entry: `Title: ${title}. Description: ${content}`
          }),
        });

        if (!apiResponse.ok) {
          throw new Error('Image generation failed');
        }

        const { url: newImageUrl } = await apiResponse.json();
        
        if (!newImageUrl) {
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return regenerateWithRetry(retryCount + 1, maxRetries);
          }
          throw new Error('Max retries reached without getting a valid URL');
        }
        
        return newImageUrl;
      } catch (error) {
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return regenerateWithRetry(retryCount + 1, maxRetries);
        }
        console.error('Error regenerating image:', error);
        return null;
      }
    };

    try {
      const newImageUrl = await regenerateWithRetry();
      
      if (newImageUrl) {
        const savedNotes = await AsyncStorage.getItem(NOTES_KEY);
        let notes = savedNotes ? JSON.parse(savedNotes) : [];
        const dreamId = Array.isArray(id) ? id[0] : id;
        
        const updatedNotes = notes.map((note: DreamNote) => {
          if (note.id.toString() === dreamId.toString()) {
            return { ...note, imageUrl: newImageUrl };
          }
          return note;
        });
        
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
        
        router.replace({
          pathname: `../dream/${dreamId}`,
          params: {
            id: dreamId,
            title: title,
            content: content,
            date: initialDate,
            imageUrl: newImageUrl
          }
        });
      } else {
        Alert.alert('Error', 'Failed to regenerate image. Please try again later.');
      }
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <Header/>

      <SafeAreaView className="flex-1 bg-transparent">
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingVertical: 40
          }}
        >
          <View className="bg-white rounded-3xl p-6 w-4/5 my-4">
            <View className="mb-4">
              <Text className="text-center text-xl font-bold text-[#5E418F]">
                {title}
              </Text>
              {initialDate && (
                <Text className="text-center text-xs text-gray-500 mt-1">
                  Dream recorded on {initialDate}
                </Text>
              )}
            </View>

            <Text className="text-[#5E418F] font-bold mb-2">Description</Text>
            <Text className="text-[#333] mb-4">{content}</Text>

            <Text className="text-[#5E418F] font-bold mb-2">Dreamified</Text>
            <View className="h-48 bg-gray-200 rounded-xl items-center justify-center overflow-hidden mb-4">
              {imageUri ? (
                <>
                  {imageLoading && (
                    <ActivityIndicator size="large" color="#5E418F" />
                  )}
                  {!imageError ? (
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={() => setVisible(true)}
                      style={styles.touchable}
                    >
                      <Image 
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="cover"
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                        onError={() => {
                          setImageError(true);
                          setImageLoading(false);
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Text className="text-red-500 italic">Failed to load image</Text>
                  )}
                </>
              ) : (
                <Text className="text-[#999] italic">[Image placeholder]</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity 
                className="items-center justify-center bg-red-100 p-3 rounded-lg"
                onPress={handleDelete}
              >
                <MaterialIcons name="delete" size={24} color="#ef4444" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="items-center justify-center bg-blue-100 p-3 rounded-lg"
                onPress={handleEdit}
              >
                <Feather name="edit" size={24} color="#3b82f6" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="items-center justify-center bg-purple-100 p-3 rounded-lg"
                onPress={handleRegenerate}
                disabled={regenerating}
              >
                {regenerating ? (
                  <ActivityIndicator size="small" color="#5E418F" />
                ) : (
                  <AntDesign name="retweet" size={24} color="#5E418F" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Edit Modal */}
      <Modal animationType="slide" transparent={true} visible={editModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Dream</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Details"
              value={content}
              onChangeText={setContent}
              multiline
              style={styles.descriptionInput}
              textAlignVertical="top"
            />
            <View style={styles.buttonRow}>
            <TouchableOpacity 
              onPress={() => {
                setEditModalVisible(false);
                setTitle(Array.isArray(initialTitle) ? initialTitle[0] : initialTitle);
                setContent(Array.isArray(initialContent) ? initialContent[0] : initialContent);
              }}
              disabled={isLoading}
              style={[styles.button, styles.cancelButtonContainer]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleUpdate}
              disabled={isLoading}
              style={[styles.button, styles.saveButtonContainer]}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </Modal>

      {imageUri && !imageError && (
        <ImageView
          images={[{ uri: imageUri }]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setVisible(false)}
          backgroundColor="rgba(0, 0, 0, 0.9)"
          doubleTapToZoomEnabled={true}
          swipeToCloseEnabled={true}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5E418F',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    height: 200,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },

  cancelButton: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    color: '#5E418F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonContainer: {
    backgroundColor: '#f1f1f1',
  },
  saveButtonContainer: {
    backgroundColor: '#5E418F',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  
});
