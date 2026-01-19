import { LinearGradient } from "expo-linear-gradient"
import { Controller, useForm } from "react-hook-form"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"
import { useAuth } from "../../contexts/auth.context"
import { useNotification } from '../../contexts/notification.context'
import { saveUser } from "../../services/auth.service"
import Field from "../field"

type FormData = {
  email: string
  password: string
  confirmPassword: string
}

type RegisterFormProps = {
  onToggleAuth: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

// Paleta de colores
const COLORS = {
  primary: "#7870e6",
  secondary: "#b06ecc",
  accent: "#ff7588",
  textPrimary: "#1f2937",
  textSecondary: "#6b7280",
  error: "#ef4444",
}

export default function RegisterForm({ onToggleAuth, loading, setLoading }: RegisterFormProps) {
  const { login } = useAuth()
  const { showSuccess, showError } = useNotification();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const user = {
        email: data.email,
        password: data.password,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      await saveUser(user);
      await login(user);

      showSuccess('Éxito', 'Cuenta creada exitosamente'); // Cambia esto
    } catch (error) {
      console.error('Error en registro:', error);
      showError('Error', 'No se pudo crear la cuenta'); // Cambia esto
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Únete a nuestra comunidad</Text>

      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email obligatorio",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Email inválido",
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
            editable={!loading}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: "Contraseña obligatoria",
          minLength: {
            value: 6,
            message: "Mínimo 6 caracteres",
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
            editable={!loading}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Confirma la contraseña",
          validate: (value) => value === password || "Las contraseñas no coinciden",
        }}
        render={({ field }) => (
          <Field
            label="Confirmar Contraseña"
            type="password"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.confirmPassword?.message}
            editable={!loading}
          />
        )}
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        style={({ pressed }) => [styles.buttonContainer, { opacity: loading ? 0.6 : pressed ? 0.9 : 1 }]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear Cuenta</Text>}
        </LinearGradient>
      </Pressable>

      <Pressable onPress={onToggleAuth} disabled={loading} style={styles.linkContainer}>
        <Text style={styles.linkText}>
          ¿Ya tienes cuenta? <Text style={styles.linkTextBold}>Inicia Sesión</Text>
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7870e6",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  buttonContainer: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 24,
  },
  linkText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
})
