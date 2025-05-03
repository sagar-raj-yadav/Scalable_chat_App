import {Server} from 'socket.io';

class SocketService{
    private _io:Server;

    constructor(){
        console.log("init soclet server");
        this._io=new Server();
    }

    public initListener(){
        const io=this.io;

        console.log('initialised socket listener....');

        io.on('connect',(socket)=>{
            console.log(`new socket connected`,socket.id);

            socket.on(`event:message`,async ({message}:{message:string})=>{
                console.log('new message received',message);
            })
        })
    }

    get io(){
        return this._io;
    }
}

export default SocketService;