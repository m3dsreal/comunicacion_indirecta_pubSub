const Noticia = require("../models/noticias")
var check_user = require("./notice_permissions");

module.exports = ((req, res, next) => {
    Noticia.findById(req.params.id)
        .populate("creator")
        .exec((err,noticia) => {
            if(noticia != null && check_user(noticia,req,res)){
                //console.log("Se encontro la noticia"+ noticia.creator);
                res.locals.noticia = noticia;
                next();
            }else{
                res.redirect("/app");
            }
        })
}) 