import { create } from "zustand";

// ── Types ─────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

interface Notification {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

// ── Store ─────────────────────────────────────────────

export const useAppStore = create<UIState & AuthState & NotificationState>(
  (set) => ({
    // ── UI State ───────────────────────────────────────

    sidebarOpen: true,

    toggleSidebar: () =>
      set((state) => ({
        sidebarOpen: !state.sidebarOpen,
      })),

    // ── Auth State ─────────────────────────────────────

    user: null,
    token: null,

    setAuth: (user, token) => {
      localStorage.setItem("auth_token", token);

      set({
        user,
        token,
      });
    },

    logout: () => {
      localStorage.removeItem("auth_token");

      set({
        user: null,
        token: null,
      });
    },

    // ── Notification State ─────────────────────────────

    notifications: [],

    addNotification: (notification) =>
      set((state) => ({
        notifications: [...state.notifications, notification],
      })),

    removeNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
  }),
);
