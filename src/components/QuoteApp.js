import React, { useState, useEffect } from 'react';

const QuoteApp = () => {
  const [quotes, setQuotes] = useState([]);
  const [pollingInterval, setPollingInterval] = useState(5);
  const maxPollingInterval = 120;
  const maxTotalTime = 120 * 1000; // 2 minutes in milliseconds
  const apiUrl = 'https://api.adviceslip.com/advice';

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const newQuote = data.slip.advice;

      setQuotes((prevQuotes) => [newQuote, ...prevQuotes]);

      if (quotes.length >= 5 && pollingInterval < maxPollingInterval) {
        setPollingInterval((prevInterval) => prevInterval * 2);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  useEffect(() => {
    let intervalId;

    const startPolling = () => {
      intervalId = setInterval(fetchRandomQuote, pollingInterval * 1000);
    };

    startPolling();

    setTimeout(() => {
      clearInterval(intervalId);
    }, maxTotalTime);

    return () => {
      clearInterval(intervalId);
    };
  }, [pollingInterval, quotes]);

  return (
    <div className="quote-app">
      <h1>Random Quotes</h1>
      <div className="quote-list">
        <ul>
          {quotes.map((quote, index) => (
            <li key={index}>{quote}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuoteApp;
