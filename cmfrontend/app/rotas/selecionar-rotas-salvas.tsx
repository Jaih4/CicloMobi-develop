import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Rota {
  id: string;
  nome: string;
  descricao?: string;
}

interface Props {
  rotas: Rota[];
  onSelecionar: (rota: Rota) => void;
}

export default function SelecionarRotaSalva({ rotas, onSelecionar }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rotas Salvas</Text>

      <FlatList
        data={rotas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => onSelecionar(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="map" size={24} color="#fff" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              {item.descricao ? <Text style={styles.descricao}>{item.descricao}</Text> : null}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma rota salva encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#a264df',
    borderRadius: 12,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7a3fc1',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  nome: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  descricao: {
    color: '#ddd',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#eee',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
