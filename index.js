import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import {createServer} from 'node:http';
import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config()


const servidores = [
    {
      host: process.env.host,
      port: process.env.port,
      database: process.env.database,
      user: process.env.user,
      password: process.env.password

    },
    {
      host: process.env.host2,
      port: process.env.port2,
      database: process.env.database2,
      user: process.env.user2,
      password: process.env.password2

    }
]
const connection= mysql.createConnection(servidores[1])
connection.connect(function(err) {
  if (err) {
    console.error('No se pudo conectar a la BD' || err)
    return;
  }

  console.log('Conectado en la BD ');
});
const createTable=`CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    message TEXT NOT NULL
);`

connection.query(createTable, (err, results)=>{
  if(err){
    console.log('No se pudo crear la tabla')
  }
});



const PORT = 3000;


const app = express();

const server = createServer(app)
const io = new Server(server,{
  cors:{
    origin: "*",
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket)=>{
  console.log('Usuario conectado');
  socket.on('disconnect', ()=>{
    console.log('Usuario desconectado');
  })
  socket.on('chat message', (msg, auth, serverOffset)=>{
    connection.query('INSERT INTO messages (message, usuario) VALUES (?, ?);', [msg, auth], (err, results)=>{
      if(err){
        console.log('No se pudo obtener los mensajes')
      }
    console.log({user: auth, message: msg, serverOffset})
    io.emit('chat message', msg, auth, serverOffset)
    });
  })

  if(!socket.recovered){
    connection.query('SELECT * FROM messages WHERE id > (?);',[socket.handshake.auth.serverOffset], (err, results) => {
        if (err) {
            console.log('No se pudo obtener el último mensaje', err);
            return;
        }
        results.forEach(row => {
          console.log( row.content, socket.handshake.auth.serverOffset)
          socket.emit('chat message',  row.content, row.usuario, socket.handshake.auth.serverOffset);
        });
    
    });
  }



});
app.get('/', (req, res) => {
  res.send("Server online")
});


server.listen(PORT, () => {
    console.log(`Server listo en el puerto ${PORT}`);
});
