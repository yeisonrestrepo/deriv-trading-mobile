import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Notification } from '@/types/common.types';

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const maxNotifications = ref(5);

  // Actions
  function addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();
    
    const newNotification: Notification = {
      id,
      timestamp,
      duration: 5000,
      ...notification
    };

    notifications.value.unshift(newNotification);

    // Limit notifications
    if (notifications.value.length > maxNotifications.value) {
      notifications.value = notifications.value.slice(0, maxNotifications.value);
    }

    // Auto remove
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }

  function clearAllNotifications() {
    notifications.value = [];
  }

  function markAsRead(id: string) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      // Add read property if needed
      (notification as any).read = true;
    }
  }

  return {
    // State
    notifications,
    maxNotifications,

    // Actions
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead
  };
});
