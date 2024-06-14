import React, { useState, useContext } from 'react';
import { GrFormClose } from 'react-icons/gr';
import BookList from './components/booklist/bookList';
import PrimarySearchAppBar from './components/NavBar/navbar';
import { ReadingListProvider, ReadingListContext } from './components/readlist/readlist';
import '@fontsource/mulish';


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  const { addToReadingList } = useContext(ReadingListContext) || {}; 

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  return (
    <ReadingListProvider>
      <div>
        <PrimarySearchAppBar onSearchChange={handleSearchChange} onBookSelect={handleBookSelect} />
        <BookList searchQuery={searchQuery} />
        {selectedBook && (
          <div className="detail-container">
            <div className="detail-content">
              <button className="close" onClick={() => setSelectedBook(null)}>
                <GrFormClose />
              </button>
              <div className="detail-info">
                <div className="img-card">
                  <img src={`/${selectedBook.coverPhotoURL}`} alt={selectedBook.title} />
                </div>
                <div className="book-detail">
                  <h2 className="modal-title">{selectedBook.title}</h2>
                  <h3 className="modal-author">by {selectedBook.author}</h3>
                  <p className="modal-reading-level">Level: {selectedBook.readingLevel}</p>
                  <button onClick={() => addToReadingList && addToReadingList(selectedBook)}>Add To Reading List</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ReadingListProvider>
  );
}

export default App;
