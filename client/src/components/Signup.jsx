import axios from 'axios';
import '../static/css/components/Signup.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    // const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSignupClick = () => {
        if (role === 'FREELANCER') {
            axios
            .post('http://localhost:3000/freelancer/signup', {
                username,
                password,
                email,
            })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                // setMessage(response.data.message);
                navigate("/")
            })
            .catch((error) => {
                // setMessage(error.response.data.message)
                console.error("Error Signing up: ", error);
            })
        }
        else if (role === 'PRODUCER') {
            axios
            .post('http://localhost:3000/producer/signup', {
                username,
                password,
                email,
            })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                // setMessage(response.data.message);
                navigate("/")
            })
            .catch((error) => {
                // setMessage(error.response.data.message)
                console.error("Error Signing up: ", error);
            })
        }
    }

    return (
        <>
            <div className="signup_container">
                <div className="heading">
                    Sign Up
                </div>
                <div className="signup_form_fields">
                    <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <select value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="" disabled>-- Select Role --</option>
                        <option value="FREELANCER">FREELANCER</option>
                        <option value="PRODUCER">PRODUCER</option>
                    </select>
                </div>
                <div className="signup_form_submit">
                    <button onClick={handleSignupClick}>Join</button>
                    <div className="signup_prompt">
                        <span>Already Have An Account? </span>
                        <a href="/signin">Sign In</a>
                    </div>
                </div> 
            </div>
            {/* <div className='backend_message'>
                {message}
            </div> */}
        </>
    )
}

export default Signup;