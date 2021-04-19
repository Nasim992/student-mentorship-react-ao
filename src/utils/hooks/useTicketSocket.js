import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import Define from '../helpers/Define'


let socket = null
export default function useTicketSocket() {

    const [list, setList] = useState([])

    useEffect(() => {
        //init the socket
        socket = io(Define.API_BASE_URL, { transport: ["websocket"] })
        //clean up the socket
        return () => {
            //socket.emit(Define.DISCONNECT)
            socket.off()
        }
    }, [])
    //create ticket
    const joinTicket = (ticket) => {
        console.log("joining socket")
        if (socket) {
            //on page load you joined on room this
            socket.emit(Define.JOIN_TICKET, ticket)
        }
    }
    //create message
    const createMessage = (message) => {
        if (socket) {
            //on page load you joined on room this
            socket.emit(Define.CREATE_MESSAGE, message)
            setList([message, ...list])
        }
    }
    //recieved message
    useEffect(() => {
        socket.on(Define.RECIEVE_MESSAGE, (message) => {
            setList([message, ...list])
        })
    })

    return [list, setList, joinTicket, createMessage]
}
