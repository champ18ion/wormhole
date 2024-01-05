import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlay } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { fetchMovies, getGenres } from '../store';
import { apiKey, tmdbUrl } from '../utils/constants';
import axios from 'axios';
import Slider from '../components/Slider';


export default function Wormhole() {
  const [isScrolled,setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.wormhole.movies);
  const genres = useSelector((state) => state.wormhole.genres);
  const genresLoaded = useSelector((state) => state.wormhole.genresLoaded);


  const [movie, setMovie] = useState([]);


   window.onscroll= ()=>{
    setIsScrolled(window.pageYOffset=== 0? false: true)
    return ()=> (window.onscroll=null)
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "all" }));
    }
  }, [genresLoaded]);

  useEffect(() => {
    async function fetchData(){
        const request = await axios.get(`${tmdbUrl}/trending/all/week?api_key=${apiKey}&with_networks=213`)

        setMovie(request.data.results[
            Math.floor(Math.random() * request.data.results.length)
        ])
        return request;
    }
    fetchData();
},[])

  return (
    <Container>
      <ToastContainer/>
      <Navbar isScrolled={isScrolled}/>
      <div className="hero">
        <img src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} alt="avatar" className='background-image'/>
        <div className="container">
          <div className="logo">
            <h1> {movie?.title || movie.name || movie?.orignal_name}</h1>
            <p>{movie?.overview}</p>
          </div>
          <div className="buttons flex">
            <button className="flex j-center a-center" onClick={()=>navigate('/player')}>
              <FaPlay/> Play 
            </button>
            <button className="flex j-center a-center">
              <AiOutlineInfoCircle/> more info 
            </button>
          </div>
        </div>
      </div>
      <Slider movies={movies}/>
    </Container>
  )
}

const Container = styled.div`
@media (max-width: 480px) {
  .container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: -3rem;
    margin-top: 5rem;
    .logo{
      margin-left: 0;
      h1{
        max-width: 90%;
        -ms-wrap-flow: auto;
      }
      p{
        display: none;
      }
    }
  }
}
background-color: black;
.hero{
  position: relative;
  .background-image{
    filter: brightness(60%);
    
  }
  img{
    height: 100vh;
    width: 100vw;
    object-fit: cover;  
  }
  .container{
    position: absolute;
    bottom: 5rem;
    .logo{
      h1{
        width: 100%;
        height: 100%;
        margin-left: 5rem;
         
      }
      p{
        width:50%;
        margin-left: 5rem;
        font-size: 1.2rem;
        color:#f3f3f3;
      }
    }
    .buttons{
      margin: 5rem;
      gap: 2rem;
      button{
        font-size: 1.4rem;
        gap:1rem;
        padding: 0.5rem;
        border-radius: 0.2rem;
        padding-left: 2rem;
        padding-right: 2.4rem;
        border:none;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover{
          opacity: 0.8;

        }
        &:nth-of-type(2){
          background-color: rgba(109,109,110,0.7);
          color: white;
          svg{
            font-size: 1.8rem;
          }
        }

      }
    }
  }
}
`
;