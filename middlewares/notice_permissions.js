const Noticia = require("../models/noticias");

module.exports = ((noticia, req, res) =>{
    //true = permiso accedido
    //falso = permiso denegado
    if(req.method === "GET" && req.path.indexOf("edit") < 0){
        // ver la imagen
        return true;
    }

    if(noticia.creator.id.toString() == res.locals.user.id){
        //esta imagen la puedo editar porque la subi
        return true;
    }

    return false;
})