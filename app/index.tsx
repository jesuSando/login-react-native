import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/auth.context';

export default function Index() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated
    ? <Redirect href="/dashboard" />
    : <Redirect href="/login" />;
}
