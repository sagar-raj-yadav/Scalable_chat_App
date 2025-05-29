
import {Server} from 'socket.io';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();


const redisHost = 'valkey-164b646d-sagarrajyadav2002-4ccc.d.aivencloud.com';
const redisPort =14431; // force convert to number
const redisUser = 'default';
const redisPassword = process.env.REDIS_PASSWORD;


const pub=new Redis({
  host: redisHost,
  port: redisPort,
  username: redisUser,
  password: redisPassword,
});
 


const sub=new Redis({
  host: redisHost,
  port: redisPort,
  username: redisUser,
  password: redisPassword,
});



pub.on('error', (err) => {
    console.error('Redis PUB Error:', err);
});

sub.on('error', (err) => {
    console.error('Redis SUB Error:', err);
});



class SocketService{

    private  _io:Server;

    constructor(){
        console.log('init socket server');

        this._io=new Server({
            cors: {
                allowedHeaders:["*"],
                origin:"*"
            }
        });

        sub.subscribe('MESSAGES');
    }

    //initialize all the event listener
    public initListiner(){
        const io=this.io;

        console.log('initialize socket listener');

        io.on('connect',socket=>{
            console.log('new socket conneted',socket.id);
            socket.on('event:message',async ({message}:{message:string})=>{
                console.log('new message received from client',message);

                //publish this message to redis
                await pub.publish('MESSAGES',JSON.stringify({message}));
            });
        });

        sub.on('message',(channel,message)=>{
            if(channel==='MESSAGES'){
                io.emit('message',message);
            }
        });

        
    }

    get io(){
        return this._io;
    }
}

export default SocketService;