import { io } from "socket.io-client"
const socket = io('http://localhost:8000/tracking',{
    // autoConnect: false,
})

export default socket;