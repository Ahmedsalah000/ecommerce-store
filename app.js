const express=require("express")
const path =require('path')

const session =require("express-session")
const SessionStore = require('connect-mongodb-session')(session)
const flash =require('connect-flash')

const homeRouter=require('./routes/home.route')
const productRouter=require('./routes/product.route')
const authRouter=require("./routes/auth.route")
const cartRouter=require("./routes/cart.route")
const orderRouters=require("./routes/orders.route")
const adminRouter=require("./routes/admin.route")

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
app.set('views','views')

app.use('/',homeRouter )
app.use('/',authRouter)
app.use('/product',productRouter )
app.use('/cart',cartRouter )
app.use('/',orderRouters)
app.use('/admin',adminRouter)

app.get("/error", (req, res, next) => {
    res.status(500);
    res.render("error.ejs", {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Error"
    });
});

app.get("/not-admin", (req, res, next) => {
    res.status(403);
    res.render("not-admin", {
        isUser: req.session.userId,
        isAdmin: false,
        pageTitle: "Not Allowed"
    });
});

app.use((req, res, next) => {
    res.status(404);
    res.render("not-found", {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: "Page Not Found"
    });
});


app.listen(3000,()=>{    
    console.log('server listen on port 3000');
}) 
