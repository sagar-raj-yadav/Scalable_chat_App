## GOAL:-How to scale websocket using Redis?

## PROBLEM STATEMENT:-
    server(socket.io) ->server which supports socket.io
    |      |         |
   user1   user2    user3

haar user server ke sath apna apna socket connection banata  h.

     server(socket.io) 
    |      |         |
   user1   user2    user3

ye architecture kabhi bhi scale nhi ho sakta.

->suppose maine AWS pe autoscaling laga diya hai.
-> Now,when number of users increase hue to,automatic ek new server create ho jayega .

  server1         server2 (newly created server)
 |      |             |
 user1  user2       user3

Note:- Every user and Every server ke bich socket connection hai.

pehle user1 and user2 server 1 se connected tha and dono apas me chat kar sakte h.  
Ab user3 aaya and server2 se connect ho gya.  
Now, The problem is user1 kabhi bhi user3 ko message send nhi kar payega, because both are in different server.

user1 sirf user2 ke sath communicate kar sakta h, because dono same server pe conected hai.

## SOLUTION:- Redis Adapter for Socket.IO

To solve this issue, humein ek **common communication channel** chahiye jahan sab server apna socket info daalein, aur baaki servers bhi use read kar sakein.
Yahi kaam **Redis** karta hai.

### Redis kya karega?

- Redis ek **Pub/Sub (Publish/Subscribe)** system ki tarah kaam karega.
- Jab user1 koi message send karega (server1 pe),
- To Redis us message ko publish karega,
- Aur jo bhi server (jaise server2 jisme user3 connected hai) us channel ko subscribe kiya hua hai,
- Wo message receive karega aur user3 ko forward karega.

Note:-Redis sabhi servers ko ek dusre se milwa deta hai — ek beech ka pul ban jaata hai.

Is architecture mein, sabhi socket.io servers Redis ke through ek dusre se connected hote hain. Jab bhi ek user kisi message ko send karta hai, wo message Redis ke zariye sabhi connected servers tak pahunchta hai, jisse users kisi bhi server se dusre users ke sath communicate kar sakte hain, chahe wo kisi bhi server par connected ho. Ye setup scalability ko enhance karta hai aur real-time communication ko seamless banata hai.


### Architecture
Ek REDIS server ko setup karnege and ye redis AIVEN platform ke run karega .
                                
                _______________REDIS____  
                |                       | 
              server1                server2
     _________|_____                  _____|______
    |               |                |           |
    user1        user2               user3       user4
    
Note:  yaha hum PUB/SUB architecture ka use karnege

## TECH STACK?
Node.Js , Next.js . Turbo Repo , Redis on Aiven

## Turbo Repo?

setup Turb Repo project:- npx create-turbo@latest

TurboRepo ek build system hai jo JavaScript/TypeScript monorepos ke liye bana hai (React, Next.js, Node.js, etc.). Iska kaam hai tere projects ko fast, smart aur efficient banana.

=> Monorepo ->ek hi repository ke andar hum apna backend,frontend ,libraries sab rakh sakte h. Inn sab ko turbo.json manage karta h.

=> run Monorepo -> npm run dev

why we use Turbo repo?
i.Turbo smartly samajhta hai ki kya change hua hai.
ii.Sirf wahi part dubara build hota hai jo change hua ho.


### setup
1.make a folder named server inside (chatApp->apps->server)
2.create package.json
{
  "name": "server",
  "version": "1.0.0",
  "private": true,
}
3.go to terminal
4.npm install  server typescript --save-dev
5.this will install typescript devDependency inside the package.json of server.
6.go to inside server folder -> generate tsconfig.json => npx tsc --init

# Install socket.io
npm install -w server socket.io

# EMIT and SUBSCRIBE message
user1 message emit karta h(means server pe send karaa h)
user2,user3..ye sab message ko subscribe kiye h to,ye message sabko chala jayega.


     user1          user2                user3
  EVENT Emit       EVENT subscribe      EVENT subscribe
MESSAGE:hello        MESSAGE             MESSAGE