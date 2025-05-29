import http from 'http';
import SocketService from './socket';

async function init(){

    const socketService=new SocketService();

    const httpServer = http.createServer() ;
    const PORT=process.env.PORT ? process.env.PORT:8000;

    socketService.io.attach(httpServer);

    httpServer.listen(PORT,()=>
        console.log(`http server started at ${PORT}`)
    );

    socketService.initListiner();
}

init();