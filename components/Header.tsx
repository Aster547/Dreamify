import { View, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { useRouter } from 'expo-router';

import images from '../assets/images';

export default function Header() {
    const router = useRouter();

    return (
        <View className="w-full flex-row items-center justify-between pl-6 py-3 absolute">
            <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name="arrow-back" size={32} color="white"/>
            </TouchableOpacity>
            <Image source={images.logo} style={{ width: 200, height: 100 }} resizeMode="contain" />
        </View>
    );
}