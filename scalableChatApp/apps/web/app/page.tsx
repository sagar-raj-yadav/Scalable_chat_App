'use client';

import classes from './page.module.css';
import { useSocket } from '../context/SocketProvider';
import { useState } from 'react';

export default function Page() {
  const { sendMessage , Messages } = useSocket();
  const [message, setMessage] = useState('');

  return (
    <div>
      <div>
        <h1>All messages will appear here:</h1>
      </div>
      <div>
        <input
          className={classes["chat-input"]}
          placeholder="message...."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={() => {
            sendMessage(message);
            setMessage('');
          }}
          className={classes["button"]}
        >
          Send
        </button>
      </div>

      <div>
        {
        Messages.map((mymessage, index) =>(
        <li key={index}>{mymessage.message}</li>
        ))
      }
      </div>
    </div>
  );
}
