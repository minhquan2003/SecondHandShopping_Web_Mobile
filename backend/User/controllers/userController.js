import { createUser, 
    findUserByEmail,
    findUserById,
    updateUser,
    deleteUser,
    getAllUsers, } from '../services/userService.js';
import bcrypt from 'bcrypt';


const addUser = async (req, res) => {
    try {
        if (
            // !req.body.user_id ||
            !req.body.email ||
            !req.body.username ||
            !req.body.password ||
            !req.body.name ||
            !req.body.address ||
            !req.body.phone
            // !req.body.avatar_url
            // !req.body.role
            // !req.body.created_at ||
            // !req.body.updated_at ||
            // !req.body.status
        ) {
            return res.status(400).send({
                message: 'Send all required fields: email, username, password, name, address, phone, avatar_url',
            });
        }

        const user = await createUser(req.body);
        return res.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Lấy tất cả người dùng
const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).send({success: true,
            data: users});
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Tìm người dùng theo ID
const getUserById = async (req, res) => {
    try {
        const user = await findUserById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Tìm người dùng theo ID
const getUserByEmail = async (req, res) => {
    try {
        const user = await findUserByEmail(req.body.email);
        // if (!user) {
        //     return res.status(404).send({ message: 'User not found' });
        // }
        return res.status(200).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Cập nhật thông tin người dùng
const updateUserById = async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Xóa người dùng
const deleteUserById = async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(204).send();
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};


const comparePassword = async (req, res) => {
    const { id, password } = req.body;
    try {
        const user = await findUserById(id); // Sử dụng `findById` để lấy người dùng

        if (!user) {
            return res.status(404).send({ message: "Người dùng không tồn tại." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return res.status(200).send({ valid: true });
        } else {
            return res.status(401).send({ valid: false, message: "Mật khẩu không đúng." });
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export {addUser, getUsers, getUserById, getUserByEmail, updateUserById, deleteUserById, comparePassword}