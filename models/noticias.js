const mongoose = require("mongoose");
const schema = mongoose.Schema;


var noticia_schema = new schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    creator: {type: schema.Types.ObjectId, ref: "User"}, 
    extension: {type:String, required:true}
});


var Noticia = mongoose.model("Noticia",noticia_schema);

module.exports = Noticia;