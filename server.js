const WebSocketServer = require('ws').Server;
const http = require ('http');
const express = require ('express');
const app = express();
const port = process.env.PORT || 8080
app.use(express.static(__dirname + "/"))

const server = http.createServer(app)
server.listen(port);
console.log("http server running in", port);
const Client = require('./client');
const Session = require('./session');
const sessions = new Map;
const wss = new WebSocketServer({server: server});
console.log("WebSocket sever created");

function createClient(connection, id = createId()){
  return new Client(connection, id);
}

function createId(len = 6, chars = 'abcdefghjkmnopqrstwxz0123456789')
{
  let id = '';
  while(len--){
    id += chars[Math.random() * chars.length | 0];
  }
  return id
}
function createSession(id = createId()){
  if(sessions.has(id)){
    throw new Error(`Session ${id} already exists`)
  }
  const session = new Session(id);
  console.log('Creating session', session);

  sessions.set(id, session);
  return session;
}

function getSession(id){
  return sessions.get(id);
}

function broadCastSession(session){
  const clients = [...session.clients];
  clients.forEach(client =>{
    client.send({
      type:'session-broadcast',
      peers:{
        you: client.id,
        clients: clients.map(client => {
          return {
            id: client.id,
            state: client.state,
          }
        }),
      },
    });
  });
}
/*const clientPath = `${__dirname}`
const server = http.createServer(app);
app.use(express.static(clientPath));
*/
/*
server.on('error', (err) => {
  console.error('server error:', err);
});

server.listen(8080, () =>{
  console.log('Server has initialized');
});
*/
wss.on('connection', connection => {
  console.log('connection established');
  const client = createClient(connection);
  connection.on('message', msg =>{
    console.log('message received', msg);
    const data = JSON.parse(msg);
      if(data.type === 'create-session')
      {
        const session = createSession();
        session.join(client);
        client.state = data.state;
        sessions.set(session.id, session);
        client.send({
          type: 'session-created',
          id: session.id,
        });
      } else if (data.type === 'join-session'){
          const session = getSession(data.id) || createSession(data.id);
          client.state = data.state;
          session.join(client);

          broadCastSession(session);
      } else if(data.type === 'state-update'){
        const[property, value] = data.state;
        client.state[data.fragment][property] = value;
        client.broadcast(data);
      }
  });
  connection.on('close', () => {
    console.log('connection closed');
    const session = client.session;
    if(session){
      session.leave(client);
      if (session.clients.size === 0){
        sessions.delete(session.id);
      }
    }
    //clearInterval(session);
    broadCastSession(session);
  });
});
