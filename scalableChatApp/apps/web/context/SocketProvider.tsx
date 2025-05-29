'use client'

import React, { useCallback, useContext, useEffect, useState } from "react";
import {io,Socket} from 'socket.io-client';


interface SocketProviderProps{
    children ?:React.ReactNode
}

interface ISocketContext{
    sendMessage:(msg:string)=>any;
    Messages: { message: string }[];
}


const SocketContext=React.createContext<ISocketContext | null>(null);


export const useSocket=()=>{
    const state=useContext(SocketContext);

    if(!state) throw new Error('state is undefined');

    return state;
};




export const SocketProvider:React.FC<SocketProviderProps>=({children})=>{
    
    const [socket,setSocket]=useState<Socket>();

    const [Messages,setMessages]=useState<{message:string}[]>([]);


    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log('send message', msg);

        if(socket){
            socket.emit('event:message',{message:msg});
        }


    }, [socket]);

    const onMessageReceived=useCallback((msg:string)=>{
        console.log("form server msg received",msg);
        const message=JSON.parse(msg) as {message:string};
        setMessages((prev)=>[...prev,message]);
    },[]);



    useEffect(()=>{
        const _socket=io('http://localhost:8000');
        setSocket(_socket);

        _socket.on('message',onMessageReceived);
        
        return ()=>{
        _socket.disconnect();
        _socket.off('message');
        setSocket(undefined);
        }
    },[]);



    const contextValue: ISocketContext = {
        sendMessage , Messages
    };


    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    )
}
