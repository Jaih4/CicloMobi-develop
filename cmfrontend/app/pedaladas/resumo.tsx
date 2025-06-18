import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '@/services/api';

type Params = {
  tempo: string;
  distancia: string;
  pontos: string;
  rotaPercorrida?: string;
  rotaPlanejada?: string;
};

export default function ResumoPedalada() {
  const { tempo, distancia, pontos, rotaPercorrida, rotaPlanejada } = useLocalSearchParams<Params>();
  const router = useRouter();
  const [pedaladaSalva, setPedaladaSalva] = useState(false);
  const [rotaSalvaId, setRotaSalvaId] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nomeRota, setNomeRota] = useState('');
  const [descricaoRota, setDescricaoRota] = useState('');

  const solicitarSalvarRota = () => {
    setMostrarModal(true);
  };

  const rotaPerc = rotaPercorrida ? JSON.parse(rotaPercorrida) : [];
  const rotaPlan = rotaPlanejada ? JSON.parse(rotaPlanejada) : [];

  const salvarRota = async () => {
    try {
      const resp = await api.post('/rotas/criar/', {
        nome: nomeRota,
        descricao: descricaoRota,
        coordenadas: rotaPlan,
      });
      const { id } = resp.data;
      setRotaSalvaId(id);
      Alert.alert('Sucesso', 'Rota salva com sucesso!');
      setMostrarModal(false);
      setNomeRota('');
      setDescricaoRota('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a rota.');
    }
  };

  const salvarPedalada = async () => {
    if (!rotaSalvaId) {
      Alert.alert('Atenção', 'Você precisa salvar a rota antes de salvar a pedalada.');
      return;
    }

    Alert.alert('Salvar Pedalada', 'Deseja salvar esta pedalada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salvar',
        onPress: async () => {
          try {
            await api.post('/pedaladas/criar/', {
              rota: rotaSalvaId,
              tempo_total: tempo,
              distancia_percorrida: distancia,
              pontos_registrados: pontos,
              caminho: rotaPerc,
            });
            setPedaladaSalva(true);
            Alert.alert('Sucesso', 'Pedalada salva com sucesso!');
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao salvar pedalada.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="bicycle" size={64} color="#a264df" style={styles.icon} />
      <Text style={styles.titulo}>Resumo da Pedalada</Text>

      <View style={styles.caixaResumo}>
        <Text style={styles.label}>⏱️ Tempo total:</Text>
        <Text style={styles.valor}>{tempo}</Text>
        <Text style={styles.label}>📏 Distância percorrida:</Text>
        <Text style={styles.valor}>{distancia} km</Text>
        <Text style={styles.label}>📌 Pontos registrados:</Text>
        <Text style={styles.valor}>{pontos}</Text>
      </View>

      {/* Primeiro salve a rota */}
      {!rotaSalvaId && (
        <TouchableOpacity style={styles.botao} onPress={solicitarSalvarRota}>
          <Text style={styles.botaoTexto}>Salvar como Rota</Text>
        </TouchableOpacity>
      )}

      {/* Só habilita salvar pedalada após rota criada */}
      <TouchableOpacity
        style={[styles.botao, { opacity: rotaSalvaId ? 1 : 0.5 }]}
        onPress={salvarPedalada}
        disabled={!rotaSalvaId}
      >
        <Text style={styles.botaoTexto}>Salvar Pedalada</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { marginTop: 20 }]}
        onPress={() => router.push('/(tabs)/inicio')}
      >
        <Text style={styles.botaoTexto}>Voltar ao Início</Text>
      </TouchableOpacity>

      {/* Modal para digitar nome e descrição */}
      <Modal
        visible={mostrarModal}
        transparent
        animationType="slide"
        onRequestClose={() => setMostrarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Salvar Rota</Text>
            <TextInput
              placeholder="Nome da Rota"
              value={nomeRota}
              onChangeText={setNomeRota}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Descrição da Rota"
              value={descricaoRota}
              onChangeText={setDescricaoRota}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <Text style={styles.cancelar} onPress={() => setMostrarModal(false)}>Cancelar</Text>
              <Text style={styles.salvar} onPress={salvarRota}>Salvar</Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E6F',
    padding: 24,
  },
  icon: { marginBottom: 16 },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  caixaResumo: {
    backgroundColor: '#29297b',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 360,
    marginBottom: 24,
  },
  label: { fontSize: 16, color: '#bbb', marginTop: 12 },
  valor: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  botao: {
    backgroundColor: '#a264df',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelar: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  salvar: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
