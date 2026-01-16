// auth.service.ts (versión simplificada)
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';
const SESSION_KEY = 'session';

export async function saveUser(user: any) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser() {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveSession() {
  await AsyncStorage.setItem(SESSION_KEY, 'true');
}

export async function getSession() {
  const session = await AsyncStorage.getItem(SESSION_KEY);
  return session === 'true';
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}