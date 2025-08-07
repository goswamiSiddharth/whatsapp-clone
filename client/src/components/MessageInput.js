// import React, { useState } from 'react';

// const MessageInput = ({ sendMessage, disabled }) => {
//   const [content, setContent] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (content.trim()) {
//       sendMessage(content);
//       setContent('');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 bg-gray-100 border-t border-gray-200 flex items-center">
//       <input
//         type="text"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Type a message..."
//         disabled={disabled}
//         className="flex-1 p-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-200"
//       />
//       <button
//         type="submit"
//         disabled={disabled}
//         className="ml-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 disabled:bg-gray-400"
//       >
//         Send
//       </button>
//     </form>
//   );
// };

// export default MessageInput;



// client/src/components/MessageInput.js
// Input form for sending messages

import React, { useState } from 'react';

const MessageInput = ({ sendMessage, disabled }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-gray-100 border-t border-gray-200 flex items-center w-full">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 p-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-200 text-sm"
      />
      <button
        type="submit"
        disabled={disabled}
        className="ml-2 bg-green-600 text-white px-3 py-2 rounded-full hover:bg-green-700 disabled:bg-gray-400 text-sm"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;