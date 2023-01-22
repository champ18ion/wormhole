import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import NotAvailable from '../components/NotAvailable';
import SelectGenre from '../components/SelectGenre';
import Slider from '../components/Slider';
import { fetchMovies, getGenres } from '../store';

export default function TvShows() {
  
  const [isScrolled,setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.wormhole.movies);
  const genres = useSelector((state) => state.wormhole.genres);
  const genresLoaded = useSelector((state) => state.wormhole.genresLoaded);
  
   window.onscroll= ()=>{
    setIsScrolled(window.pageYOffset=== 0? false: true)
    return ()=> (window.onscroll=null)
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({type: "tv" }));
    }
  }, [genresLoaded]);
  
  return (
  
  <Conatiner>
    <div className="navbar">
      <Navbar isScrolled={isScrolled}/>
    </div>
    
    <div className="data">
    <SelectGenre genres={genres} type="movie"/>
      {
        movies.length ? <Slider movies={movies}/> : <NotAvailable/> 
      }
    </div>
  
  </Conatiner>
  
  )
}

const Conatiner = styled.div`
.data{
  margin-top: 8rem;
  .not-available{
    text-align: center;
    color: white;
    margin-top: 4rem;
  }
}
`;