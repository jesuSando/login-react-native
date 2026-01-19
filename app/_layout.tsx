import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/auth.context';
import { NotificationProvider } from '../contexts/notification.context';

function RootLayout() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}

export default function Layout() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </NotificationProvider>
  );
}
