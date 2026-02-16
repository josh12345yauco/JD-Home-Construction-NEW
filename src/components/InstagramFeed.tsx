import React, { useEffect } from 'react';

export default function InstagramFeed() {
  useEffect(() => {
    // Load the SociableKit widget script
    const script = document.createElement('script');
    script.src = 'https://widgets.sociablekit.com/instagram-feed/widget.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
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
