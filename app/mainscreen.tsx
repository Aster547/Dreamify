import { useRouter } from 'expo-router';
import { SafeAreaView, View, Image } from 'react-native';
import images from '../assets/images';
import FloatingNoteButton from '../components/FloatingNoteButton'; // 👈 Import your component

export default function Index() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#5E418F] relative"> {/* 👈 Add relative so absolute positioning works */}
            {/* Top-right image */}
            <View className="w-full items-end px-4 pt-6">
                <Image
                    source={images.logo}
                    style={{ width: 200, height: 100 }}
                    resizeMode="contain"
                />
            </View>

            {/* Other content here... */}

            {/* Floating note button in bottom-right */}
            <FloatingNoteButton />
        </SafeAreaView>
    );
}
