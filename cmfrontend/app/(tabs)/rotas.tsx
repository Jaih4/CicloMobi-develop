import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { BlurView } from 'expo-blur';

export default function Rotas() {
    const router = useRouter();

    return (
        <ImageBackground
            source={require('../../assets/icons/icon.png')}
            style={styles.bg}
            resizeMode="cover"
        >
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Minhas Rotas</Text>

                {/* <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/rotas-favoritas')}>
                    <Ionicons name="heart" size={24} color={colors.textPrimary} />
                    <Text style={styles.cardText}>Rotas Favoritas</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/rotas/historico')}>
                    <Ionicons name="time" size={24} color={colors.textPrimary} />
                    <Text style={styles.cardText}>Histórico de Rotas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/rotas/nova-rota')}>
                    <Ionicons name="add-circle" size={24} color={colors.textPrimary} />
                    <Text style={styles.cardText}>Nova Rota</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/rotas-populares')}>
                    <Ionicons name="flame" size={24} color={colors.textPrimary} />
                    <Text style={styles.cardText}>Rotas Populares</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, justifyContent: 'center' },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,

    },
    title: {
        fontSize: 24,
        color: colors.textPrimary,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: colors.primary,
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    cardText: {
        fontSize: 16,
        color: colors.textPrimary,
        marginLeft: 12,
        flexShrink: 1,
    },
});
