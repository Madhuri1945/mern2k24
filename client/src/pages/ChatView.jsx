import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import '../static/css/pages/ProducerDashboard.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import '../static/css/pages/ProfileDetail.css';
import '../static/css/pages/PostDetail.css';
import Loading from '../components/Loading';
import PendingIcon from '@mui/icons-material/Pending';
import ChatIcon from "@mui/icons-material/Chat";
import '../static/css/pages/ChatView.css';
import Chat from '../components/Chat';

const ChatView = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { username, role } = useParams();
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [profileOwnerDetails, setProfileOwnerDetails] = useState({});

    const [chatList, setChatList] = useState([]);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('')
    const [selectedUserUsername, setSelectedUserUsername] = useState('');
    const [selectedUserRole, setSelectedUserRole] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response.data)
            const role = response.data.user.payload.role;
            localStorage.setItem("role", role);
            setUserRole(role)
        })
        .catch(error => {
            // console.log(error.response.data)
            console.error('Error fetching user data:', error);
        });
    }, []);

    useEffect(() => {
        if (userRole === 'PRODUCER') {
            axios
            .get(`http://localhost:3000/producer/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                // console.log(response.data)
                setLoggedInUserDetails(response.data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
        else if (userRole === 'FREELANCER') {
            axios
            .get(`http://localhost:3000/freelancer/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                // console.log(response.data)
                setLoggedInUserDetails(response.data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
        
    }, [userRole]);

    useEffect(() => {
        axios
        .get(`http://localhost:3000/profile-owner-details/${role}/${username}`)
        .then(response => {
            // console.log(response.data);
            setProfileOwnerDetails(response.data);
            if (userRole === 'PRODUCER') {
                setChatList(response.data.freelancerConnections);
            }
            else if (userRole === 'FREELANCER') {
                setChatList(response.data.producerConnections);
            }
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching profile owner data: ', error);
        })
    }, []);

    const handleProfileClick = () => {
        window.location.href = `/profile/${loggedInUserDetails.role}/${loggedInUserDetails.username}`;
    }

    const handleChatClick = (id, username, role) => {
        setIsSelected(true);
        setSelectedUserId(id);
        setSelectedUserUsername(username);
        setSelectedUserRole(role);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }

    // console.log(profileOwnerDetails);

    if (token === null) {
        return (
            <div>
                <h1>Unauthorized, Please Signin <a href="/signin">Here</a></h1>
            </div>
        )
    }
    else {
        if (loading === true) {
            return (
                <Loading />
            )
        }
        else if ((userRole === 'PRODUCER' && username === loggedInUserDetails.username) || (userRole === 'FREELANCER' && username === loggedInUserDetails.username)) {
            return (
                <>
                    <div className='producer_navbar_container'>
                        <div className='producer_navbar_left'>
                            <a href='/'>
                                <span className='producer_nav_span_1'>Linked</span>
                                <span className='producer_nav_span_2'>X</span>
                            </a>
                        </div>
                        <div className='producer_navbar_right'>
                            {/* <button className="freelancer_chat_button" onClick={handleChatClick}><ChatIcon style={{ fontSize: "2rem" }} /></button> */}
                            <button className='producer_profile_button' onClick={handleProfileClick}><AccountCircleIcon style={{ fontSize: '2rem' }}/></button>
                            <button className='producer_navbar_logout' onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                            <div className='chat_main_area'>
                                <div className='chat_list'
                                    style={{
                                        overflow: 'hidden', 
                                        border: '2px solid #fff',
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        paddingBottom: '2.75rem',
                                    }}
                                >
                                    <div className='chat_list_heading'>
                                        <span>Chat List</span>
                                    </div>
                                    <div className='chat_list_main'>
                                    { 
                                        chatList.length ?
                                        (
                                            chatList.map((user, index) => {
                                                return (
                                                    <>
                                                        <div className='chat_list_main_card' key={user._id}>
                                                            <div className='chat_list_main_card_left'>
                                                            <span style={{ color: selectedUserUsername === user.username ? 'rgb(238, 60, 90)' : 'black' }}>
                                                                {user.username}
                                                            </span>
                                                            </div>
                                                            <div className='chat_list_main_card_right'>
                                                                <button onClick={() => handleChatClick(user._id, user.username, user.role)} style={{ padding: '0.7rem 0rem', margin: '0 0.5rem' }}>Chat</button>
                                                            </div>
                                                        </div>
                                                        
                                                    </>
                                                )
                                            })
                                        )
                                        :
                                        (
                                            loading ?
                                            (
                                                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading /></div>
                                            )
                                            :
                                            (
                                                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No Connected Producers At The Moment</div>
                                            )
                                        )
                                    }
                                    </div>
                                </div>
                                <div 
                                    className='chat_form'
                                    style={{
                                        border: '2px solid #fff',
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    {
                                        isSelected ?
                                        (
                                            <Chat senderId = {profileOwnerDetails._id} senderRole = {profileOwnerDetails.role} receiverId = {selectedUserId} receiverUsername = {selectedUserUsername} receiverRole = {selectedUserRole}/>
                                        )
                                        :
                                        (
                                            <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translatey(-27.5px)' }}>No User Selected for Chat</div>
                                        )
                                    }
                                </div>
                            </div>
                </>
            )
        }
        else {
            return (
                <>
                    <h1>Unauthorized</h1>
                </>
            )
        }
    }
}

export default ChatView;