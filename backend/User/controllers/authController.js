import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../services/userService.js';

export const loginUser = async (request, response) => {
    const { email, password } = request.body;

    // Kiểm tra xem email và password có được cung cấp không
    if (!email || !password) {
        return response.status(400).send({
            message: 'Email và password là bắt buộc.',
        });
    }

    try {
        // Tìm người dùng theo email
        const user = await findUserByEmail(email);

        // Nếu không tìm thấy người dùng
        if (!user) {
            return response.status(401).send({ message: 'Người dùng không tồn tại.' });
        }

        // So sánh mật khẩu cung cấp với mật khẩu đã mã hóa
        //const hashedPassword = await bcrypt.hash(password, 10);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return response.status(401).send({ message: 'Mật khẩu không đúng.' });
        }

        // Tạo JWT token với thông tin người dùng
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Trả về token cho client
        return response.status(200).send({ token });
    } catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Đã xảy ra lỗi.' + error });
    }
};