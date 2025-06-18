import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import api from '../../services/api';

export default function Cadastro() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const cadastrar = async () => {
        if (!username || !email || !senha) {
            Toast.show({ type: 'error', text1: 'Preencha todos os campos!' });
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/usuarios/register/', {
                username,
                email,
                password: senha,
            });

            console.log('Cadastro bem-sucedido:', response.data);
            Toast.show({ type: 'success', text1: 'Usuário cadastrado com sucesso!' });

            setTimeout(() => {
                setLoading(false);
                router.replace('/usuarios/login');
            }, 1500);
        } catch (error: any) {
            console.error('Erro no cadastro:', error?.response?.data || error.message);

            const data = error?.response?.data;

            const erroMsg =
                data?.email?.[0] ||
                data?.username?.[0] ||
                data?.password?.[0] ||
                data?.detail ||
                'Erro ao cadastrar.';

            Toast.show({ type: 'error', text1: erroMsg });
            setLoading(false);
        }
        console.log('URL usada:', api.defaults.baseURL);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Criar Conta</Text>

            <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />

            <TouchableOpacity style={styles.botao} onPress={cadastrar} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#a264df" />
                ) : (
                    <Text style={styles.textoBotao}>Cadastrar</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/usuarios')}>
                <Text style={styles.voltarTexto}>Voltar para a tela inicial</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E6F',
        justifyContent: 'center',
        padding: 24,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#f0f0f2',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 15,
    },
    botao: {
        backgroundColor: '#a264df',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBotao: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    voltarTexto: {
        marginTop: 15,
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
