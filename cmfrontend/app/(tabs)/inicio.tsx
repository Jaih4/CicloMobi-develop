// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const API_KEY = '1d5da22be50ae8af1720d8c9376a501e';

export default function Inicio() {
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userName, setUserName] = useState<string>('Visitante');
  const router = useRouter();

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      const data = await response.json();
      if (data.cod === 200) setWeather(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização negada!');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      fetchWeather(loc.coords.latitude, loc.coords.longitude);

      const storedName = await AsyncStorage.getItem('userName');
      setUserName(storedName || 'Visitante');
    })();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/icons/icon.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay}>
        <Text style={styles.header}>{`Bem-vindo ao CicloMobi, ${userName}!`}</Text>

        {weather && (
          <View style={styles.weatherBox}>
            <Ionicons
              name={weather.weather[0].main === 'Clear' ? 'sunny' : 'cloudy'}
              size={30}
              color="#fff"
            />
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherText}>{`Local: ${weather.name}`}</Text>
              <Text style={styles.weatherText}>{`Temperatura: ${Math.round(weather.main.temp)}°C`}</Text>
              <Text style={styles.weatherText}>{`Descrição: ${weather.weather[0].description}`}</Text>
            </View>
          </View>
        )}

        {location && (
          <View style={styles.mapWrapper}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="Você está aqui"
                pinColor="#FF6B35"
              />
            </MapView>

            <TouchableOpacity
              style={styles.startButtonOnMap}
              onPress={() => router.push('/pedaladas')}
            >
              <Ionicons name="bicycle" size={20} color="#fff" />
              <Text style={styles.startText}>Iniciar Pedalada</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
  weatherBox: {
    backgroundColor: 'rgba(162, 0, 202, 0.1)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 7,
    alignItems: 'flex-start',
  },
  weatherDetails: { alignItems: 'flex-start' },
  weatherText: { fontSize: 14, color: '#fff' },
  mapWrapper: {
    width: '100%',
    height: height * 0.59,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 25,
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  startButtonOnMap: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#a264df',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 6,
  },
  startText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});
