import React, { useState, useEffect } from 'react';
import { Quote, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './QuoteWidget.module.css';
import quotes from '../data/quotes.json';

const QuoteWidget = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const goToNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  const goToPreviousQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
  };

  useEffect(() => {
    // Set up interval for cycling quotes
    const interval = setInterval(() => {
      goToNextQuote();
    }, 30000); // Change quote every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const currentQuote = quotes[currentQuoteIndex];

  if (isMinimized) {
    return (
      <button className={styles.minimizedWidget} onClick={toggleMinimize} title="Show Quote">
        <Quote size={20} />
      </button>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <button className={styles.minimizeButton} onClick={toggleMinimize}>
          <Minimize2 size={16} />
        </button>
      </div>
      <div className={styles.quoteContainer}>
        <button className={styles.navButton} onClick={goToPreviousQuote}>
          <ChevronLeft size={16} />
        </button>
        <div className={styles.quoteContent}>
          <blockquote className={styles.quote}>
            "{currentQuote.quote}"
          </blockquote>
          <div className={styles.author}>
            — {currentQuote.author}
          </div>
        </div>
        <button className={styles.navButton} onClick={goToNextQuote}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuoteWidget;
