import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function SeguirRota() {
  const { tipo, id } = useLocalSearchParams();
  const [rota, setRota] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento dos dados da rota com base no tipo ou id
    const carregarRota = async () => {
      setLoading(true);

      // Aqui você pode substituir por chamada real na API, por exemplo:
      if (id) {
        // Buscar rota específica por id
        // const response = await api.get(`/rotas/${id}`);
        // setRota(response.data);
        setRota({ nome: `Rota específica ${id}`, descricao: 'Detalhes da rota...' });
      } else if (tipo) {
        // Buscar rotas pelo tipo (pessoal, favorita, popular)
        // const response = await api.get(`/rotas?tipo=${tipo}`);
        // setRota(response.data);
        setRota({ nome: `Rota do tipo ${tipo}`, descricao: 'Detalhes baseados no tipo...' });
      } else {
        setRota(null);
      }

      setLoading(false);
    };

    carregarRota();
  }, [tipo, id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#a264df" />
      </View>
    );
  }

  if (!rota) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Nenhuma rota encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{rota.nome}</Text>
      <Text style={styles.description}>{rota.descricao}</Text>
      {/* Aqui você coloca o mapa ou o componente para seguir a rota */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center' },
  text: { fontSize: 16, color: '#999' },
});
