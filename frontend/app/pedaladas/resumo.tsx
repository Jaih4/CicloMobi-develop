// app/pedaladas/resumo.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResumoPedalada() {
    const { tempo, distancia, pontos } = useLocalSearchParams();
    const router = useRouter();
    const [pedaladaSalva, setPedaladaSalva] = useState(false);

    const salvarPedalada = () => {
        Alert.alert('Salvar Pedalada', 'Deseja salvar esta pedalada?', [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Salvar',
                onPress: () => {
                    setPedaladaSalva(true);
                    // Aqui iria o envio para o backend (mock):
                    // api.post('/pedaladas/registrar/', { tempo, distancia, pontos })
                    Alert.alert('Sucesso', 'Pedalada salva com sucesso!');
                },
            },
        ]);
    };

    const salvarRota = () => {
        Alert.alert('Salvar como Rota', 'Deseja salvar esta rota para reutilizar depois?', [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Salvar',
                onPress: () => {
                    // Aqui iria o envio para o backend (mock):
                    // api.post('/rotas/criar/', { nome: 'Minha Rota', coordenadas })
                    Alert.alert('Sucesso', 'Rota salva com sucesso!');
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

            <TouchableOpacity style={styles.botao} onPress={salvarPedalada}>
                <Text style={styles.botaoTexto}>Salvar Pedalada</Text>
            </TouchableOpacity>

            {pedaladaSalva && (
                <TouchableOpacity style={[styles.botao, { backgroundColor: '#5fa264' }]} onPress={salvarRota}>
                    <Text style={styles.botaoTexto}>Salvar como Rota</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.botao, { marginTop: 20 }]} onPress={() => router.push('/(tabs)/inicio')}>
                <Text style={styles.botaoTexto}>Voltar ao Início</Text>
            </TouchableOpacity>
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
    icon: {
        marginBottom: 16,
    },
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
    label: {
        fontSize: 16,
        color: '#bbb',
        marginTop: 12,
    },
    valor: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    botao: {
        backgroundColor: '#a264df',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 10,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});