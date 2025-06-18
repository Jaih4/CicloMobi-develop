import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('accessToken');
            console.log('Token atual no AsyncStorage:', token);
        })();
    }, []);

    const logar = async () => {
        if (!username || !senha) {
            Toast.show({ type: 'error', text1: 'Preencha todos os campos!' });
            return;
        }

        try {
            const response = await api.post('/token/', {
                username: username.trim(),
                password: senha,
            });

            const { access, refresh } = response.data;

            await login(access, refresh, username.trim());

            Toast.show({ type: 'success', text1: 'Login realizado com sucesso!' });

            setTimeout(() => {
                router.replace('../(tabs)/inicio'); // Corrigido para funcionar com expo-router
            }, 1500);
        } catch (error: any) {
            console.error('Erro no login:', error);
            const erroMsg =
                error?.response?.data?.detail ||
                'Erro ao realizar login. Verifique o nome de usuário e senha.';

            Toast.show({ type: 'error', text1: erroMsg });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Entrar</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />

            <TouchableOpacity style={styles.botao} onPress={logar}>
                <Text style={styles.textoBotao}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/usuarios')}>
                <Text style={styles.voltarTexto}>Voltar para a tela inicial</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E1E6F', justifyContent: 'center', padding: 24 },
    titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 30 },
    input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 15 },
    botao: { backgroundColor: '#a264df', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    textoBotao: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
    voltarTexto: {
        marginTop: 15,
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
