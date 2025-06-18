// app/pedaladas/em-tempo-real.tsx
// Importações principais do React e bibliotecas auxiliares
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { getDistance } from 'geolib';

export default function PedaladaTempoReal() {
    // Estado que armazena a última localização do usuário
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    // Array de coordenadas da rota que será traçada no mapa
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
    // Armazena o timestamp de quando a pedalada foi iniciada
    const [startTime, setStartTime] = useState<number | null>(null);
    // Tempo decorrido em segundos desde o início da pedalada
    const [elapsedTime, setElapsedTime] = useState(0);
    // Referência para o objeto que observa a posição
    const [watcher, setWatcher] = useState<Location.LocationSubscription | null>(null);
    // Referência para o mapa (pode ser usada para animações futuras)
    const [distanceTotal, setDistanceTotal] = useState(0);
    const [modoTesteManual, setModoTesteManual] = useState(false);
    const mapRef = useRef<MapView | null>(null);
    // Referência para o temporizador
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    // Roteador do Expo Router para navegação
    const router = useRouter();
    // Solicita permissão e obtém a localização inicial do usuário
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permissão de localização negada');
                return;
            }
            const current = await Location.getCurrentPositionAsync({});
            setLocation(current.coords);
        })();
    }, []);
    // Formata o tempo (segundos) em mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };
    // Inicia a pedalada: grava localização e tempo
    const iniciarPedalada = async () => {
        const start = Date.now();
        setStartTime(start);
        setElapsedTime(0);
        setDistanceTotal(0);
        setRouteCoordinates([]);
        // Inicia o rastreamento da posição em tempo real
        const locWatcher = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
            (loc) => {
                if (!modoTesteManual) {
                    const coords = loc.coords;
                    const newPoint = { latitude: coords.latitude, longitude: coords.longitude };

                    setRouteCoordinates((prev) => {
                        const updated = [...prev, newPoint];
                        if (prev.length > 0) {
                            const dist = getDistance(prev[prev.length - 1], newPoint);
                            setDistanceTotal((d) => d + dist);
                        }
                        return updated;
                    });

                    setLocation(coords);
                }
            }
        );
        setWatcher(locWatcher);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - start) / 1000));
        }, 1000);
    };

    const finalizarPedalada = () => {
        if (watcher) watcher.remove();
        if (timerRef.current) clearInterval(timerRef.current);
        setWatcher(null);
        setStartTime(null);

        // Redireciona para a tela de resumo com dados reais
        router.push({
            pathname: '/pedaladas/resumo',
            params: {
                tempo: formatTime(elapsedTime),
                distancia: (distanceTotal / 1000).toFixed(2),
                pontos: routeCoordinates.length.toString(),
            },
        });
    };
    // Clique manual no mapa: continua do último ponto traçado
    const handleManualPress = (e: any) => {
        if (!modoTesteManual) return;
        const newCoord = e.nativeEvent.coordinate;

        setRouteCoordinates((prev) => {
            const updated = [...prev, newCoord];
            if (prev.length > 0) {
                const dist = getDistance(prev[prev.length - 1], newCoord);
                setDistanceTotal((d) => d + dist);
            }
            return updated;
        });
    };

    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation={!modoTesteManual} // esconde ícone se modo teste estiver ativo
                    followsUserLocation={!modoTesteManual}
                    onPress={handleManualPress}
                >
                    <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="#a264df" />
                    {/* marcador aparece na última posição traçada */}
                    {routeCoordinates.length > 0 && (
                        <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="Último ponto" />
                    )}
                </MapView>
            )}

            <View style={styles.infoBox}>
                <Text style={styles.time}>⏱️ {formatTime(elapsedTime)}</Text>
                <Text style={styles.time}>📏 {(distanceTotal / 1000).toFixed(2)} km</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.button} onPress={iniciarPedalada}>
                    <Text style={styles.buttonText}>Iniciar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#d9534f' }]} onPress={finalizarPedalada}>
                    <Text style={styles.buttonText}>Finalizar</Text>
                </TouchableOpacity>
            </View>

            {/* Botão flutuante para alternar o modo teste manual */}
            <View
                style={{
                    position: 'absolute',
                    // 🔧 Altere aqui para mudar a posição do botão de modo teste:
                    top: 5, // 👉 ajuste vertical
                    left: 10, // 👉 ajuste horizontal (pode trocar por 'left')
                }}
            >
                <TouchableOpacity
                    onPress={() => setModoTesteManual(!modoTesteManual)}
                    style={{ backgroundColor: '#444', padding: 10, borderRadius: 10 }}
                >
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                        {modoTesteManual ? 'Desativar' : 'Modo Teste Manual'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    infoBox: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 10,
    },
    time: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#a264df',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
