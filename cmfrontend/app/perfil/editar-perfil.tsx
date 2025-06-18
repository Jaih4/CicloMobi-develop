import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { colors } from '../../constants/colors';
import api from '@/services/api';

export default function EditarPerfil() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const resp = await api.get('/usuario/');
        setUsername(resp.data.username);
        setEmail(resp.data.email);
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  const handleSalvar = async () => {
    try {
      await api.put('/usuario/', { username, email });
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      router.back();
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/icons/icon.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={colors.textPrimary} />
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={colors.textPrimary} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSalvar}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'center' },
  container: {
    flexGrow: 1,
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
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: '90%',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
