const express = require("express");
const http = require('http');
const path = require("path");
const { Server: WebSocketServer } = require("ws");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/views"));
app.set("views", path.join(__dirname, "views"));

app.get('/', (req, res) => {
  res.render('index2.ejs');
});

const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

let players = {}; // Memorizza le posizioni dei giocatori

// Quando un giocatore si connette, assegnagli un ID univoco
wsServer.on('connection', (ws) => { 
   const playerId = Object.keys(players).length + 1;

   // Memorizza le informazioni del giocatore
   players[playerId] = { 
      ws: ws, // WebSocket del giocatore
      pos: 150 // Posizione iniziale del giocatore
   };

   // Invia un messaggio di connessione al client
   ws.send(JSON.stringify({ type: 'connect', playerId }));

   console.log(`Nuova connessione WebSocket: Giocatore ${playerId}`);

   // Memorizza lo stato corrente dei movimenti dei giocatori
const playerMovements = {
   1: { up: false, down: false },
   2: { up: false, down: false }
 };
 
 // Gestione del messaggio inviato dal client
 ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'movementStart') {
       const { playerId, direction } = data;
       playerMovements[playerId][direction] = true;
    } else if (data.type === 'movementEnd') {
       const { playerId, direction } = data;
       playerMovements[playerId][direction] = false;
    }
 });
 

   // Gestione della disconnessione del client
   ws.on('close', () => {
      delete players[playerId];
      const disconnect = JSON.stringify({ type: 'disconnect', playerId });
      Object.values(players).forEach((player) => {
         player.ws.send(disconnect);
      });
      console.log(`Disconnessione WebSocket: Giocatore ${playerId}`);
   });
});

try {
  server.listen(port, () => console.log(`Server listening on port ${port}!`));
} catch (error) {
  console.error('Error starting server:', error.message);
}
