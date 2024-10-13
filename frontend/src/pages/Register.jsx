import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import Logo from "../assets/connectly.svg";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const handleValidation = () => {
        console.log("validating")
        if(!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.name){
            toast.error("All fields are required");
            return false;
        }

        if(formData.password !== formData.confirmPassword){
            toast.error("Passwords do not match");
            return false;
        }
        if(formData.email.indexOf('@') === -1 || formData.email.indexOf('.') === -1){
            toast.error("Invalid email");
            return false;
        }
        if(formData.password.length < 6){
            toast.error("Password must be at least 6 characters long");
            return false;
        }
        if(formData.username.length < 3){
            toast.error("Username must be at least 3 characters long");
            return false;
        }
        return true;
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            if(handleValidation()){
                const {username,name, email, password} = formData;
                const response = await fetch('/api/auth/register', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        name,
                        email,
                        password,
                    }),
                });
                if(response.status === 201){
                    toast.success("User registered successfully");
                    navigate("/login");
                }
                else{
                    toast.error("Something went wrong");
                }
            }
        }
        catch(error){
            toast.error(error.response.data.msg);
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
                        <h1>Connectly</h1>
                    </div>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        onChange={e=>handleChange(e)}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={e=>handleChange(e)}
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="email" 
                        onChange={e=>handleChange(e)}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="password" 
                        onChange={e=>handleChange(e)}
                    />
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        onChange={e=>handleChange(e)}
                    />
                    <button type="submit">Register</button>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
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

export default Register;