import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import { useReadingList } from '../readlist/readlist';
import { gql, useQuery } from '@apollo/client';
import '@fontsource/mulish';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#335c6e', 0.15), 
  '&:hover': {
    backgroundColor: alpha('#335c6e', 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#335c6e', 
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch', // Adjust the width of the input field
    },
    color: '#335c6e', 
  },
}));

const Dropdown = styled('div')(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
  width: '100%',
  zIndex: 1,
  maxHeight: '300px',
  overflowY: 'auto',
}));

const DropdownItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
}));

const ReadingListDropdown = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '60px',
  right: '20px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  zIndex: 1,
  maxHeight: '300px',
  overflowY: 'auto',
}));

const elloAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white', 
  color: '#335c6e',
  position: 'fixed'
}));

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

export default function PrimarySearchAppBar({ onSearchChange, onBookSelect }) {
  const { readingList, removeFromReadingList } = useReadingList();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showReadingList, setShowReadingList] = useState(false);
  const { data } = useQuery(BOOKS_DATA);

  useEffect(() => {
    if (data && searchQuery) {
      const results = data.books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(results);
    } else {
      setFilteredBooks([]);
    }
  }, [data, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    onSearchChange(event.target.value);
  };

  const toggleReadingList = () => {
    setShowReadingList(!showReadingList);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <elloAppBar position='fixed'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
          <img
            src="/assets/elloLogo.png"
            alt="Ello"
            style={{ height: '50px', marginRight: '16px' }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Search sx={{ flexGrow: 1, mx: 2 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <Dropdown>
                {filteredBooks.map((book) => (
                  <DropdownItem
                    key={book.title}
                    onClick={() => onBookSelect(book)}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <img
                      src={`/${book.coverPhotoURL}`}
                      alt={book.title}
                      style={{ width: '50px', marginRight: '10px' }}
                    />
                    <div className='serchList'>
                      <p>{book.title}</p>
                      <p>by {book.author}</p>
                    </div>
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            aria-label={`show ${readingList.length} books`}
            color="inherit"
            onClick={toggleReadingList}
          >
            <Badge badgeContent={readingList.length} color="error">
              <BookIcon sx={{ color: '#335c6e' }} />
            </Badge>
          </IconButton>
          {showReadingList && (
            <ReadingListDropdown>
              {readingList.length === 0 ? (
                <p>No books in the reading list.</p>
              ) : (
                readingList.map((book, index) => (
                  <DropdownItem
                    key={`${book.title}-${index}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={`/${book.coverPhotoURL}`}
                        alt={book.title}
                        style={{ width: '50px', marginRight: '10px' }}
                      />
                      <div>
                        <p style={{ color: 'black', margin: 0 }}>{book.title}</p>
                        <p style={{ color: 'gray', margin: 0 }}>{book.author}</p>
                      </div>
                    </div>
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeFromReadingList(book)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </DropdownItem>
                ))
              )}
            </ReadingListDropdown>
          )}
        </Toolbar>
      </elloAppBar>
    </Box>
  );
}
