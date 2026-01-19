import React, { createContext, useCallback, useContext, useState } from 'react';
import Notification, { NotificationProps } from '../components/notification';

interface NotificationData extends Omit<NotificationProps, 'visible' | 'onClose'> {
    id: string;
}

interface NotificationContextType {
    showNotification: (notification: Omit<NotificationData, 'id'>) => void;
    showSuccess: (title: string, message: string, duration?: number) => void;
    showError: (title: string, message: string, duration?: number) => void;
    showWarning: (title: string, message: string, duration?: number) => void;
    showInfo: (title: string, message: string, duration?: number) => void;
    hideNotification: (id: string) => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    showNotification: () => { },
    showSuccess: () => { },
    showError: () => { },
    showWarning: () => { },
    showInfo: () => { },
    hideNotification: () => { },
    clearNotifications: () => { },
});

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const showNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };

        setNotifications(prev => [newNotification, ...prev]);

        // Auto remover después de la duración
        if (notification.duration !== 0) {
            setTimeout(() => {
                hideNotification(id);
            }, notification.duration || 4000);
        }
    }, []);

    const showSuccess = useCallback((title: string, message: string, duration?: number) => {
        showNotification({
            type: 'success',
            title,
            message,
            duration,
        });
    }, [showNotification]);

    const showError = useCallback((title: string, message: string, duration?: number) => {
        showNotification({
            type: 'error',
            title,
            message,
            duration,
        });
    }, [showNotification]);

    const showWarning = useCallback((title: string, message: string, duration?: number) => {
        showNotification({
            type: 'warning',
            title,
            message,
            duration,
        });
    }, [showNotification]);

    const showInfo = useCallback((title: string, message: string, duration?: number) => {
        showNotification({
            type: 'info',
            title,
            message,
            duration,
        });
    }, [showNotification]);

    const hideNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
                showSuccess,
                showError,
                showWarning,
                showInfo,
                hideNotification,
                clearNotifications,
            }}
        >
            {children}

            {/* Renderizar todas las notificaciones */}
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    visible={true}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    duration={notification.duration}
                    showCloseButton={notification.showCloseButton}
                    onClose={() => hideNotification(notification.id)}
                />
            ))}
        </NotificationContext.Provider>
    );
}