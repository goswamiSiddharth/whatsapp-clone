// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import MessageList from './components/MessageList';
// import ChatList from './components/ChatList';
// import MessageInput from './components/MessageInput';

// const socket = io(
//   process.env.NODE_ENV === 'development'
//     ? 'http://localhost:5000'
//     : 'https://whatsapp-clone-jfiz.vercel.app',
//   { transports: ['websocket'] }
// );

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showChatList, setShowChatList] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(
//           process.env.NODE_ENV === 'development'
//             ? 'http://localhost:5000/messages/users'
//             : 'https://whatsapp-clone-jfiz.vercel.app/messages/users'
//         );
//         const data = await response.json();
//         console.log('Fetched users:', data);
//         setUsers(data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
//     fetchUsers();

//     const fetchMessages = async () => {
//       if (selectedUser) {
//         try {
//           const response = await fetch(
//             process.env.NODE_ENV === 'development'
//               ? `http://localhost:5000/messages/${encodeURIComponent(selectedUser)}`
//               : `https://whatsapp-clone-jfiz.vercel.app/messages/${encodeURIComponent(selectedUser)}`
//           );
//           const data = await response.json();
//           console.log(`Fetched messages for ${selectedUser}:`, data);
//           setMessages(data);
//         } catch (error) {
//           console.error(`Error fetching messages for ${selectedUser}:`, error);
//         }
//       } else {
//         setMessages([]);
//       }
//     };
//     fetchMessages();

//     socket.on('newMessage', (message) => {
//       console.log('New message received via WebSocket:', message);
//       if (message.sender === selectedUser || message.recipient === selectedUser) {
//         setMessages((prev) => {
//           if (!prev.find((msg) => msg.messageId === message.messageId)) {
//             return [...prev, message];
//           }
//           return prev;
//         });
//       }
//     });

//     socket.on('statusUpdate', ({ messageId, status }) => {
//       console.log(`Status update for ${messageId}: ${status}`);
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.messageId === messageId ? { ...msg, status } : msg
//         )
//       );
//     });

//     return () => {
//       socket.off('newMessage');
//       socket.off('statusUpdate');
//     };
//   }, [selectedUser]);

//   const sendMessage = async (text) => {
//     if (!selectedUser) return;
//     const payload = {
//       payload_type: 'whatsapp_webhook',
//       metaData: {
//         entry: [
//           {
//             changes: [
//               {
//                 field: 'messages',
//                 value: {
//                   messaging_product: 'whatsapp',
//                   metadata: {
//                     display_phone_number: '918329446654',
//                     phone_number_id: '629305560276479',
//                   },
//                   contacts: [
//                     {
//                       profile: { name: selectedUser },
//                       wa_id: selectedUser === 'Ravi Kumar' ? '919937320320' : '929967673820',
//                     },
//                   ],
//                   messages: [
//                     {
//                       from: '918329446654',
//                       id: `wamid.${Date.now()}`,
//                       timestamp: Math.floor(Date.now() / 1000).toString(),
//                       text: { body: text },
//                       type: 'text',
//                     },
//                   ],
//                 },
//               },
//             ],
//             id: '30164062719905276',
//           },
//         ],
//         gs_app_id: 'conv1-app',
//         object: 'whatsapp_business_account',
//       },
//     };

//     try {
//       const response = await fetch(
//         process.env.NODE_ENV === 'development'
//           ? 'http://localhost:5000/messages'
//           : 'https://whatsapp-clone-jfiz.vercel.app/messages',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error ${response.status}`);
//       }
//       const newMessage = await response.json();
//       console.log('Sent message:', newMessage);
//       if (newMessage.recipient === selectedUser || newMessage.sender === selectedUser) {
//         setMessages((prev) => {
//           if (!prev.find((msg) => msg.messageId === newMessage.messageId)) {
//             return [...prev, newMessage];
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen w-full overflow-x-hidden max-w-7xl mx-auto bg-gray-100">
//       <div className={`${showChatList ? 'block' : 'hidden'} md:block w-full md:w-1/3`}>
//         <ChatList
//           users={users}
//           setSelectedUser={(user) => {
//             setSelectedUser(user);
//             setShowChatList(false);
//           }}
//         />
//       </div>
//       <div className={`${showChatList ? 'hidden' : 'flex'} md:flex flex-1 flex-col w-full`}>
//         {selectedUser && (
//           <div className="flex items-center p-2 bg-green-600 text-white w-full">
//             <button
//               className="md:hidden mr-3 text-white text-lg"
//               onClick={() => setShowChatList(true)}
//             >
//               ←
//             </button>
//             <h2 className="text-base md:text-lg font-semibold">{selectedUser}</h2>
//           </div>
//         )}
//         <MessageList messages={messages} />
//         <MessageInput sendMessage={sendMessage} disabled={!selectedUser} />
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MessageList from './components/MessageList';
import ChatList from './components/ChatList';
import MessageInput from './components/MessageInput';

// Initialize Socket.IO with fallback and reconnection
const socket = io(
  process.env.REACT_APP_WS_URL || 'https://whatsapp-clone-jfiz.vercel.app',
  {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  }
);

// Error boundary to prevent app crash
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <h1>Failed to load chats. Please refresh or try again later.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL || 'https://whatsapp-clone-jfiz.vercel.app/messages/users'
        );
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();

    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL || 'https://whatsapp-clone-jfiz.vercel.app'}/messages/${encodeURIComponent(selectedUser)}`
          );
          if (!response.ok) throw new Error(`HTTP error ${response.status}`);
          const data = await response.json();
          console.log(`Fetched messages for ${selectedUser}:`, data);
          setMessages(data);
        } catch (error) {
          console.error(`Error fetching messages for ${selectedUser}:`, error);
        }
      } else {
        setMessages([]);
      }
    };
    fetchMessages();

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
    socket.on('newMessage', (message) => {
      console.log('New message received via WebSocket:', message);
      if (message.sender === selectedUser || message.recipient === selectedUser) {
        setMessages((prev) => {
          if (!prev.find((msg) => msg.messageId === message.messageId)) {
            return [...prev, message];
          }
          return prev;
        });
      }
    });

    socket.on('statusUpdate', ({ messageId, status }) => {
      console.log(`Status update for ${messageId}: ${status}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, status } : msg
        )
      );
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('newMessage');
      socket.off('statusUpdate');
    };
  }, [selectedUser]);

  const sendMessage = async (text) => {
    if (!selectedUser) return;
    const payload = {
      payload_type: 'whatsapp_webhook',
      metaData: {
        entry: [
          {
            changes: [
              {
                field: 'messages',
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '918329446654',
                    phone_number_id: '629305560276479',
                  },
                  contacts: [
                    {
                      profile: { name: selectedUser },
                      wa_id: selectedUser === 'Ravi Kumar' ? '919937320320' : '929967673820',
                    },
                  ],
                  messages: [
                    {
                      from: '918329446654',
                      id: `wamid.${Date.now()}`,
                      timestamp: Math.floor(Date.now() / 1000).toString(),
                      text: { body: text },
                      type: 'text',
                    },
                  ],
                },
              },
            ],
            id: '30164062719905276',
          },
        ],
        gs_app_id: 'conv1-app',
        object: 'whatsapp_business_account',
      },
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL || 'https://whatsapp-clone-jfiz.vercel.app/messages',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const newMessage = await response.json();
      console.log('Sent message:', newMessage);
      if (newMessage.recipient === selectedUser || newMessage.sender === selectedUser) {
        setMessages((prev) => {
          if (!prev.find((msg) => msg.messageId === newMessage.messageId)) {
            return [...prev, newMessage];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col md:flex-row h-screen w-full overflow-x-hidden max-w-7xl mx-auto bg-gray-100">
        <div className={`${showChatList ? 'block' : 'hidden'} md:block w-full md:w-1/3`}>
          <ChatList
            users={users}
            setSelectedUser={(user) => {
              setSelectedUser(user);
              setShowChatList(false);
            }}
          />
        </div>
        <div className={`${showChatList ? 'hidden' : 'flex'} md:flex flex-1 flex-col w-full`}>
          {selectedUser && (
            <div className="flex items-center p-2 bg-green-600 text-white w-full">
              <button
                className="md:hidden mr-3 text-white text-lg"
                onClick={() => setShowChatList(true)}
              >
                ←
              </button>
              <h2 className="text-base md:text-lg font-semibold">{selectedUser}</h2>
            </div>
          )}
          <MessageList messages={messages} />
          <MessageInput sendMessage={sendMessage} disabled={!selectedUser} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;