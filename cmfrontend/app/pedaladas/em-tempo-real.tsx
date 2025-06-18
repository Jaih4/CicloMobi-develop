// app/pedaladas/em-tempo-real.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { getDistance } from 'geolib';
import polyline from '@mapbox/polyline';
import 'react-native-get-random-values';

interface Coordenada { latitude: number; longitude: number; }

const decodePolyline = (encoded: string): Coordenada[] => {
  const points = polyline.decode(encoded);
  return points.map(([lat, lng]: number[]) => ({ latitude: lat, longitude: lng }));
};

export default function PedaladaTempoReal() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [plannedRoute, setPlannedRoute] = useState<Coordenada[]>([]);
  const [rideRoute, setRideRoute] = useState<Coordenada[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [watcher, setWatcher] = useState<Location.LocationSubscription | null>(null);
  const [distanceTotal, setDistanceTotal] = useState(0);
  const [destino, setDestino] = useState<Coordenada | null>(null);
  const [modoTesteManual, setModoTesteManual] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos da sua permissão de localização.');
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
      mapRef.current?.animateToRegion({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const formatTime = useCallback((sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, []);

  const tracarRotaParaDestino = async (origem: Coordenada, destino: Coordenada) => {
    const apiKey = process.env.EXPO_PUBLIC_Maps_API_KEY;
    if (!apiKey) { Alert.alert('Erro de Configuração', 'Chave da API não encontrada.'); return; }
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origem.latitude},${origem.longitude}&destination=${destino.latitude},${destino.longitude}&key=${apiKey}&mode=bicycling`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.routes?.length) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setPlannedRoute(points);
        mapRef.current?.fitToCoordinates(points, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true });
      } else {
        Alert.alert('Rota não encontrada'); setPlannedRoute([]);
      }
    } catch (e) {
      console.error(e); Alert.alert('Erro ao traçar rota'); setPlannedRoute([]);
    }
  };

  // Adiciona ponto manualmente ao clicar
  const adicionarPonto = () => {
    if (!location) return;
    const pt: Coordenada = { latitude: location.latitude, longitude: location.longitude };
    setRideRoute(prev => {
      if (prev.length) {
        const dist = getDistance(prev[prev.length - 1], pt);
        setDistanceTotal(d => d + dist);
      }
      return [...prev, pt];
    });
  };

  const iniciarPedalada = async () => {
    if (startTime) return;
    const start = Date.now();
    setStartTime(start);
    setElapsedTime(0);
    setDistanceTotal(0);
    setRideRoute([]); // limpa rota anterior

    const sub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
      loc => {
        // Apenas atualiza localização e campo de tempo, não adiciona pontos
        setLocation(loc.coords);
        mapRef.current?.animateToRegion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      }
    );
    setWatcher(sub);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsedTime(prev => Math.floor((Date.now() - start) / 1000)), 1000);
  };

  const finalizarPedalada = () => {
    if (!startTime) return;
    watcher?.remove();
    timerRef.current && clearInterval(timerRef.current);
    router.push({
        pathname: '/pedaladas/resumo',
        params: {
            tempo: formatTime(elapsedTime),
            distancia: (distanceTotal / 1000).toFixed(2),
            pontos: String(rideRoute.length),
            rotaPercorrida: JSON.stringify(rideRoute),
            rotaPlanejada: JSON.stringify(plannedRoute),
        },
    });
    setWatcher(null);
    setStartTime(null);
  };

  return (
    <View style={styles.container}>
      {location && (
        <>
          <GooglePlacesAutocomplete
            placeholder="Buscar endereço"
            fetchDetails
            minLength={2}
            debounce={200}
            nearbyPlacesAPI="GooglePlacesSearch"
            keyboardShouldPersistTaps="handled"
            textInputProps={{ selectTextOnFocus: true }}
            onFail={e => console.error(e)}
            onNotFound={() => console.warn('Nenhum resultado')}
            query={{ key: process.env.EXPO_PUBLIC_Maps_API_KEY!, language: 'pt-BR' }}
            predefinedPlaces={[]}
            enablePoweredByContainer={false}
            styles={{
              container: { position: 'absolute', top: 80, width: '90%', alignSelf: 'center', zIndex: 1000 },
              textInputContainer: { backgroundColor: '#fff', borderTopWidth: 0, borderBottomWidth: 0, borderRadius: 10 },
              textInput: { height: 44, fontSize: 16, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10 },
              listView: { backgroundColor: '#fff', position: 'absolute', top: 44, width: '100%' },
            }}
            onPress={(data, details = null) => {
              if (details?.geometry?.location) {
                const dest = { latitude: details.geometry.location.lat, longitude: details.geometry.location.lng };
                setDestino(dest);
                tracarRotaParaDestino(location, dest);
              }
            }}
          />
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
            showsUserLocation={!modoTesteManual}
            followsUserLocation={!modoTesteManual && !startTime}
          >
            {plannedRoute.length > 0 && <Polyline coordinates={plannedRoute} strokeWidth={3} strokeColor="rgba(200,200,200,0.8)" />}
            {rideRoute.length > 0 && <Polyline coordinates={rideRoute} strokeWidth={4} strokeColor="#a264df" />}
            {rideRoute.length > 0 && <Marker coordinate={rideRoute[rideRoute.length - 1]} title="Ponto Atual" pinColor="#a264df" />}
            {destino && <Marker coordinate={destino} title="Destino" pinColor="green" />}
          </MapView>
        </>
      )}

      <View style={styles.controls}>
        {!startTime ? (
          <TouchableOpacity style={styles.button} onPress={iniciarPedalada}><Text style={styles.buttonText}>Iniciar</Text></TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, { backgroundColor: '#d9534f' }]} onPress={finalizarPedalada}><Text style={styles.buttonText}>Finalizar</Text></TouchableOpacity>
        )}
        {startTime && (
          <TouchableOpacity style={[styles.button, { backgroundColor: '#5cb85c' }]} onPress={adicionarPonto}><Text style={styles.buttonText}>Adicionar Ponto</Text></TouchableOpacity>
        )}
      </View>

      <View style={[styles.infoBox, { zIndex: 900, elevation: 900 }]}>  
        <Text style={styles.time}>⏱️ {formatTime(elapsedTime)}</Text>
        <Text style={styles.time}>📏 {(distanceTotal / 1000).toFixed(2)} km</Text>
        <Text style={styles.time}>📍 {rideRoute.length} pontos</Text>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: { position: 'absolute', bottom: 80, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', zIndex: 900 },
  button: { backgroundColor: '#a264df', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, elevation: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  infoBox: { position: 'absolute', top: 160, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 10 },
  time: { fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
