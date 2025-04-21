1.How to scale websocket using Redis?
2.
    server(socket.io) ->webserver which supports socket.io
    |      |         |
   user1   user2    user3

haar user server ke sath apna apna socket connection banata  h.

     server(socket.io) 
    |      |         |
   user1   user2    user3

ye architecture kabhi bhi scale nhi ho sakta.

->suppose maine AWS pe autoscaling laga diya hai.
-> Now, number of users increase hue to,automatic ek new server create ho jayega .

  server1         server2
 |      |             |
 user1  user2       user3

Note:- Every user and Every server ke bich socket connection hai.

pehle user1 and user2 server 1 se connected tha and dono apas me chat kar rha tha.Ab user3 aaya and server2 se connect ho gya.
Now,The problem is user1  kabhi bhi user3 ko message send nhi kar payega ,because both are in different server.