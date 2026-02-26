import React, { useEffect, useState } from 'react';

export default function InstagramFeed() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent indefinite loading
    const timeout = setTimeout(() => {
      setScriptLoaded(true);
    }, 3000);

    // Load the SociableKit widget script
    const script = document.createElement('script');
    script.src = 'https://widgets.sociablekit.com/instagram-feed/widget.js';
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
      clearTimeout(timeout);
    };
    script.onerror = () => {
      setScriptLoaded(true);
      clearTimeout(timeout);
    };
    document.body.appendChild(script);

    return () => {
      clearTimeout(timeout);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="sk-instagram-feed" data-embed-id="25655047"></div>
    </div>
  );
}
