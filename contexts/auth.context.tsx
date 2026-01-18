// contexts/auth.context.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { User } from '../interfaces/user.interface';
import * as authService from '../services/auth.service';

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const hasSession = await authService.verifySession();
            const userData = await authService.getUser();

            setIsAuthenticated(hasSession);
            setUser(userData);
        } catch (error) {
            console.error('Error checking auth:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        setLoading(true);
        try {
            const response = await authService.login(email, password);

            const userData: User = {
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                createdAt: new Date().toISOString(),
            };

            await authService.saveUser(userData);
            setIsAuthenticated(true);
            setUser(userData);

            Alert.alert('Éxito', 'Inicio de sesión exitoso');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo iniciar sesión');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function register(name: string, email: string, password: string) {
        setLoading(true);
        try {
            const response = await authService.register(name, email, password);

            // Hacer login automáticamente después del registro
            await login(email, password);

            Alert.alert('Éxito', response.message || 'Cuenta creada exitosamente');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await authService.logout();
            setIsAuthenticated(false);
            setUser(null);
            Alert.alert('Éxito', 'Sesión cerrada');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout,
            register,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);