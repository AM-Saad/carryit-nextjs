import { io } from "socket.io-client"
const socket = io('http://192.168.1.3:8000/driver/move')

export default socket;