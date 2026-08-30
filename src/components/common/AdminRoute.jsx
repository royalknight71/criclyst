import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;