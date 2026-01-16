import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../contexts/auth.context';

export default function AppLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return <Slot />;
}
