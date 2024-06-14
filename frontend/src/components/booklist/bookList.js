import React, { useState, useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { GrFormClose } from 'react-icons/gr';
import { ReadingListContext } from '../readlist/readlist';
import './booklist.css';

const BOOKS_DATA = gql`
  query Books {
    books {
      author
      coverPhotoURL
      readingLevel
      title
    }
  }
`;

const BookList = ({ searchQuery }) => {
  const { loading, error, data } = useQuery(BOOKS_DATA);
  const [detail, setDetail] = useState(null);
  const { addToReadingList } = useContext(ReadingListContext);
  const [notification, setNotification] = useState('');

  const detailPage = (book) => {
    setDetail(book);
  };

  const handleAddToReadingList = (book) => {
    addToReadingList(book);
    setDetail(null);
    setNotification('Book added successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredBooks = data.books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      {notification && <div className="fixed-notification">{notification}</div>}
      {detail && (
        <div className="detail-container">
          <div className="detail-content">
            <button className="close" onClick={() => setDetail(null)}>
              <GrFormClose />
            </button>
            <div className="detail-info">
              <div className="img-card">
                <img src={`/${detail.coverPhotoURL}`} alt={detail.title} />
              </div>
              <div className="book-detail">
                <h2 className="modal-title">{detail.title}</h2>
                <h3 className="modal-author">{detail.author}</h3>
                <p className="modal-reading-level">Level: {detail.readingLevel}</p>
                <button onClick={() => handleAddToReadingList(detail)}>Add To Reading List</button>
              </div>
            </div>
          </div>
        </div>
      )}


    <section className="book">
      {filteredBooks.map((book, index) => (
        <div className="card" key={`${book.title}-${index}`} onClick={() => detailPage(book)}>
          <div className="card-img">
            <img src={`/${book.coverPhotoURL}`} alt={book.title} />
          </div>
          <div className="info">
            <h3 className="title">{book.title}</h3>
            <p className="author">by {book.author}</p>
          </div>
        </div>
      ))}
    </section>
    </div>
  );
};

export default BookList;
