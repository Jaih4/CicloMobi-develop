// app/pedaladas/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function EscolherTipoPedalada() {
    const router = useRouter();

    const opcoes = [
        { label: 'Iniciar nova rota', icon: 'bicycle', path: '/pedaladas/em-tempo-real' },
        { label: 'Iniciar rota favorita', icon: 'heart', path: '/pedaladas/seguir?tipo=favorita' },
        { label: 'Iniciar rota personalizada', icon: 'map', path: '/pedaladas/personalizar' },
        { label: 'Iniciar rota já feita', icon: 'time', path: '/pedaladas/seguir?tipo=pessoal' },
        { label: 'Iniciar rota popular', icon: 'flame', path: '/pedaladas/seguir?tipo=popular' },
    ];

    return (
        <ImageBackground
            source={require('../../assets/icons/icon.png')}
            style={styles.bg}
            resizeMode="cover"
        >
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <ScrollView contentContainerStyle={styles.container}>
                {/* Botão de Voltar */}
                <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push('/(tabs)/inicio')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.textoVoltar}>Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Escolha o tipo de pedalada</Text>

                {opcoes.map((opcao, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => router.push(opcao.path as any)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name={opcao.icon as any} size={24} color="#fff" />
                        <Text style={styles.buttonText}>{opcao.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1 },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        width: '90%',
        backgroundColor: '#a264df',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 18,
        borderRadius: 12,
        marginBottom: 16,
    },
    buttonText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    botaoVoltar: {
        position: 'absolute',
        top: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        zIndex: 10,
    },
    textoVoltar: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: 'bold',
    },
});