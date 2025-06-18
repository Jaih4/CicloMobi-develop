import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function Configuracoes() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair da conta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    onPress: async () => {
                        await logout();
                        router.replace('/usuarios/login');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ImageBackground
            source={require('../../assets/icons/icon.png')}
            style={styles.bg}
            resizeMode="cover"
        >
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.overlay}>
                <Text style={styles.title}>Configurações</Text>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );

}

const styles = StyleSheet.create({
    bg: { flex: 1, justifyContent: 'center' },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 40,
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#a264df',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
    },
});
