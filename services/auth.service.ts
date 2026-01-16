import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';
const SESSION_KEY = 'session';

export async function saveUser(user: any) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

export async function getUser() {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function saveSession() {
  try {
    await AsyncStorage.setItem(SESSION_KEY, 'true');
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export async function getSession() {
  try {
    const session = await AsyncStorage.getItem(SESSION_KEY);
    return session === 'true';
  } catch (error) {
    console.error('Error getting session:', error);
    return false;
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}