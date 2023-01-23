import {
    configureStore,
    createAsyncThunk,
    createSlice,
  } from "@reduxjs/toolkit";
import { apiKey, tmdbUrl } from "../utils/constants";
import axios from 'axios';

  const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
  };

  const createArrayFromRawData = (array, moviesArray, genres) => {
    array.forEach((movie) => {
      const movieGenres = [];
      movie.genre_ids.forEach((genre) => {
        const name = genres.find(({ id }) => id === genre);
        if (name) movieGenres.push(name.name);
      });
      if (movie.backdrop_path)
        moviesArray.push({
          id: movie.id,
          name: movie?.original_name ? movie.original_name : movie.original_title,
          image: movie.backdrop_path,
          genres: movieGenres.slice(0, 3),
        });
    });
  };

  const getRawData = async (api, genres, paging = false) => {
    const moviesArray = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
      const {
        data: { results },
      } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
      createArrayFromRawData(results, moviesArray, genres);
    }
    return moviesArray;
  };

export const getGenres = createAsyncThunk("wormhole/genres", async()=>{
    const {data:{
      genres
    }} = await axios.get(`${tmdbUrl}/genre/movie/list?api_key=${apiKey}`)

    //  console.log(data);
     return genres;
})  

export const fetchDataByGenre = createAsyncThunk(
  "wormhole/genre",
  async ({ genre, type }, thunkAPI) => {
    const {
      wormhole: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `${tmdbUrl}/discover/${type}?api_key=${apiKey}&with_genres=${genre}`,
      genres
    );
  }
);

export const getUsersLikedMovies = createAsyncThunk("wormhole/getliked",async(email)=>{
  const {data:{movies}} = await axios.get(`http://localhost:5000/api/user/liked/${email}`)
  return movies;
}
)

export const removeFromLikedMovies = createAsyncThunk("wormhole/delete",async({email,movieId})=>{
  const {data:{movies}} = await axios.put(`http://localhost:5000/api/user/delete`,{
    email,
    movieId
  })
  return movies;
}
)

export const fetchMovies = createAsyncThunk(
  "wormhole/trending",
  async ({ type }, thunkAPI) => {
    const {
      wormhole: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `${tmdbUrl}/trending/${type}/week?api_key=${apiKey}`,
      genres,
      true
    );
  }
);

const wormholeSlice = createSlice({
    name: "wormhole",
    initialState,
    extraReducers: (builder) => {builder.addCase(getGenres.fulfilled,(state,action)=>{
        state.genres = action.payload;
        state.genresLoaded = true;
    })
    builder.addCase(fetchMovies.fulfilled,(state,action)=>{
      state.movies = action.payload;
      
  })
  builder.addCase(fetchDataByGenre.fulfilled,(state,action)=>{
    state.movies = action.payload;
    
})
  builder.addCase(getUsersLikedMovies.fulfilled,(state,action)=>{
  state.movies = action.payload;
  
})

builder.addCase(removeFromLikedMovies.fulfilled,(state,action)=>{
  state.movies = action.payload;
  
})
  
  
  },
  });

  export const store = configureStore({
    reducer: {
      wormhole: wormholeSlice.reducer,
    },
  });