import { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default function FloatingNoteButton({ onSave }: { onSave: (title: string, content: string) => void }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = () => {
        if (title && content) {
            onSave(title, content);
            setTitle('');
            setContent('');
            setModalVisible(false);
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
                            numberOfLines={4}
                            style={[styles.input, { height: 100 }]}
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButton}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave}>
                                <Text style={styles.saveButton}>Save</Text>
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
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
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
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        color: '#888',
        fontWeight: 'bold',
    },
    saveButton: {
        color: '#5E418F',
        fontWeight: 'bold',
    },
});
