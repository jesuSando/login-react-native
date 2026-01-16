import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from 'react-native';
import Field from '../../components/field';
import { useAuth } from '../../contexts/auth.context'; // Importa el contexto
import { saveUser } from '../../services/auth.service';

type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
};

export default function Register() {
    const { login } = useAuth(); // Usa el hook de autenticación

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    async function onSubmit(data: FormData) {
        try {
            const user = {
                email: data.email,
                password: data.password,
                id: Date.now().toString(), // Agrega un ID único
                createdAt: new Date().toISOString(),
            };

            await saveUser(user);

            await login(user);

            router.replace('/dashboard');

        } catch (error) {
            console.error('Error en registro:', error);
            Alert.alert('Error', 'No se pudo completar el registro');
        }
    }

    return (
        <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
                Registro
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

            <Controller
                control={control}
                name="confirmPassword"
                rules={{
                    required: 'Confirma la contraseña',
                    validate: value =>
                        value === password || 'Las contraseñas no coinciden',
                }}
                render={({ field }) => (
                    <Field
                        label="Confirmar contraseña"
                        type="password"
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.confirmPassword?.message}
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
                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </Text>
            </Pressable>

            <Pressable
                onPress={() => router.push('/login')}
                style={{ marginTop: 20 }}
            >
                <Text style={{ color: '#2196f3', textAlign: 'center' }}>
                    ¿Ya tienes cuenta? Inicia sesión
                </Text>
            </Pressable>
        </View>
    );
}