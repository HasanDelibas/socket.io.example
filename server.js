var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('*', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

let _SON_SOCKET_ID_ = null;

io.on("connection", function(socket) {

    // socket.id ile
    console.log("Bir soket bağlandı. ID:", socket.id)
    _SON_SOCKET_ID_ = socket.id;

    // İstemciye veri gönderme
    socket.emit("__OLAY_SUNUCUDAN__", "data", (response) => {
        console.log("Gelen Cevap", response)
    })

    // İstemciden gelen veri
    socket.on("__OLAY_İSTEMCİDEN__", function(data, response) {
        console.log("Gelen Veri", data)
        response("Verilen Cevap")
    })

})

// ID'si bilinen sockete veri gönderme
/* 
   Sunucu Çalışır çalışmaz bir soket soket bağlanmamasına karşın 
   her 5 saniyede bir çalışan timer ile gönderiyoruz.
*/
setInterval(function() {
    if (_SON_SOCKET_ID_ == null) return
        // Metod 1
    io.sockets.connected[_SON_SOCKET_ID_].emit("__OLAY_SUNUCUDAN__", "data", (response) => {
        console.log("Gelen Cevap", response)
    });
}, 5000)

// Broadcast' yani HERKEZE gönderdiğimiz mesaj
setInterval(function() {
    io.emit("__SUNUCUDAN_HERKEZE__", "SELAM MİLLET")
})


http.listen(3000);
