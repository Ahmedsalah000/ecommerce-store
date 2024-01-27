const router =require("express").Router()
const bodyParser=require("body-parser")
const req = require("express/lib/request")
const authGuard=require('./guards/auth.guard')
const authController =require("../controllers/auth.controller")
const check =require('express-validator').check
router.get("/signup",authGuard.notAuth,authController.getSignup)
router.post(
    "/signup",authGuard.notAuth,
    bodyParser.urlencoded({extended:true}),
    check('username')
    .not()
    .isEmpty()
    .withMessage('username is required'),
    check('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid format'),    
    check('password')
    .not()
    .isEmpty()
    .withMessage('password is required')
    .isLength({min:6})
    .withMessage("password must be at least 6 charachters"),
    check('confirmPassword').custom((value,{req})=>{
        if(value===req.body.password)return true
        else throw 'passwords dont equal'

    }),
    
    authController.postSignup
)
router.get("/login",authGuard.notAuth,authController.getLogin)

router.post(
    "/login",authGuard.notAuth,
    bodyParser.urlencoded({extended:true}),
    authController.postLogin
)
router.all('/logout',authGuard.isAuth,authController.logout)
module.exports=router