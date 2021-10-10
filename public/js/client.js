var socket = io();

socket.on("nueva noticia",function(data){
    data = JSON.parse(data);
    console.log(data);
    var container = document.querySelector("#noti");
    var source = document.querySelector("#image-template").innerHTML;

    var template = require("handlebars").compile(source);

    container.innerHTML += template(data);
});