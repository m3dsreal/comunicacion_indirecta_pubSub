const express = require("express");
const session = require("express-session");
const User = require("./models/user").User;
const routes_app = require("./routes");
const session_middleware = require("./middlewares/sessions");
const methodOverride = require("method-override");
const formidable = require("express-formidable");
const path = require("path");
const redis = require("redis");
const redisClient = redis.createClient();
const redisStore = require("connect-redis")(session);
const http = require("http");
const realtime = require("./realtime");


const app = express();
var server = http.Server(app);

var sessionMiddleware = session({
    store: new redisStore({host: 'localhost', port: 6379, client: redisClient, ttl: 86400}),
    secret:"palabra secreta"
})

realtime(server,sessionMiddleware)

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));



app.use(sessionMiddleware);

app.use(formidable.parse({ keepExtensions: true}));
app.use('/static',express.static(path.join(__dirname,'public')));
app.set("view engine", "pug");


// GET

app.get("/",(req, res) => {
    console.log(req.session.user_id);
    res.render("index")
});

app.get("/singup", (req, res)=>{
    res.render("singup")
});



app.get("/login", (req, res)=>{
    res.render("login")
});


//POST

app.post("/", (req, res) => {
    
    res.render("form")
})

app.post("/users", (req, res) =>{
    var user = new User({email: req.body.email, 
                         password: req.body.password, 
                         password_confirmation: req.body.password_confirmation,
                         name: req.body.nombre,
                         username: req.body.username});
    user.save().then((us)=>{
        res.send("Guardamos tu informacion")
    },(err)=>{
        if(err){
            console.log(String(err));
            res.send("No se pudo guardar la informacion");
        }
    });
    //console.log(req.body.contraseña)
    //console.log(req.body.email)
})

app.post("/sessions", (req, res) =>{

    User.findOne({email:req.body.email,password:req.body.password},"name email password username",(err,user)=>{
        req.session.user_id = user._id;
        res.send("Tu informacion se encuentra en la consola");
    });
})


app.use("/app", session_middleware);
app.use("/app", routes_app);

server.listen(8080);