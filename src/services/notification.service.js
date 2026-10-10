/**
 * Notification service.
 * Encapsulates all notification-related HTTP calls via the shared Axios instance.
 */

import api from "../api/axios";

export const getNotifications = async (page = 1, limit = 20) => {
  const { data } = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await api.get("/notifications/unread-count");
  return data.data.count;
};

export const markAsRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await api.patch("/notifications/read-all");
  return data;
};

export const subscribeToMatch = async (matchId) => {
  const { data } = await api.post(`/match-subscriptions/${matchId}`);
  return data;
};

export const unsubscribeFromMatch = async (matchId) => {
  const { data } = await api.delete(`/match-subscriptions/${matchId}`);
  return data;
};

export const checkSubscription = async (matchId) => {
  const { data } = await api.get(`/match-subscriptions/${matchId}/check`);
  return data.subscribed;
};

export const getSubscriptions = async () => {
  const { data } = await api.get("/match-subscriptions");
  return data;
};
