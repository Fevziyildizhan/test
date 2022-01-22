const path = require('path')
const http = require('http')
const express = require('express')
const app = express()
const socketio = require('socket.io')
//const port = 3000
//const hostname = '127.0.0.1'

const formatMessage = require('./utils/messages')
const {getCurrentUser,userJoin,userLeave, getRoomUsers} = require('./utils/users')
const server = http.createServer(app)
const io = socketio(server);
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json())
app.get('/', (req,res)=>{
     res.send('index.html')
})

const botname = 'URAL'

io.on('connection', (socket)=>{
    console.log('a user connection')


 socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id,username,room)

    socket.join(user.room)

    socket.emit('message',formatMessage(botname,'Hİ CHAT UYGULAMASINA HOŞGELDİNİZ'))

    socket.broadcast.to(user.room).emit('message', formatMessage(botname,`${user.username} Hoşgeldiniz`))

    io.to(user.room).emit('roomUsers',{
        room : user.room,
        users : getRoomUsers(user.room)
    })
 })

   /* socket.emit('message',formatMessage(botname,'welcome to hi chat'))

    socket.broadcast.emit('message', formatMessage(botname,'A user has joined the chat'))*/

  

    socket.on('chatMessage',msg =>{
           const user = getCurrentUser(socket.id)
       /* io.emit('message', msg)*/
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

    socket.on('disconnect', ()=>{

       const user = userLeave(socket.id)

       if(user){
        io.to(user.room).emit('message', formatMessage(botname,`${user.username} güle güle`)
        )

        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        })
       }

       // io.emit('message', formatMessage(botname,'A user has left the chat'))
    })
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})

/*server.listen(port,hostname,()=>{
    console.log('server çalışıyor',`http://${hostname}:${port}`)
})*/