// // client/src/components/MessageList.js
// // Displays messages with WhatsApp-like styling and status ticks

// import React from 'react';

// const MessageList = ({ messages }) => {
//   console.log('Messages:', messages);
//   return (
//     <div className="flex-1 p-2 overflow-y-auto overflow-x-hidden bg-[#e5ddd5] w-full box-border">
//       {messages.map((message) => (
//         <div
//           key={message.messageId}
//           className={`flex mb-2 ${
//             message.from === '918329446654' ? 'justify-end' : 'justify-start'
//           }`}
//         >
//           <div
//             className={`max-w-[75%] sm:max-w-[65%] p-2 rounded-lg shadow-sm ${
//               message.from === '918329446654'
//                 ? 'bg-[#dcf8c6]'
//                 : 'bg-white border border-gray-200'
//             }`}
//           >
//             <p className="text-xs font-semibold">{message.sender}</p>
//             <p className="text-xs break-words">{message.content}</p>
//             <div className="text-xs text-gray-500 flex justify-end items-center">
//               {new Date(message.timestamp).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//               {message.from === '918329446654' && (
//                 <span className="ml-1">
//                   {message.status === 'sent' ? '✓' : message.status === 'delivered' ? '✓✓' : '✓✓🟢'}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MessageList;




// client/src/components/MessageList.js
// Displays messages with WhatsApp-like styling and status ticks

import React from 'react';

const MessageList = ({ messages }) => {
  console.log('Messages:', messages);
  return (
    <div className="flex-1 p-2 overflow-y-auto overflow-x-hidden bg-[#e5ddd5] w-full box-border">
      {messages.map((message) => (
        <div
          key={message.messageId}
          className={`flex mb-2 ${
            message.sender === 'Business' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[75%] sm:max-w-[65%] p-2 rounded-lg shadow-sm ${
              message.sender === 'Business'
                ? 'bg-[#dcf8c6]'
                : 'bg-white border border-gray-200'
            }`}
          >
            <p className="text-xs font-semibold">{message.sender}</p>
            <p className="text-xs break-words">{message.content}</p>
            <div className="text-xs text-gray-500 flex justify-end items-center">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {message.sender === 'Business' && (
                <span className="ml-1">
                  {message.status === 'sent' ? '✓' : message.status === 'delivered' ? '✓✓' : '✓✓🟢'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;