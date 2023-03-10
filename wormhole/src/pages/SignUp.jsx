import React, { useState } from 'react';
import {createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import styled from 'styled-components'
import {firebaseAuth} from '../utils/firebase-config';
import BackgroundImage from '../components/BackgroundImage';
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header';
export default function SignUp() {
    const [showPassword,setShowPassword] = useState(false)
    const [formValues,setFormValues] = useState({
        email:"",
        password:""
    })
    const navigate =  useNavigate()
    const handleSignIn = async ()=>{
        try {
            const { email,password } = formValues;
            await createUserWithEmailAndPassword(firebaseAuth,email,password);
            console.log(formValues)
        } catch (error) {
            console.log(error)
        }
    }
    onAuthStateChanged(firebaseAuth,(currentUser)=>{
        if(currentUser) navigate("/")
    })
  return (
    <Container showPassword={showPassword}>
        <BackgroundImage/>
        <div className="content">
        <Header login/>
        <div className="body flex column a-center j-center">
            <div className="text flex column">
                <h1>Unlimited everything</h1>
                <h3>Watch and store</h3>
                <h5>Sign up to get started</h5>
            </div>
            <div className="form">
                <input type="email" name="email" placeholder='abcdxyz@jkl.com' value={formValues.email} onChange={(e)=>setFormValues({...formValues,[e.target.name]:e.target.value,})} />
                {
                    showPassword &&  <input type="password" name="password" placeholder='enter password' value={formValues.password} onChange={(e)=>setFormValues({...formValues,[e.target.name]:e.target.value,})}/>
                }
               
                {
                    !showPassword && <button onClick={()=>setShowPassword(true)}>get started</button>
                }
            </div>
            <button onClick={handleSignIn}>Sign Up</button>
        </div>

        </div>
       
        
    </Container>
  )
}
 const Container = styled.div`
 position: relative;
 .content{
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows:15vh 85vh;
    .body{
        gap: 1rem;
        .text{
            gap: 1rem;
            text-align: center;
            font-size: 2rem;
            h1{
                padding: 0 25rem;
            }
        }
        .form{
            display: grid;
            grid-template-columns:${({showPassword})=>showPassword?"1fr 1fr":"2fr 1fr"};
            width: 60%;
            input{
                color: black;
                border: none;
                padding: 1.5rem;
                font-size:1.2rem;
                border: 1px solid black;
                &:focus{
                    outline: none;
                }
            }
            button{
                padding: 0.5rem 1rem;
                background-color: #00A1FF;
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 0.2rem;
                font-weight:bolder;
                font-size: 1.05rem;
            }
        }
        button{
     padding: 0.5rem 1rem;
     background-color: #00A1FF;
     border: none;
     color: white;
     cursor: pointer;
     border-radius: 0.2rem;
     font-weight:bolder;
     font-size: 1.05rem;
        }
    }
 }
 `;
