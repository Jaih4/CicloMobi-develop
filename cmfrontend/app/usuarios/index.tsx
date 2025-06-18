import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EscolhaInicial() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Ionicons name="bicycle" size={60} color="#a264df" style={{ marginBottom: 20 }} />
            <Text style={styles.title}>Bem-vindo ao CicloMobi!</Text>
            <Text style={styles.subtitle}>Escolha uma opção para continuar</Text>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/usuarios/login')}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/usuarios/cadastro')}>
                <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E6F',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#a264df',
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderRadius: 10,
        marginBottom: 16,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
