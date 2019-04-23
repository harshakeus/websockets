const WebSocket = require('ws');
var redis = require('redis');

const wss = new WebSocket.Server({ port: 9003 });
var client =  redis.createClient('6379', 'redis');
var subscriber1 =  redis.createClient('6379', 'redis');
var subscriber3 = redis.createClient('6379', 'redis');




var chan = new Map();

wss.on('connection', ws => {

  client.publish("servercount3",wss.clients.size);
  var ran = Math.floor(((Math.random()*10)%2)+1);
  //chan.set(ws,ran);
  console.log('number of connections:'+wss.clients.size);

  ws.on('message', message => {
    
    var checksub = message.substr(0,message.indexOf(' '));
    var remmsg =  message.substr(message.indexOf(' ')+1);
    if(checksub == 'sub' ){

            if(chan.has(ws)){
              var abc = chan.get(ws);
              if(abc.includes(remmsg)){
                ws.send('already subscribed');
              }
              else{
                abc.push(remmsg);
                chan.set(ws,abc);
                ws.send('channel added');
              }
            }
            else{
              var arr= [];
              arr.push(remmsg);
              chan.set(ws,arr);
              ws.send('channel added');
            }


    }
    else if(chan.has(ws)){

          var abc = chan.get(ws);
          if(abc.includes(checksub)){
            client.publish("server3", message);
            wss.clients.forEach(vv=>{

              var checkcc = chan.get(vv);
              if(checkcc.includes(checksub)&&vv!=ws){
                vv.send(remmsg);
              }

            })
          }
          else{
            ws.send('not subscribed to channel'+checksub);
          }
      

    }
    else{
             ws.send('not subscribed to any channel');
    }
   
  })

  ws.on('close',function(){
    client.publish("servercount3",wss.clients.size);
    chan.delete(ws);
    console.log('connection closed');  

  });
  ws.send('h2!')
})



subscriber1.on("message", function(channel, message) {
 
  var ran = message.substr(0,message.indexOf(' '));
  var mainmsg = message.substr(message.indexOf(' ')+1);
  wss.clients.forEach(vv=>{
    if(chan.has(vv)){
      var abc = chan.get(vv);
      if(abc.includes(ran)){
        vv.send(mainmsg);
      }
      
    }

  })
});
subscriber1.subscribe("server1");

subscriber3.on("message",function(channel,message){
  var ran = message.substr(0,message.indexOf(' '));
  var mainmsg = message.substr(message.indexOf(' ')+1);
  
  wss.clients.forEach(vv=>{
    if(chan.has(vv)){
      var abc = chan.get(vv);
      if(abc.includes(ran)){
        vv.send(mainmsg);
      }
      
    }

  })
});
subscriber3.subscribe("server2");
