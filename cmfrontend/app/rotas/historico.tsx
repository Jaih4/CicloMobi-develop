// app/rotas/historico.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/services/api';
import { colors } from '../../constants/colors';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

interface Coordenada {
  latitude: string;
  longitude: string;
}

interface Rota {
  id: number;
  nome: string;
  descricao: string;
  coordenadas?: Coordenada[];
}

export default function HistoricoRotas() {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  

  useEffect(() => {
    const carregarRotas = async () => {
      try {
        const response = await api.get('/rotas/listar');
        setRotas(response.data);
      } catch (error) {
        console.error('Erro ao carregar rotas:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarRotas();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/icons/icon.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando rotas...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/icons/icon.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Histórico de Rotas</Text>
        {rotas.map((rota) => (
          <View key={rota.id} style={styles.card}>
            <Ionicons name="map" size={24} color={colors.textPrimary} />
            <View style={styles.cardContent}>
              <Text style={styles.nome}>{rota.nome}</Text>
              <Text style={styles.descricao}>{rota.descricao}</Text>
              {rota.coordenadas && rota.coordenadas.length > 0 && (
                <Text style={styles.detalhes}>
                  📍 Ponto: Latitude: {rota.coordenadas[0].latitude}, Longitude: {rota.coordenadas[0].longitude}
                </Text>
              )}
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push('/(tabs)/inicio')}>
          <Text style={styles.textoBotaoVoltar}>Voltar para o Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  nome: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    color: colors.textSecondary || '#ccc',
  },
  detalhes: {
    fontSize: 13,
    color: colors.textSecondary || '#bbb',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  loadingText: {
    marginTop: 10,
    color: colors.primary,
  },
  botaoVoltar: {
  backgroundColor: '#fff',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginTop: 20,
  alignSelf: 'center',
},
textoBotaoVoltar: {
  color: colors.primary,
  fontSize: 16,
  fontWeight: 'bold',
},

});
