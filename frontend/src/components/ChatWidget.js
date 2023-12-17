import React, { useEffect } from 'react';

function ChatWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}

export default ChatWidget;
