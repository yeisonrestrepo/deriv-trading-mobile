<template>
    <teleport to="body">
        <div class="fixed top-4 right-4 z-50 space-y-2">
            <transition-group name="notification" tag="div">
                <div v-for="notification in notifications" :key="notification.id" :class="[
                    'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
                    notificationClasses[notification.type]
                ]">
                    <div class="p-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <i :class="notificationIcons[notification.type]" class="text-xl"></i>
                            </div>
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                <p class="text-sm font-medium">
                                    {{ notification.title }}
                                </p>
                                <p class="mt-1 text-sm opacity-90">
                                    {{ notification.message }}
                                </p>
                                <div v-if="notification.actions" class="mt-3 flex space-x-2">
                                    <button v-for="action in notification.actions" :key="action.label"
                                        @click="action.action" :class="[
                                            'text-xs font-medium px-3 py-1 rounded border transition-colors',
                                            actionClasses[action.style || 'primary']
                                        ]">
                                        {{ action.label }}
                                    </button>
                                </div>
                            </div>
                            <div class="ml-4 flex-shrink-0 flex">
                                <button @click="remove(notification.id)"
                                    class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <i class="fas fa-times text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications'

const { notifications, remove } = useNotifications()

const notificationClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
}

const notificationIcons = {
    success: 'fas fa-check-circle text-green-500',
    error: 'fas fa-exclamation-circle text-red-500',
    warning: 'fas fa-exclamation-triangle text-yellow-500',
    info: 'fas fa-info-circle text-blue-500'
}

const actionClasses = {
    primary: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700'
}
</script>

<style>
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.notification-move {
    transition: transform 0.3s ease;
}
</style>