module.exports = function(server, sessionMiddleware){
    const io = require("socket.io")(server);
    const redis = require("redis");
    var client = redis.createClient();

    client.subscribe("noticias")

    io.use(function(socket, next){
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    client.on("message", function(channel, message){ // en esta seccion es donde se envia una notificacion a los usuarios que esten registrados al canal
        if(channel=="noticias"){
            io.emit("nueva noticia", message);
        }

        //console.log("recibimos un nuevo documento del canal noticias")
        //console.log(message);
    });

    io.sockets.on("connection", function(socket){
        console.log(socket.request.session.user_id)
    })
}