// auth.context.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { clearSession, getSession, getUser, saveSession, saveUser } from '../services/auth.service';

type User = any; // Define tu tipo de usuario aquí

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData?: User) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    async function checkSession() {
        try {
            const hasSession = await getSession();
            const userData = await getUser();

            setIsAuthenticated(hasSession);
            setUser(userData);
        } catch (error) {
            console.error('Error checking session:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }

    async function login(userData?: User) {
        await saveSession();
        if (userData) {
            await saveUser(userData);
            setUser(userData);
        }
        setIsAuthenticated(true);
    }

    async function logout() {
        await clearSession();
        setIsAuthenticated(false);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}