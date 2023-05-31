import { io } from "socket.io-client"
const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}/tracking`,{
    autoConnect: true,
    
})

export default socket;

