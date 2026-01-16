import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../interfaces/user.interface';
import { clearSession, getSession, getUser, saveSession, saveUser } from '../services/auth.service';

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User) => Promise<void>;
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

    async function login(userData: User) {
        await saveSession();
        await saveUser(userData);
        setIsAuthenticated(true);
        setUser(userData);
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

export const useAuth = () => useContext(AuthContext);