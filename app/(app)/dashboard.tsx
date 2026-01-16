import { Alert, Platform, Pressable, Text, View } from 'react-native';
import { useAuth } from '../../contexts/auth.context';

export default function Dashboard() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm('¿Cerrar sesión?');
            if (confirm) logout();
        } else {
            Alert.alert(
                'Cerrar sesión',
                '¿Estás seguro?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
                ]
            );
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                Dashboard
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 20 }}>
                Bienvenido, {user?.email || 'Usuario'}
            </Text>

            <Pressable
                onPress={handleLogout}
                style={{
                    backgroundColor: '#f44336',
                    padding: 14,
                    borderRadius: 10,
                    marginTop: 20,
                }}
            >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                    Cerrar Sesión
                </Text>
            </Pressable>
        </View>
    );
}