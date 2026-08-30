/**
 * Admin authorization middleware.
 * Must be used after userAuth middleware which attaches req.user.
 * Checks if the authenticated user has admin role.
 */
export const adminAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login to continue"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Admin access required"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};