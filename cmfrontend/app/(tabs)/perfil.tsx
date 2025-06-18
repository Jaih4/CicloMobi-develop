import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { colors } from '../../constants/colors';
import api from '@/services/api';
import { useAuth } from '../../context/AuthContext';

export default function Perfil() {
  const router = useRouter();
  const { accessToken } = useAuth(); // pega token do contexto
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return; // não busca se não tiver token
    }

    const fetchUsuario = async () => {
      try {
        const resp = await api.get('/usuarios/perfil', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(resp.data);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [accessToken]);

  const logout = async () => {
    try {
      await api.post('/logout/');
      router.replace('/'); // redireciona para login
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
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
        <Text style={styles.title}>Meu Perfil</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <View style={styles.card}>
              <Ionicons name="person-circle" size={32} color={colors.textPrimary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{user?.username ?? 'Usuário não encontrado'}</Text>
                <Text style={styles.cardText}>{user?.email ?? '-'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => router.push('/perfil/editar-perfil')}
            >
              <Ionicons name="create" size={24} color={colors.textPrimary} />
              <Text style={styles.cardText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { backgroundColor: '#ff4d4d' }]}
              activeOpacity={0.7}
              onPress={logout}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text style={[styles.cardText, { color: '#fff' }]}>Sair</Text>
            </TouchableOpacity>
          </>
        )}
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
  cardTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
    flexShrink: 1,
  },
});
