const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const cheatHeader = document.querySelector('.chat-header')
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true

    
})
console.log(username,room)

const socket = io()

socket.emit('joinRoom',{username,room})

socket.on('roomUsers',({room,users})=>{

    outputRoomName(room)
    outputUsers(users)
})

socket.on('message', message =>{
    console.log(message)

    outputMessage(message)
    chatMessage.scrollTop = chatMessage.scrollHeight;
})


chatForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    const msg = document.getElementById('msg').value
     
    console.log(msg)

    

  if(!msg){
      return false
  }

    socket.emit('chatMessage', msg)


    document.getElementById('msg').value = ""
    document.getElementById('msg').focus()
})

function outputMessage(message){
     const div = document.createElement('div')
     div.classList.add('message')

     div.innerHTML = `<p class = 'meta'>${message.username}<span>${message.time}</span></p>
     <p class = 'text'>
     
     ${message.text}
     
     </p>
     `;
     document.querySelector('.chat-messages').appendChild(div)

     
       
      
}

function outputRoomName(room){
   roomName.innerText = room

   
}

function outputUsers(users){

    userList.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      li.classList.add('list')
      li.innerText = user.username;
      userList.appendChild(li);
    });

    


   
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('EMİN MİSİNİZ?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });