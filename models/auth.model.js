const mongoose = require("mongoose")
const bycrypt = require("bcrypt")
const { reject } = require("bcrypt/promises")
const DB_URL = 'mongodb://127.0.0.1:27017/online-shop'
const userShema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})
const User = mongoose.model("user", userShema)


exports.createNewUser = (username, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            return User.findOne({ email: email })
        }).then(user => {
            if (user) {
                mongoose.disconnect()
                reject("email is used")
            }
            else {
                return bycrypt.hash(password, 10)
            }
        }).then(hashedPassword => {
            let user = new User({
                username: username,
                email: email,
                password: hashedPassword
            })
            return user.save()

        }).then(() => {
            mongoose.disconnect()
            resolve()
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })


    })

}
exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => User.findOne({ email: email })).then(user => {
            if (!user) {
                mongoose.disconnect()
                reject('there is no user mathes this email')
            } else {
                bycrypt.compare(password, user.password)
                    .then(same => {
                        if (!same) {
                            mongoose.disconnect()
                            reject('password is incorrect')
                        } else {
                            mongoose.disconnect()
                            resolve({
                                id: user.email,
                                isAdmin: user.isAdmin
                            })

                        }
                    })
            }
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}