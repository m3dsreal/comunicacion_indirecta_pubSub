const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/PubSubNoticias");

var email_match = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

var user_schema = new Schema({
    name: String,
    username: String,
    password: {type:String, 
               validate:{ 
                   validator: function(p){
                       return this.password_confirmation == p;
                }, 
                   message: "no coinciden las contraseñas"}},
    email: {type: String, 
            required:"El correo es obligatorio",
            match:email_match}
});

user_schema.virtual("password_confirmation").get(()=>{
    return this.p_c;
}).set((password)=>{
    this.p_c = password
})

var User = mongoose.model("User",user_schema);

module.exports.User = User;