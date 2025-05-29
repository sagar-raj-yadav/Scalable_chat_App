## GOAL:-How to scale chat App using  websocket and Redis?

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
- Jab user1 koi message send karega (server1 se),
- To Redis us message ko publish karega,
- Aur jo bhi server (jaise server2 jisme user3 connected hai) us channel ko subscribe kiya hua hai,
- Wo message receive karega aur user3 ko forward karega.

Note:-Redis sabhi servers ko ek dusre se milwa deta hai — ek beech ka bridge ban jaata hai.

Is architecture mein, sabhi 'socket.io servers' Redis ke through ek dusre se connected hote hain. Jab bhi ek user kisi message ko send karta hai, wo message Redis ke zariye sabhi connected servers tak pahunchta hai, jisse users kisi bhi server se dusre users ke sath communicate kar sakte hain, chahe wo kisi bhi server par connected ho. Ye setup scalability ko enhance karta hai aur real-time communication ko seamless banata hai.


### Architecture
Ek REDIS server ko setup karnege and ye redis AIVEN platform pe run karega .
                                
                _______________REDIS____  
                |                       | 
              server1                server2
     _________|_____                  _____|______
    |               |                |           |
    user1        user2               user3       user4
    
Note:  yaha hum PUB/SUB architecture ka use karnege

## TECH STACK?
Node.Js , Next.js . Turbo Repo , Redis on Aiven

## setup TurboRepo?
TurboRepo -> monorepo ko manage karne ka tool h

=> Monorepo ->ek hi repository ke andar hum apna backend,frontend ,libraries sab rakh sakte h. Inn sab ko turbo.json manage karta h.

steps :-
i.Install Turb Repo project:- " npx create-turbo@latest "
ii.Ok to proceed? (y) ->  press enter 
iii.Where would you like to create your Turborepo? (./my-turborepo) scalableChatApp -> scalableChatApp -> write name of your project 
iv.select npm
v.cd scalableChatApp
vi." npm run dev " -> run Monorepo  ( isme )

open  folder :- scalableChatApp -> apps -> isme 2 folder h web and docs -> web mera main folder h , jisme project ka code rahega and docs is for documentation



### setup server folder inside apps
=> Make a server folder inside apps.
open  folder :- scalableChatApp -> apps -> make folder " server "

1.make a folder named server inside (chatApp->apps->server)
2.npm init -y
3.go to terminal
4.install typescript inside server,
open server folder in integrated terminal , write " npm i  --save-dev  typescript " 
5.this will install typescript devDependency inside the package.json of server.
6.Also install " npm install --save-dev tsc-watch "
7." npx tsc --init " -> make tsconfig.json file
8.tsconfig.json file me kuch changes krna h , 

change =>  "rootDir": "./" , -> "rootDir": "./src",
change =>  "outDir": "./",   ->  "outDir": "./dist",

9.Inside package.json of server, make these changes

"scripts": {
    "start": "node dist/index",
    "build":"tsc -p .",
    "dev":"tsc-watch --onSuccess \"node dist/index.js\" ",
  },

10.inside server folder -> make index.ts file 


# Install socket.io
i.open server on integrated terminal
ii.npm install socket.io
iii.create  socket.ts -> jitna bhi socket ka kaam hoga wo isme hoga

# Our main goal:-
socket ke upar kuch event ko listen karna h and uss event ko redis ke sath sync karna h.

# flow
i.user event ko emit karega ( user message ko server pe send karega )
ii.server event ko listen karega
iii.server event ko redis me save karega
iv.redis  save hua event ko listen karega
v.redis event ko emit karega


# EMIT and SUBSCRIBE message
i.user1 message emit karta h(means server pe send karaa h)
ii.user2..ye sab message ko subscribe kiye h to,ye message sabko chala jayega.
iii.ye message user4 ko nhi jayega , because server1 and server2 apas me connected nhi h -> this is the problem and i have to solve this issue.

   
                _______________REDIS____  
                |                       | 
              server1                server2
     _________|_____                  _____|______
    |               |                |           |
    user1        user2               user3       user4
  EVENT Emit   EVENT subscribe
MESSAGE:hello     MESSAGE


->user1 ka MESSAGE pehle server pe jayega fir server se REDIS me jayega, fir REDIS se MESSAGE server2 pe jayega fir user3 ko receive ho jayega,
