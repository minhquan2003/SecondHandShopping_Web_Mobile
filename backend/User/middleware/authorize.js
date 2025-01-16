import jwt from 'jsonwebtoken';

// Middleware xác thực
const authorize = (roles = []) => {
    return (req, res, next) => {
        // Lấy token từ header Authorization
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(403).send('Access denied. No token provided.');
        }

        // Tách token từ header
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(403).send('Access denied. No token provided.');
        }

        try {
            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Sử dụng biến môi trường cho bí mật

            req.user = decoded; // Lưu thông tin người dùng vào req.user

            // Kiểm tra vai trò
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).send('Access denied. Insufficient permissions.');
            }
            next(); // Tiếp tục nếu tất cả các điều kiện đều thỏa mãn
        } catch (error) {
            return res.status(400).send('Invalid token.');
        }
    };
};

export default authorize;