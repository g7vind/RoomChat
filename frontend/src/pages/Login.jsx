import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import Logo from "../assets/connectly.svg";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {useAuthContext} from "../context/AuthContext";
const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const {setAuthUser} = useAuthContext();
    const navigate = useNavigate();
    const handleValidation = () => {
        if(!formData.username){
            toast.error("Username is required");
            return false;
        }
        if(!formData.password){
            toast.error("Password is required");
            return false;
        }
        return true;
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            if(handleValidation()){
                const {username, password} = formData;
                const response = await fetch('/api/auth/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                });
                if(response.status === 200){
                    const data = await response.json();
                    toast.success("User login successfully");
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setAuthUser(data.user);
                    navigate("/");
                }
                else{
                    const error = await response.json();
                    toast.error(error.message);
                }
            }
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    }
    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    }
    return (
        <>
            <FormContainer>
                <form onSubmit={(event)=>handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>RoomChat</h1>
                    </div>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        onChange={e=>handleChange(e)}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="password" 
                        onChange={e=>handleChange(e)}
                    />
                    <button type="submit">Login</button>
                    <span>Don't have an account? <Link to="/register">Register</Link></span>
                    </form>
            </FormContainer>
        </>
    );
    }
    const FormContainer= styled.div`
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                width:100vw;
                gap: 1rem;
                background-color: #f1f1f1;
                .brand{
                    display: flex;
                    align-items: center;
                    gap: 0.1rem;
                    justify-content: center;
                    img{
                        height:5rem;
                        
                    }
                    h1{
                        color:black;
                        font-size: 2rem;
                        
                        
                    }
                    }
                form{
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding: 2rem ;
                    border-radius: 0.5rem;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    background-color: white;
                    input{
                        padding: 0.5rem;
                        border-radius: 0.5rem;
                        border: 1px solid lightgray;
                    }
                    button{
                        padding: 0.5rem;
                        border-radius: 0.5rem;
                        border: none;
                        background-color: #333;
                        color: white;
                        cursor: pointer;
                    }
                }`

export default Login;