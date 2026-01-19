import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    onClose: () => void;
    duration?: number;
    showCloseButton?: boolean;
}

// Paleta de colores consistente con la app
const COLORS = {
    primary: '#7870e6',
    secondary: '#b06ecc',
    accent: '#ff7588',
    detail: '#ff9673',
    background: '#ffffff',
    text: '#1f2937',
    textLight: '#6b7280',
};

// Colores por tipo de notificación adaptados a la paleta
const TYPE_COLORS = {
    success: { gradient: ['#7870e6', '#b06ecc'] as const, icon: '#7870e6' },
    error: { gradient: ['#ff7588', '#ff9673'] as const, icon: '#ff7588' },
    warning: { gradient: ['#ff9673', '#ffb347'] as const, icon: '#ff9673' },
    info: { gradient: ['#b06ecc', '#7870e6'] as const, icon: '#b06ecc' },
};

const ICONS = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

export default function Notification({
    visible,
    type,
    title,
    message,
    onClose,
    duration = 4000,
    showCloseButton = true,
}: NotificationProps) {
    const translateY = new Animated.Value(-100);
    const opacity = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            // Animación de entrada
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    tension: 50,
                    friction: 10,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto cerrar después de la duración
            if (duration > 0) {
                const timer = setTimeout(onClose, duration);
                return () => clearTimeout(timer);
            }
        } else {
            // Animación de salida
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, duration, onClose]);

    if (!visible) return null;

    const Icon = ICONS[type];
    const typeColors = TYPE_COLORS[type];

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{ translateY }],
                        opacity,
                    },
                ]}
            >
                <View style={styles.content}>
                    {/* Barra lateral con gradiente */}
                    <View style={styles.gradientBar}>
                        <LinearGradient
                            colors={typeColors.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.gradientBarInner}
                        />
                    </View>

                    {/* Icono con fondo circular */}
                    <View style={[styles.iconContainer, { backgroundColor: `${typeColors.icon}15` }]}>
                        <Icon size={20} color={typeColors.icon} />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: typeColors.icon }]}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    {showCloseButton && (
                        <TouchableWithoutFeedback onPress={onClose}>
                            <View style={styles.closeButton}>
                                <X size={18} color={COLORS.textLight} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 50,
        left: 16,
        right: 16,
        zIndex: 9999,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    content: {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 16,
        paddingLeft: 0,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    gradientBar: {
        width: 4,
        alignSelf: 'stretch',
        marginRight: 14,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        overflow: 'hidden',
    },
    gradientBarInner: {
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    message: {
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
    },
    closeButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(107, 114, 128, 0.08)',
    },
});
