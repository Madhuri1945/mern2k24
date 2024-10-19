import { useEffect, useState } from 'react';
import '../static/css/components/ProducerSignin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProducerSignin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        setErrorMessage('');
    }, [username, password])

    const handleSubmit = () => {
        axios
        .post('http://localhost:3000/producer/login', {
            username: username,
            password: password
        })
        .then((response) => {
            console.log(response.data)
            localStorage.setItem("token", response.data.token)
            navigate("/");
        })
        .catch((error) => {
            setErrorMessage(error.response.data.message)
            console.error("Error Logging in: ", error);
        })
    }

    return (
        <div className="producer_signin_container">
            <div className="producer_heading">
                Producer Login
            </div>
            <div className="producer_form_fields">
                <input type="text" placeholder='Username'value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder='Password'value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="producer_form_submit">
                <button onClick={handleSubmit}>Login</button>
                <div className="producer_signin_prompt">
                    <span>Don't Have an Account? </span>
                    <a href="/signup">Join Now</a>
                </div>
            </div> 
            {
                errorMessage ? 
                ( <div className='producer_informative_message'><span>{errorMessage}</span></div> ) : ( <></> )
            }
        </div>
    )
}

export default ProducerSignin;