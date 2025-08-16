import { useNotificationsStore } from '@/stores/notifications.store';

export function useNotifications() {
  const notificationsStore = useNotificationsStore();

  function showSuccess(title: string, message: string, duration = 5000) {
    return notificationsStore.addNotification({
      type: 'success',
      title,
      message,
      duration
    });
  }

  function showError(title: string, message: string, duration = 8000) {
    return notificationsStore.addNotification({
      type: 'error',
      title,
      message,
      duration
    });
  }

  function showWarning(title: string, message: string, duration = 6000) {
    return notificationsStore.addNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  function showInfo(title: string, message: string, duration = 5000) {
    return notificationsStore.addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  }

  return {
    notifications: notificationsStore.notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    remove: notificationsStore.removeNotification,
    clear: notificationsStore.clearAllNotifications
  };
}