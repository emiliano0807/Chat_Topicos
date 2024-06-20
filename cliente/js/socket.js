import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js"
const url = 'http://localhost:3000'
const url2 = 'https://chat-fronted-topicos.onrender.com'

const users=["Irbin", "Genaro", "Paco", "Angel", "Emiliano", "Lalo", "Francisco", "Luis", "Jorge", "Ricardo", "Raul", "Eduardo", "Carlos", "Juan", "Pedro", "Jose", "Manuel", "Miguel", "Antonio", "Jesus", "Alejandro", "David", "Daniel", "Jose Luis", "Javier", "Fernando", "Alberto", "Ramon", "Roberto", "Arturo", "Victor", "Oscar", "Rafael", "Sergio", "Mauricio", "Hector", "Guillermo", "Adrian", "Martin", "Salvador", "Rodrigo", "Ruben", "Mario", "Francisco Javier", "Erick", "Hugo", "Enrique", "Armando", "Gustavo", "Pablo", "Alejandro", "Luis", "Jorge", "Ricardo", "Raul", "Eduardo", "Carlos", "Juan", "Pedro", "Jose", "Manuel", "Miguel", "Antonio", "Jesus", "Alejandro", "David", "Daniel", "Jose Luis", "Javier", "Fernando", "Alberto", "Ramon", "Roberto", "Arturo", "Victor", "Oscar", "Rafael", "Sergio", "Mauricio", "Hector", "Guillermo", "Adrian", "Martin", "Salvador", "Rodrigo", "Ruben", "Mario", "Francisco Javier", "Erick", "Hugo", "Enrique", "Armando", "Gustavo", "Pablo"]

const getUsername=()=>{
    const randomUser= Math.floor(Math.random() * users.length);
    return users[randomUser];
}
let socket = io(url2,{
    auth: {
        username: getUsername(),
        serverOffset: 0
    }
})
const form = document.getElementById('form')
const input = document.getElementById('message')
const messages = document.getElementById('chat')


socket.on('chat message', (msg, sender, serverOffset)=>{
    socket.auth.serverOffset= serverOffset
    const item = document.createElement('li');
    const msgg= [`<strong>${sender}:</strong> <br>${msg}</br>`, `${msg}`];
    item.innerHTML = (sender=== socket.auth.username)? msgg[1] : msgg[0];
    

    if(sender=== socket.auth.username){
        item.classList.add('message-right')
    }else{
        item.classList.add('message-left')
    }
    messages.appendChild(item)
    messages.scrollTop = messages.scrollHeight
})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.value) {
        socket.emit('chat message', input.value, socket.auth.username, socket.auth.serverOffset)
        input.value = ""
    }
})
