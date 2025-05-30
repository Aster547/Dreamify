import { useState } from 'react';
import React from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView
} from 'react-native';

export default function FloatingNoteButton({ onSave }: { onSave: (title: string, content: string, date: string, imageUrl?: string) => void }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (date: Date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear().toString().slice(-2);
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('All fields are required', 'Please fill in both the title and description before saving.');
            return;
        }
    
        setIsLoading(true); // Set loading at the start of the entire operation
    
        const saveWithRetry = async (retryCount = 0, maxRetries = 5): Promise<void> => {
            const currentDate = formatDate(new Date());
            
            try {
                // Try to generate an image
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
    
                const { url: imageUrl } = await apiResponse.json();
                
                // If URL is null or empty, retry
                if (!imageUrl) {
                    if (retryCount < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                        return saveWithRetry(retryCount + 1, maxRetries);
                    } else {
                        throw new Error('Max retries reached without getting a valid URL');
                    }
                }
                
                onSave(title, content, currentDate, imageUrl);
                setTitle('');
                setContent('');
                setModalVisible(false);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                
                if (retryCount < maxRetries && errorMessage !== 'Max retries reached without getting a valid URL') {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                    return saveWithRetry(retryCount + 1, maxRetries);
                } else {
                    console.error('Error generating image:', errorMessage);
                    onSave(title, content, currentDate);
                    setTitle('');
                    setContent('');
                    setModalVisible(false);
                    Alert.alert('Note saved', 'The image could not be generated, but your note was saved.');
                }
            }
        };
    
        try {
            await saveWithRetry();
        } finally {
            setIsLoading(false); // Only set loading to false when everything is completely done
        }
    };

    return (
        <>
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-16 h-16 bg-white rounded-2xl items-center justify-center shadow"
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ fontSize: 28, color: '#5E418F' }}>+</Text>
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add a Dream</Text>
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
                                onPress={() => setModalVisible(false)}
                                disabled={isLoading}
                            >
                                <Text style={styles.cancelButton}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#5E418F" />
                                ) : (
                                    <Text style={styles.saveButton}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingTop: '40%',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        minHeight: 400, // Increased modal height
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
        height: 200, // Increased height for description
        textAlignVertical: 'top', // Ensures text starts from the top
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
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
});