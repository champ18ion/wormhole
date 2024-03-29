import React,{useState} from 'react'
import logo from '../assets/Frame (2).png'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import {FaPowerOff, FaSearch} from 'react-icons/fa'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { firebaseAuth } from '../utils/firebase-config'
export default function Navbar({isScrolled}) {

    const [showSearch,setShowSearch] = useState(false);
    const [inputHover,setInputHover] = useState(false);

    const links = [
    {name:'Home',link:"/"},
    {name:'TV',link:"/tv"},
    {name:'Movies',link:"/movies"},
    {name:'MyWormhole',link:"/mylist"}];

    const navigate =  useNavigate()

    onAuthStateChanged(firebaseAuth,(currentUser)=>{
        if(!currentUser) navigate("/login")
    })

   
  return (
    <Container>
        <nav className={`flex ${isScrolled ? 'scrolled' : ''}`}>
            <div className="left flex a-center">
                <div className="brand a-center j-center">
                    <img src={logo} alt="wormhole" />
                </div>
                <ul className="links flex">
                    {
                        links.map(({name,link})=>{
                            return(
                                <li key={name}>
                                    <Link to={link}>{name}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="right flex a-center">
                <div className={`search ${showSearch?'show-search':''}`}>
                 <button onFocus={()=>navigate('/search')} onBlur={()=>{
                    if(!inputHover) setShowSearch(false)
                 }}>
                    <FaSearch/>
                 </button>
                 <input type="text" name="" id="" onMouseEnter={()=>setInputHover(true)} onMouseLeave={()=>setInputHover(false)} onBlur={()=>{
                    setInputHover(false)
                    setShowSearch(false)
                 }}/>
                </div>
                <button onClick={()=>signOut(firebaseAuth)}>
                    <FaPowerOff/> 
                </button>
            </div>
        </nav>

    </Container>
  )
}

const Container = styled.div`
  .scrolled {
    background-color: black;
  }
  nav {
    position: sticky;
    top: 0;
    height: 6.5rem;
    width: 100%;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 2;
    padding: 0 2rem;
    align-items: center;
    transition: 0.3s ease-in-out;
    .left {
      gap: 2rem;
      .brand {
        img {
          height: 3rem;
        }
      }
      .links {
        margin-left: 4rem;
        list-style-type: none;
        gap: 2rem;
        li {
          a {
            color: white;
            text-decoration: none;
            font-size: 1.1rem;
          }
        }
      }
    }
    .right {
      gap: 1rem;
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:focus {
          outline: none;
        }
        svg {
          color: #f34242;
          font-size: 1.2rem;
        }
      }
      .search {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        padding-left: 0.5rem;
        button {
          background-color: transparent;
          border: none;
          &:focus {
            outline: none;
          }
          svg {
            color: white;
            font-size: 1.2rem;
          }
        }
        input {
          width: 0;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
          background-color: transparent;
          border: none;
          color: white;
          &:focus {
            outline: none;
          }
        }
      }
      .show-search {
        border: 1px solid white;
        background-color: rgba(0, 0, 0, 0.6);
        input {
          width: 100%;
          opacity: 1;
          visibility: visible;
          padding: 0.3rem;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    nav {
      padding: 0 1rem;
      height: 5rem;
     .left {
        gap: 1rem;
        margin-top: 1rem;
       .brand {
          img {
            height: 2rem;
          }
        }
       .links {
          margin-left: 2rem;
          list-style-type: none;
          gap: 1rem;
          li {
            a {
              font-size: 0.9rem;
            }
          }
        }
      }
     .right {
        gap: 0.5rem;
        button {
          svg {
            font-size: 1rem;
          }
        }
       .search {
          input {
            padding: 0.2rem;
          }
        }
      }
    }
  }
  @media screen and (max-width: 425px) {
    nav {
      padding: 0 1rem;
      height: 5rem;
     .left {
        gap: 1rem;
        margin-top: 1rem;
       .brand {
          img {
            height: 2rem;
          }
        }
       .links {
          display: none;
          margin-left: 2rem;
          list-style-type: none;
          gap: 1rem;
          li {
            a {
              font-size: 0.9rem;
            }
          }
        }
      }
     .right {
        gap: 0.5rem;
        button {
          svg {
            font-size: 1rem;
          }
        }
       .search {
          input {
            padding: 0.2rem;
          }
        }
      }
    }
    
  }
`;