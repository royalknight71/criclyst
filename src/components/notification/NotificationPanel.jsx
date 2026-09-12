import { useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { FaCheckDouble, FaBell } from "react-icons/fa";

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

// eslint-disable-next-line no-unused-vars
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
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300"
        >
          <FaCheckDouble className="text-[10px]" />
          Mark all read
        </button>
      </div>

      {/* Notification list */}
      <div className="max-h-96 overflow-y-auto">
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
            <div
              key={n._id}
              onClick={() => !n.read && markNotificationAsRead(n._id)}
              className={`flex cursor-pointer gap-3 border-b border-slate-700/50 px-4 py-3 transition-colors hover:bg-slate-700/50 ${
                !n.read ? "bg-slate-700/20" : ""
              }`}
            >
              <span className="mt-0.5 text-lg">
                {EVENT_ICONS[n.eventType] || "🔔"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm font-medium ${
                      !n.read ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {n.title}
                  </p>
                  {!n.read && (
                    <FaBell className="mt-1 h-2 w-2 shrink-0 text-cyan-400" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">
                  {n.message}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
            </div>
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
            className="w-full py-2 text-xs text-cyan-400 transition-colors hover:bg-slate-700/50 hover:text-cyan-300"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
