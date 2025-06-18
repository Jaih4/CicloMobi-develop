import axios from 'axios';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';

// ================== CONFIGURAÇÕES ==================

const LOCAL_PORT = '8002';
const PC_WIFI_IP = '172.27.6.120'; // IP da máquina na rede local
const WSL_IP = '172.24.124.48';      // IP interno do WSL (somente visível do host)

// ================== DEFINIÇÃO DE BASE IP ==================

// EXPO GO em celular físico => usa o IP da rede local
// Emulador Android Studio => pode usar 10.0.2.2
// Ambiente web => localhost

let baseIP: string;

if (Platform.OS === 'web') {
  baseIP = 'localhost';
} else if (Constants.appOwnership === 'expo') {
  // Expo Go rodando no celular físico
  baseIP = PC_WIFI_IP;
} else {
  // fallback seguro para emulador local ou WSL
  const debugHost = Constants.manifest?.debuggerHost?.split(':')[0];
  baseIP = debugHost ?? WSL_IP;
}

// ================== INSTÂNCIA AXIOS ==================

const api = axios.create({
  baseURL: `http://${baseIP}:${LOCAL_PORT}/api`,
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================== INTERCEPTORS ==================

api.interceptors.request.use(
  async (config) => {
    const token = null; // substitua com lógica de token se tiver auth
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;

    if (status === 401) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
    } else if (status >= 500) {
      Alert.alert('Erro no servidor', 'Tente novamente mais tarde.');
    } else if (status === 400 && detail) {
      Alert.alert('Erro de validação', detail);
    }

    return Promise.reject(error);
  }
);

export default api;
