import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from 'react-native';
import Field from '../../components/field';
import { useAuth } from '../../contexts/auth.context';
import { getUser } from '../../services/auth.service';

type FormData = {
    email: string;
    password: string;
};

export default function Login() {
    const { login } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: FormData) {
        try {
            const savedUser = await getUser();

            if (savedUser &&
                savedUser.email === data.email &&
                savedUser.password === data.password) {

                await login(savedUser);

                router.replace('/dashboard');

            } else {
                Alert.alert('Error', 'Credenciales incorrectas');
            }

        } catch (error) {
            console.error('Error en login:', error);
            Alert.alert('Error', 'No se pudo iniciar sesión');
        }
    }

    return (
        <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
                Iniciar Sesión
            </Text>

            <Controller
                control={control}
                name="email"
                rules={{
                    required: 'Email obligatorio',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Email inválido',
                    },
                }}
                render={({ field }) => (
                    <Field
                        label="Email"
                        type="email"
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.email?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="password"
                rules={{
                    required: 'Contraseña obligatoria',
                    minLength: {
                        value: 6,
                        message: 'Mínimo 6 caracteres',
                    },
                }}
                render={({ field }) => (
                    <Field
                        label="Contraseña"
                        type="password"
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.password?.message}
                    />
                )}
            />

            <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                style={({ pressed }) => ({
                    backgroundColor: pressed ? '#1976d2' : '#2196f3',
                    padding: 14,
                    borderRadius: 10,
                    marginTop: 30,
                    opacity: isSubmitting ? 0.6 : 1,
                })}
            >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                    {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                </Text>
            </Pressable>

            <Pressable
                onPress={() => router.push('/register')}
                style={{ marginTop: 20 }}
            >
                <Text style={{ color: '#2196f3', textAlign: 'center' }}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </Pressable>
        </View>
    );
}