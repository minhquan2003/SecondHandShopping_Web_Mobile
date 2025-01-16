import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userChema = mongoose.Schema(
    {
        // user_id:{
        //     type: String,
        //     require: true
        // },
        email:{
            type: String,
            require: true
        },
        username:{
            type: String,
            require: false
        },
        password:{
            type: String,
            require: true
        },
        name:{
            type: String,
            require: true
        },
        address:{
            type: String,
            require: true
        },
        phone:{
            type: String,
            require: true
        },
        avatar_url:{
            type: String,
            require: false
        },
        role:{
            type: String,
            default: 'user',
        },
        ban:{
            type: Boolean,
            default: false
        },
        qrPayment:{
            type: String,
            default: ''
        },
        // created_at:{
        //     type: Date,
        //     require: true
        // },
        // updated_at:{
        //     type: Date,
        //     require: true
        // },
        status:{
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
);

userChema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const Users = mongoose.model('Users', userChema)
export default Users;