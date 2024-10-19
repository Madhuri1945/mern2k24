import Navbar from "../components/Navbar";
import '../static/css/pages/Landing.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from '../components/Loading';
import {useTypewriter , Cursor} from 'react-simple-typewriter'

const Landing = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    const [text] = useTypewriter(
        {
            words:['Crafting Innovations', 'Cultivating Dreams'],
            loop:{},
            typeSpeed:200,
        }
    )

    useEffect(() => {
        // ----------------- FETCHING USER DETAILS LIKE ROLE AND USERNAME -----------------
        axios.get('http://localhost:3000/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            const role = response.data.user.payload.role;
            localStorage.setItem("role", role);
            setUserRole(role)
        })
        .catch(error => {
            // console.log(error.response.data)
            console.error('Error fetching user data:', error);
        });

        if (userRole === 'FREELANCER') {
            navigate("/freelancer-dashboard");
        }

        else if (userRole === 'PRODUCER') {
            navigate("/producer-dashboard");
        }
    }, [userRole, token]);
    console.log(token)

    
    if (token === null) {
        return (
            <div className="landing_container">
                <img src="../../BackgroundNew.jpg" alt="Error Fetching Image" />
                <Navbar></Navbar>
    
                <div className="content-container">
                    <div className="text-container">
                        <div className="main_heading">
                            <h1 className="landing_text">Bridging the Gap Between</h1>
                            <h1 className="landing_text">Dreams and Reality</h1>
                        </div>
                        <h2 className="landing_typewrited_text"><span>{text}</span><span><Cursor cursorStyle="|"/></span></h2>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div 
            style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
                }}
            >
                <Loading />
            </div>
        )
    }
}

export default Landing;