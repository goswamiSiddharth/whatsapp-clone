
// // client/src/components/ChatList.js
// // Sidebar with dynamic user contacts fetched from backend

// import React, { useState, useEffect } from 'react';

// const ChatList = ({ setSelectedUser }) => {
//   const [contacts, setContacts] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/messages/users');
//         const data = await response.json();
//         setContacts(data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Map user names to wa_id for display
//   const getWaId = (name) => {
//     return name === 'Ravi Kumar' ? '919937320320' : '929967673820';
//   };

//   return (
//     <div className="w-full md:w-1/3 bg-white border-r border-gray-200 h-screen overflow-y-auto">
//       <div className="p-4 bg-green-600 text-white sticky top-0 z-10">
//         <h2 className="text-lg font-semibold">Chats</h2>
//       </div>
//       <ul>
//         {contacts.map((contact) => (
//           <li
//             key={contact}
//             className="p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer flex items-center"
//             onClick={() => setSelectedUser(contact)}
//           >
//             <div className="flex-1">
//               <p className="text-sm font-medium">{contact}</p>
//               <p className="text-xs text-gray-500">{getWaId(contact)}</p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChatList;




// client/src/components/ChatList.js
// Sidebar with dynamic user contacts fetched from backend

import React, { useState, useEffect } from 'react';

const ChatList = ({ users, setSelectedUser }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/messages/users');
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Map user names to wa_id for display
  const getWaId = (name) => {
    return name === 'Ravi Kumar' ? '919937320320' : '929967673820';
  };

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-3 bg-green-600 text-white sticky top-0 z-10">
        <h2 className="text-base md:text-lg font-semibold">Chats</h2>
      </div>
      <ul>
        {contacts.map((contact) => (
          <li
            key={contact}
            className="p-3 md:p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={() => setSelectedUser(contact)}
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{contact}</p>
              <p className="text-xs text-gray-500">{getWaId(contact)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;