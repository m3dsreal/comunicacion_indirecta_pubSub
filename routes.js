const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const noticia_middleware = require("./middlewares/privacity_notices");
const fs = require("fs");
const redis = require("redis");
var Noticia = require("./models/noticias");

var client = redis.createClient();

router.get("/", ((req, res) => {
    Noticia.find({}).populate("creator")
    .exec(function(err,noticia){
        if(err){ console.log(err) }
        console.log(noticia)
        res.render("app/home",{noticia:noticia})
    });
}));


// REST

router.get("/noticias/new",(req, res) => { //formulario
    res.render("app/noticias/new")
});

router.get("/noticias/:category/category",(req, res) => {
    Noticia.find({category: req.params.category},(err, noticias) => {
        res.render("app/noticias/category",{noticias:noticias})
    })
})

router.all("/noticias/:id*",noticia_middleware);
  
router.get("/noticias/:id/edit",function(req, res) { //desplegar formulario de imagen existente para editar
    res.render("app/noticias/edit");
});

router.route("/noticias/:id")
.get((req, res) => {
    client.publish("noticias", res.locals.noticia.toString());

    res.render("app/noticias/show");   
})
.put((req,res) => {
    res.locals.noticia.title = req.body.title,
    res.locals.noticia.description = req.body.description
    res.locals.noticia.save((err) => {
      if(err){
          res.render("app/noticias/"+req.params.id+"/edit");
      }else{
          res.render("app/noticias/show");
      }
   })
})
.delete((req, res) => {
    Noticia.findOneAndRemove({id: req.params.id},((err) =>{
        if(err){
            console.log("El error es el siguiente: "+err)
        }else{
            res.redirect("/app/noticias");
        }
    }))
});




router.route("/noticias")
.get((req, res) => {
    Noticia.find({creator: res.locals.user.id},function(err,noticias){
        if(err){ res.redirect("/app"); return;}
        res.render("app/noticias/index",{noticias: noticias});
    });
})
.post((req,res) => {
    var extension = req.body.image.name.split(".").pop();
    console.log(req.body.image);
    var data = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        creator: res.locals.user.id,
        extension: extension
    }

    var noticia = new Noticia(data);

    noticia.save(function(err){
        if(!err){

            var imgJSON = {
                "id": noticia.id,
                "title": noticia.title,
                "imagen": noticia.extension
            };

            client.publish("noticias", JSON.stringify(imgJSON))
            fs.rename(req.body.image.path, "public/notiFiles/"+noticia._id+"."+extension, function(err){
                res.redirect("/app/noticias/"+noticia._id);
            });
           
        }else{
            console.log(noticia);
            res.render(err);
        }
    })
});


module.exports = router;