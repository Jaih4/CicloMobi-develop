import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface AuthContextProps {
    isAuthenticated: boolean;
    accessToken: string | null;
    userName: string | null;
    login: (token: string, refresh: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    accessToken: null,
    userName: null,
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const loadFromStorage = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            const username = await AsyncStorage.getItem('userName');
            if (token && username) {
                setAccessToken(token);
                setUserName(username);
            }
        };
        loadFromStorage();
    }, []);

    const login = async (token: string, refresh: string, username: string) => {
        await AsyncStorage.setItem('accessToken', token);
        await AsyncStorage.setItem('refreshToken', refresh);
        await AsyncStorage.setItem('userName', username);
        setAccessToken(token);
        setUserName(username);
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setAccessToken(null);
        setUserName(null);
        Alert.alert('Logout', 'Você saiu da sua conta.');
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!accessToken,
                accessToken,
                userName,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
