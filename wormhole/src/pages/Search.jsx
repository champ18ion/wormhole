import React, { useState } from 'react';
import styled from 'styled-components';
import { apiKey } from '../utils/constants';
import Card from '../components/SearchCard';
import { AiOutlineArrowLeft, AiOutlineSearch} from 'react-icons/ai';
import { ToastContainer } from 'react-toastify';


export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
    <ToastContainer />
    <div className="search-input">
      <AiOutlineArrowLeft className='back' onClick={() => window.history.back()}/>
    <input
        type="text"
        name="search"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <AiOutlineSearch className='search' onClick={handleSearch}/>
    </div>
   

     
    
      <div className="content flex column">
        { searchResults.length ? <div className="grid flex">
          {searchResults.map((movie, index) => {
            return (
              <Card
              movieData={movie}
              index={index}
              key={movie.id}
              isLiked={false}
            />
          );
        })}
      </div> : <h3>  </h3> }
    </div> 
     
    </Container>
  );
}

const Container = styled.div`
display: flex;
flex-direction: column;
.search-input{
display: flex;
flex-direction: row;
.back{
  height:40px;
  width:40px;
  margin: 5px;
  padding: 10px;
}
 input{
  width:80%;
  height:40px;
  margin:5px 20px;
  background-color:black;
  font-family: 'Courier New', Courier, monospace;
  color:#f5f5f3;
  outline: none;
  font-size: 20px;
  padding:15px;
  border:none;
 }
 .search{
  height:40px;
  width:40px;
  margin: 5px;
  padding: 10px;
 }
  }
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    h1 {
      margin-left: 3rem;
    }
    .grid {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
  `;


