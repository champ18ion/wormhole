import {
    configureStore,
    createAsyncThunk,
    createSlice,
  } from "@reduxjs/toolkit";
import { apiKey, tmdbUrl } from "../utils/constants";
import axios from 'axios';
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../utils/firebase-config';

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


const usersCollectionRef = collection(firestore, 'users');

export const getUsersLikedMovies = createAsyncThunk(
  'wormhole/getliked',
  async (email) => {
    try {
      const userDocRef = doc(usersCollectionRef, email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const user = userDoc.data();
        return user.likedMovies;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching liked movies');
    }
  }
);

export const addToLikedMovies = createAsyncThunk(
  "wormhole/addToLikedMovies",
  async ({ email, data }, { rejectWithValue }) => {
    try {
      const userDocRef = doc(usersCollectionRef, email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const user = userDoc.data();
        const { likedMovies } = user;
        const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);

        if (!movieAlreadyLiked) {
          const updatedMovies = [...likedMovies, data];
          await updateDoc(userDocRef, {
            likedMovies: updatedMovies,
          });
          return { message: "Movie successfully added to liked list." };
        } else {
          return { message: "Movie already added to the liked list." };
        }
      } else {
        await setDoc(userDocRef, { email, likedMovies: [data] });
        return { message: "Movie successfully added to liked list." };
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue("Error adding movie to the liked list");
    }
  }
);

export const removeFromLikedMovies = createAsyncThunk(
  "wormhole/removeFromLikedMovies",
  async ({ email, movieId }, { rejectWithValue }) => {
    try {
      const userDocRef = doc(usersCollectionRef, email);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        return rejectWithValue("User with given email not found.");
      }

      const user = userDoc.data();
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);

      if (movieIndex === -1) {
        return rejectWithValue("Movie not found.");
      }

      movies.splice(movieIndex, 1);
      await updateDoc(userDocRef, {
        likedMovies: movies,
      });

      return { message: "Movie successfully removed.", movies };
    } catch (error) {
      console.error(error);
      return rejectWithValue("Error removing movie.");
    }
  }
);

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
  state.movies = action.payload.movies;
  return state;
  
})

builder.addCase(addToLikedMovies.fulfilled, (state, action) => {
  // Handle the successful addition of a movie to the liked list in the state if needed
});

  
  
  },
  });

  export const store = configureStore({
    reducer: {
      wormhole: wormholeSlice.reducer,
    },
  });