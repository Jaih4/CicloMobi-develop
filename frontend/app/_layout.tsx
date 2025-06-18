import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/AuthContext'; // <-- importa o contexto

export default function Layout() {
    return (
        <AuthProvider>
            <Slot />
            <Toast />
        </AuthProvider>
    );
}
