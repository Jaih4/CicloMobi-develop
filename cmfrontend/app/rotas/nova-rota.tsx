// app/rotas/nova-rota.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { colors } from '../../constants/colors';

export default function NovaRota() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [coordenadas, setCoordenadas] = useState<{ latitude: string; longitude: string } | null>(null);

  const router = useRouter();

  const buscarCoordenadas = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`
      );
      const data = await response.json();

      if (data.length === 0) {
        Alert.alert('Endereço não encontrado');
        return;
      }

      setCoordenadas({
        latitude: data[0].lat,
        longitude: data[0].lon,
      });

      Alert.alert('Endereço encontrado com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      Alert.alert('Erro ao buscar endereço');
    }
  };

  const salvarRota = async () => {
    if (!nome || !descricao || !coordenadas) {
      Alert.alert('Preencha todos os campos e busque o endereço');
      return;
    }

    try {
      const response = await api.post('/rotas/criar/', {
        nome,
        descricao,
        coordenadas: [coordenadas],
      });

      Alert.alert('Sucesso', 'Rota salva com sucesso!');
      router.push('/rotas/historico'); // Voltar ao histórico de rotas
    } catch (error) {
      console.error('Erro ao salvar rota:', error);
      Alert.alert('Erro', 'Não foi possível salvar a rota');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.bg}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar Nova Rota</Text>

        <TextInput
          placeholder="Nome da Rota"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TextInput
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TextInput
          placeholder="Endereço"
          value={endereco}
          onChangeText={setEndereco}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={buscarCoordenadas}>
          <Text style={styles.buttonText}>Buscar Endereço</Text>
        </TouchableOpacity>

        {coordenadas && (
          <Text style={styles.detalhes}>
            📍 Coordenadas: Latitude {coordenadas.latitude}, Longitude {coordenadas.longitude}
          </Text>
        )}

        <TouchableOpacity style={styles.buttonSalvar} onPress={salvarRota}>
          <Text style={styles.buttonText}>Salvar Rota</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push('/(tabs)/inicio')}>
          <Text style={styles.textoBotaoVoltar}>Voltar para o Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.inputBackground,
    color: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSalvar: {
    backgroundColor: '#34d399',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detalhes: {
    marginTop: 10,
    color: '#ccc',
    textAlign: 'center',
  },
  botaoVoltar: {
    backgroundColor: colors.textSecondary || '#888',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  textoBotaoVoltar: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
