import React from 'react'
import logo from '../assets/Frame (2).png'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

export default function Header(props) {
   const navigate =  useNavigate()
  return (
    <Container className='flex a-center j-between '>
        <div className="logo">
         <img src={logo} alt="wormhole" />
        </div>
       
        <button onClick={()=>navigate(props.login?'/login':'/signup')}>{props.login ? "Log In":"Sign Up"}</button>
    </Container>
  )
}

const Container = styled.div`
padding: 0 4rem;
.logo{
    img{
        height:5rem;
        width: 20rem;
    }
}
button{
     padding: 0.5rem 1rem;
     background-color: #00A1FF;
     border: none;
     color: white;
     border-radius: 0.2rem;
     font-weight:bolder;
     font-size: 1.05rem;
}


`;
