import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Inicio() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        // animação de fade-in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        const timeout = setTimeout(() => {
            if (isAuthenticated) {
                router.replace('../(tabs)/inicio');
            } else {
                router.replace('/usuarios');
            }
        }, 1000); // tempo de exibição do splash

        return () => clearTimeout(timeout);
    }, [isAuthenticated]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Text style={styles.logo}>CicloMobi</Text>
            <ActivityIndicator size="large" color="#fff" />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E1E6F', justifyContent: 'center', alignItems: 'center' },
    logo: { fontSize: 36, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
});
