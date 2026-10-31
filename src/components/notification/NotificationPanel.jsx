import { useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { FaCheckDouble, FaBell, FaTimes } from "react-icons/fa";

const EVENT_ICONS = {
  MATCH_STARTED: "🟢",
  MATCH_COMPLETED: "🏆",
  WICKET: "🎯",
  SCORE_MILESTONE: "🎉",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotificationPanel({ onClose }) {
  const {
    notifications,
    loading,
    hasMore,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications(true);
  }, [fetchNotifications]);

  return (
    <div
      id="notification-panel"
      role="region"
      aria-label="Notifications"
      className="absolute right-0 top-full z-50 mt-2 flex max-h-[calc(100dvh-6rem)] w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl sm:w-96"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-700 px-3 py-2 sm:px-4 sm:py-3">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="flex min-h-11 items-center gap-1 rounded-lg px-2 text-xs text-cyan-400 transition-colors hover:bg-slate-700/50 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <FaCheckDouble className="text-[10px]" />
            <span>Mark all read</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {notifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <FaBell className="mb-2 text-2xl text-slate-600" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs text-slate-500">
              Follow matches to get live updates
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              type="button"
              key={n._id}
              onClick={() => !n.read && markNotificationAsRead(n._id)}
              className={`flex min-h-11 w-full min-w-0 items-start gap-3 border-b border-slate-700/50 px-4 py-3 text-left transition-colors hover:bg-slate-700/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-cyan-300 ${
                !n.read ? "bg-slate-700/20" : ""
              }`}
            >
              <span className="mt-0.5 text-lg">
                {EVENT_ICONS[n.eventType] || "🔔"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`min-w-0 break-words text-sm font-medium ${
                      !n.read ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {n.title}
                  </p>
                  {!n.read && (
                    <FaBell className="mt-1 h-2 w-2 shrink-0 text-cyan-400" />
                  )}
                </div>
                <p className="mt-0.5 break-words text-xs text-slate-400 line-clamp-2">
                  {n.message}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
            </button>
          ))
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
          </div>
        )}

        {hasMore && !loading && notifications.length > 0 && (
          <button
            onClick={() => fetchNotifications(false)}
            className="min-h-11 w-full py-2 text-xs text-cyan-400 transition-colors hover:bg-slate-700/50 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-cyan-300"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
