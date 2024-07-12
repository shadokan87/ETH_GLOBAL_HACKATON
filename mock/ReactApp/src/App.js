import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (imageUrl.length)
      return ;
    fetch('https://api.thecatapi.com/v1/images/search')
      .then(response => response.json())
      .then(data => setImageUrl(data[0].url))
      .catch(error => console.error('Error fetching the cat image:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {imageUrl ? (
          <img src={imageUrl} className="App-logo" alt="Random Cat" />
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
