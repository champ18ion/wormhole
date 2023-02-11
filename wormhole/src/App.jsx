import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Wormhole from './pages/Wormhole'
import Player from './pages/Player'
import Movies from './pages/Movies'
import TvShows from './pages/TvShows'
import MyList from './pages/MyList'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/signup' element={<SignUp/>} />
      <Route exact path='/player' element={<Player/>}/>
      <Route exact path='/movies' element={<Movies/>}/>
      <Route exact path='/tv' element={<TvShows/>}/>
      <Route exact path='/myList' element={<MyList/>}/>
      <Route exact path='/search' element={<Search/>}/>
      <Route exact path='/' element={<Wormhole/>} />
    </Routes>
    </BrowserRouter>
  )
}
