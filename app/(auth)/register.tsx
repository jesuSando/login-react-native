import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import Field from '../../components/field';
import { saveSession, saveUser } from '../../services/auth.service';

type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
};

export default function Register() {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    async function onSubmit(data: FormData) {
        const user = {
            email: data.email,
            password: data.password,
        };

        await saveUser(user);
        await saveSession();

        router.replace('/(app)/dashboard');
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Registro</Text>

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
                style={{
                    backgroundColor: '#2196f3',
                    padding: 14,
                    borderRadius: 10,
                    marginTop: 20,
                }}
            >
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                    Registrarse
                </Text>
            </Pressable>
        </View>
    );
}
