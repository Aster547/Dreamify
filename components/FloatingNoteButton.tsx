import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function FloatingNoteButton({ onSubmit }: { onSubmit?: (title: string, details: string) => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const handleSave = () => {
    if (onSubmit) onSubmit(title, details);
    setTitle('');
    setDetails('');
    setModalVisible(false);
  };

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 w-16 h-16 bg-white rounded-2xl shadow-lg items-center justify-center"
      >
        <AntDesign name="plus" size={32} color="#4B2775" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-transparent justify-center items-center">
          <View className="w-11/12 bg-white p-5 rounded-2xl shadow-md">
            <Text className="text-lg font-semibold mb-2 text-purple-900">Add New Note</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 mb-3"
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="border border-gray-300 rounded-md p-2 h-24 text-start"
              placeholder="Details"
              multiline
              numberOfLines={4}
              value={details}
              onChangeText={setDetails}
            />
            <View className="flex-row justify-end space-x-2 mt-4">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text className="text-purple-800 font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
