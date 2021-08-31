const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    displayName: String,
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File"
        }
    ]
}, {
    timestamps: true,
});

UserSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, opt) {
        delete ret['password'];
        return ret;
    },
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return reject(err);

            resolve(isMatch);
        });
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
