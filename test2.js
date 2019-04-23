var app = require('express')();
var http = require('http').Server(app);
var redis = require('redis');
var nocache = require('nocache')
app.use(nocache());
var port = process.env.PORT || 3009;
var server1 = redis.createClient('6379', 'redis');
var server2 = redis.createClient('6379', 'redis');
var server3 = redis.createClient('6379', 'redis');

var server1load =0;
var server2load =0;
var server3load =0;

server1.on("message", function(channel, message) {
    
    var num =  parseInt(message, 10);
    server1load =num;
  

  });
  server1.subscribe("servercount1");
  server2.on("message", function(channel, message) {
    
    var num =  parseInt(message, 10);
    server2load =num;
  

  });
  server2.subscribe("servercount2");
  server3.on("message", function(channel, message) {
    
    var num =  parseInt(message, 10);
    server3load =num;
  

  });
  server3.subscribe("servercount3");

function assignserver(){
    if(server1load<=server2load&&server1load<=server3load){
        return 1;
    }
    else if(server2load<=server3load){
        return 2;
    }
    else{
        return 3;
    }
}


app.get('/', function(req, res){
 
    var k = assignserver();
    console.log(server1load,server2load,server3load);
    
    if(k==1){
        res.sendFile(__dirname + '/basic.html');
    }
    else if(k == 2){
        res.sendFile(__dirname + '/abc.html');
    }
    else{
        res.sendFile(__dirname + '/def.html');
    }
    
 


});


http.listen(port, function(){
  console.log('listening on *:' + port);
});


