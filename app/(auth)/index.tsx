"use client"

import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Animated, Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native"
import LoginForm from "../../components/auth/LoginForm"
import RegisterForm from "../../components/auth/RegisterForm"
import { useAuth } from "../../contexts/auth.context"

const COLORS = {
  primary: "#7870e6",
  secondary: "#b06ecc",
  accent: "#ff7588",
  detail: "#ff9673",
  detailPurple: "#b16fcc",
  text: "#8771e6",
  white: "#ffffff",
}

const PC_BREAKPOINT = 900

export default function AuthScreen() {
  const { width } = useWindowDimensions()
  const isPC = width >= PC_BREAKPOINT && Platform.OS === "web"

  const { isAuthenticated, loading: authLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/(app)/dashboard")
    }
  }, [authLoading, isAuthenticated])

  const handleToggleAuth = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsLogin(!isLogin)

      const targetPosition = isLogin ? 1 : 0

      Animated.spring(slideAnim, {
        toValue: targetPosition,
        useNativeDriver: false,
        tension: 50,
        friction: 12,
      }).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start()
      })
    })
  }

  const renderInfoContent = () => {
    if (isLogin) {
      return (
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Bienvenido a la App</Text>
          <Text style={styles.infoDescription}>
            Organiza tu semana, crea hábitos y mantén el ritmo de tu crecimiento.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "rgba(120, 112, 230, 0.25)" }]}>
                <Text style={styles.featureEmoji}>📊</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Seguimiento de Hábitos</Text>
                <Text style={styles.featureDesc}>Mantén rachas y visualiza tu progreso</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "rgba(176, 110, 204, 0.25)" }]}>
                <Text style={styles.featureEmoji}>📅</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Planner Semanal</Text>
                <Text style={styles.featureDesc}>Organiza tus tareas y prioridades</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "rgba(255, 117, 136, 0.25)" }]}>
                <Text style={styles.featureEmoji}>📈</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Métricas Personales</Text>
                <Text style={styles.featureDesc}>Mide tu crecimiento con estadísticas</Text>
              </View>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Únete a Nosotros</Text>
          <Text style={styles.infoDescription}>Comienza tu viaje de mejora continua y construcción de hábitos.</Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "rgba(255, 150, 115, 0.25)" }]}>
                <Text style={styles.featureEmoji}>⚡</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Control Total</Text>
                <Text style={styles.featureDesc}>Gestiona tu tiempo y productividad</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "rgba(177, 111, 204, 0.25)" }]}>
                <Text style={styles.featureEmoji}>🔄</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Acceso Rápido</Text>
                <Text style={styles.featureDesc}>Sincroniza en todos tus dispositivos</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: "rgba(120, 112, 230, 0.25)" }]}>
                <Text style={styles.featureEmoji}>🔒</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>100% Privado</Text>
                <Text style={styles.featureDesc}>Tus datos están protegidos</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary, COLORS.accent]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    )
  }

  if (!isPC) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary, COLORS.accent]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.mobileFormContainer}>
          <View style={styles.mobileFormCard}>
            {isLogin ? (
              <LoginForm onToggleAuth={handleToggleAuth} loading={loading} setLoading={setLoading} />
            ) : (
              <RegisterForm onToggleAuth={handleToggleAuth} loading={loading} setLoading={setLoading} />
            )}
          </View>
        </View>
      </View>
    )
  }

  const panelWidth = width * 0.5

  const infoPanelLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, panelWidth],
  })

  const formPanelLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [panelWidth, 0],
  })

  const infoBorderTopRight = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [80, 0, 0],
  })
  const infoBorderBottomRight = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [80, 0, 0],
  })
  const infoBorderTopLeft = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 80],
  })
  const infoBorderBottomLeft = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 80],
  })

  const infoPanelZIndex = slideAnim.interpolate({
    inputRange: [0, 0.01, 0.99, 1],
    outputRange: [10, 10, 10, 10],
  })

  return (
    <View style={styles.container}>
      {/* <LinearGradient
        colors={[COLORS.primary, COLORS.secondary, COLORS.accent]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      /> */}

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.formPanel,
            {
              width: panelWidth,
              left: formPanelLeft,
              zIndex: 1,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.formContentContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {isLogin ? (
              <LoginForm onToggleAuth={handleToggleAuth} loading={loading} setLoading={setLoading} />
            ) : (
              <RegisterForm onToggleAuth={handleToggleAuth} loading={loading} setLoading={setLoading} />
            )}
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.infoPanel,
            {
              width: panelWidth,
              left: infoPanelLeft,
              borderTopRightRadius: infoBorderTopRight,
              borderBottomRightRadius: infoBorderBottomRight,
              borderTopLeftRadius: infoBorderTopLeft,
              borderBottomLeftRadius: infoBorderBottomLeft,
              zIndex: 10,
            },
          ]}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary, COLORS.accent]}
            style={[StyleSheet.absoluteFill, { borderRadius: 0 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <LinearGradient
            colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Animated.View
            style={[
              styles.infoContentContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {renderInfoContent()}
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  infoPanel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    paddingHorizontal: 40,
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  infoContentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  infoContent: {
    maxWidth: 420,
  },
  infoTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#7870e6",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  infoDescription: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 26,
    marginBottom: 36,
  },
  featureList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7870e6",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.75)",
  },
  formPanel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  formContentContainer: {
    width: "100%",
    maxWidth: 380,
  },
  mobileFormContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mobileFormCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
})
