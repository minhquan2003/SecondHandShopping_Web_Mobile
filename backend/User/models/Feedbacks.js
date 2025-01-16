import mongoose from 'mongoose';

// Định nghĩa schema cho Feedback
const feedbackSchema = new mongoose.Schema({
    // feedback_id: {
    //     type: String,
    //     required: true,
    //     unique: true, // Đảm bảo feedback_id là duy nhất
    // },
    user_id: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

// Tạo model từ schema
const Feedbacks = mongoose.model('Feedbacks', feedbackSchema);

export default Feedbacks;