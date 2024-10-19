import Signup from "../components/Signup";
import Navbar from "../components/Navbar";
import '../static/css/pages/SignupPage.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SignupPage = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            axios.get('http://localhost:3000/details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data)
                setToken(token)
                const role = response.data.user.payload.role;
                localStorage.setItem("role", role);
                setUserRole(role)
            })
            .catch(error => {
                // console.log(error.response.data)
                console.error('Error fetching user data:', error);
            });
        }

        if (userRole === 'FREELANCER') {
            navigate("/freelancer-dashboard");
        }
        
        else if (userRole === 'PRODUCER') {
            navigate("/producer-dashboard");
        }
    }, []);
    console.log(token)

    if (token === null) {
        return (
            <div className="signup_page_container">
                <Navbar />
                <div className="signup_form_container">
                    <Signup />
                </div>
            </div>
        )
    }
}

export default SignupPage;