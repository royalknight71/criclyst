/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import socket from "../services/socket";
import * as notificationService from "../services/notification.service";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Silently fail
    }
  }, [user]);

  const fetchNotifications = useCallback(async (reset = false) => {
    if (!user) return;
    setLoading(true);
    try {
      const page = reset ? 1 : pageRef.current;
      const result = await notificationService.getNotifications(page, 20);
      if (reset) {
        setNotifications(result.data);
        pageRef.current = 2;
      } else {
        setNotifications((prev) => [...prev, ...result.data]);
        pageRef.current = page + 1;
      }
      setHasMore(page < result.pagination.totalPages);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markNotificationAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silently fail
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  }, []);

  // Socket.IO listeners for real-time notifications
  useEffect(() => {
    if (!user) return;

    socket.connect();

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleUnreadCount = ({ count }) => {
      setUnreadCount(count);
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:unread-count", handleUnreadCount);

    // Initial unread count comes from Socket.IO server on connect
    // (server emits notification:unread-count on user room join)

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:unread-count", handleUnreadCount);
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        loading,
        hasMore,
        fetchNotifications,
        fetchUnreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
