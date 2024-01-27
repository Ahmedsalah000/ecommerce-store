const express=require("express")
const path =require('path')
const session =require("express-session")
const SessionStore = require('connect-mongodb-session')(session)
const flash =require('connect-flash')
const homeRouter=require('./routes/home.route')
const productRouter=require('./routes/product.route')
const authRouter=require("./routes/auth.route")
const cartRouter=require("./routes/cart.route")
const app = express()
app.use(express.static(path.join(__dirname,'assets'))) 
app.use(express.static(path.join(__dirname,'images')))
app.use(flash())

const STORE =new SessionStore({
    uri :'mongodb://127.0.0.1:27017/online-shop',
    collection:'sessions'
})
app.use(session({
    secret:'this is my secret key',
    saveUninitilized:false,
    store:STORE

}))
app.set('view engine','ejs')
app.set('views','views')  //default
app.use('/',homeRouter )
app.use('/',authRouter)
app.use('/product',productRouter )
app.use('/cart',cartRouter )

app.listen(3000,()=>{    
    console.log('server listen on port 3000');
}) 
