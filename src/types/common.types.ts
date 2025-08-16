export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  timestamp: string;
  read?: boolean;
  persistent?: boolean;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'trader';
  permissions: string[];
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    trading: boolean;
  };
  dashboard: {
    layout: string;
    widgets: string[];
  };
}

export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  version: string;
  environment: string;
  features: {
    websockets: boolean;
    notifications: boolean;
    analytics: boolean;
    darkMode: boolean;
  };
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
  lastUpdated?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}