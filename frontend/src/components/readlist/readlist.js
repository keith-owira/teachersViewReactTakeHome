import React, { createContext, useState, useContext } from 'react';

export const ReadingListContext = createContext();

export const ReadingListProvider = ({ children }) => {
  const [readingList, setReadingList] = useState([]);

  const addToReadingList = (book) => {
    setReadingList((prevList) => {
      if (prevList.some((item) => item.title === book.title)) {
        return prevList;
      }
      return [...prevList, book];
    });
  };

  const removeFromReadingList = (book) => {
    setReadingList((prevList) => prevList.filter(item => item.title !== book.title));
  };

  return (
    <ReadingListContext.Provider value={{ readingList, addToReadingList, removeFromReadingList }}>
      {children}
    </ReadingListContext.Provider>
  );
};

export const useReadingList = () => {
  return useContext(ReadingListContext);
};
