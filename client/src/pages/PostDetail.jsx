import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../static/css/pages/PostDetail.css';
import '../static/css/pages/ProducerDashboard.css';
import Loading from '../components/Loading';

const PostDetail = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const { jobId } = useParams();
    const [selectedJobData, setSelectedJobData] = useState({})
    // const [selectedJobProducer, setSelectedJobProducer] = useState({})
    const [producerId, setProducerId] = useState(null);

    const [loading, setLoading] = useState(true)

    const [applied, setApplied] = useState(false);

    // ------------UPDATE JOB BY THE OWNER OF THE JOB POST----------------
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState(['']);
    const [skillsRequired, setSkillsRequired] = useState(['']);
    const [employmentType, setEmploymentType] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [message, setMessage] = useState('');

    const handleJobUpdateSubmit = (e) => {
        e.preventDefault();

        axios
        .put(`http://localhost:3000/producer/jobs/${jobId}`, {
            title: title,
            description: description,
            requirements: requirements,
            skillsRequired: skillsRequired,
            employmentType: employmentType,
            location: location,
            salary: salary
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            console.log(response.data.message);
            setMessage(response.data.message);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }

    // ------------GET DETAILS OF THE CURRENT USER----------------
    useEffect(() => {
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
            setUsername(response.data.user.payload.username);
        })
        .catch(error => {
            // console.log(error.response.data)
            console.error('Error fetching user data:', error);
        });
    }, []);

    // ------------GET DETAILS OF THE SELECTED JOB POST----------------
    useEffect(() => {
        axios
        .get(`http://localhost:3000/producer/jobs/${jobId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
            console.log(response.data)
            setSelectedJobData(response.data.job)
            // setSelectedJobProducer(response.data.producer)
            setProducerId(response.data.job.producer)
            setTitle(response.data.job.title)
            setDescription(response.data.job.description)
            setRequirements(response.data.job.requirements)
            setSkillsRequired(response.data.job.skillsRequired)
            setEmploymentType(response.data.job.employmentType)
            setLocation(response.data.job.location)
            setSalary(response.data.job.salary)
            setLoading(false)
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    // ------------GET PRODUCER ID FOR CONDITIONAL RENDERING PURPOSES OR FREELANCER INFO FOR APPLYING PURPOSES----------------
    useEffect(() => {
        if (userRole === 'PRODUCER') {
            axios
            .get(`http://localhost:3000/producer/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data)
                // setProducerId(response.data._id)
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
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

            axios.get(`http://localhost:3000/freelancer/job/apply/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response.data)
                setApplied(response.data.applied)
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
        }
    }, []);

    // console.log(message)

    // ------------PROFILE ICON CLICK----------------
    const handleProfileClick = () => {
        navigate(`/profile/${userRole}/${username}`)
    }

    // ------------FREELANCER APPLY CLICK CONTROLLER----------------
    const handleFreelancerApply = () => {
        axios
        .post(`http://localhost:3000/freelancer/job/apply/${jobId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setApplied(true)
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }

    const handleFreelancerUnApply = () => { 
        axios
        .delete(`http://localhost:3000/freelancer/job/apply/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setApplied(false)
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }

    // ------------LOGOUT CLICK----------------
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }
    console.log(selectedJobData)

    // ------------IF TOKEN NULL, THEN USER UNAUTHENTICATED----------------
    if (token === null) {
        return (
            <div>
                <h1>Unauthorized, Please Signin <a href="/signin">Here</a></h1>
            </div>
        )
    }

    // ------------IF USER IS PRODUCER AND JOB POST IS NOT CREATED BY HIM OR USER IS FREELANCER WHO CAN APPLY----------------
    else if ((userRole === 'PRODUCER' && selectedJobData.producer !== producerId) || (userRole === 'FREELANCER')) {
        return (
            <>
                {
                    loading ?
                    (
                        <Loading />
                    )
                    :
                    (   
                        <>    
                            <div className='producer_navbar_container'>
                                <div className='producer_navbar_left'>
                                    {
                                        userRole === 'PRODUCER' ? (
                                            <a href='/producer-dashboard'>
                                                <span className='producer_nav_span_1'>Linked</span>
                                                <span className='producer_nav_span_2'>X</span>
                                            </a>
                                        ) : (
                                            <a href='/freelancer-dashboard'>
                                                <span className='producer_nav_span_1'>Linked</span>
                                                <span className='producer_nav_span_2'>X</span>
                                            </a>
                                        )
                                    }
                                </div>
                                <div className='producer_navbar_right'>
                                    <button className='producer_profile_button' onClick={handleProfileClick}><AccountCircleIcon style={{ fontSize: '2rem' }}/></button>
                                    <button className='producer_navbar_logout' onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                            <div className='post_detail_main_area'>
                                <div className='post_detail_form'>
                                    <div className='general_post_detail_heading'>
                                        <h1>{selectedJobData.title}</h1>
                                        <span style={{ fontSize: '1.25rem' }}>Posted By <a href={`/profile/${selectedJobData.producer.role}/${selectedJobData.producer.username}`}>{selectedJobData.producer.username}</a></span>
                                    </div>
                                    <div className='general_post_detail_description'>
                                        <h2>Description</h2>
                                        <span>{selectedJobData.description}</span>
                                    </div>
                                    <div className='general_post_detail_requirements'>
                                        <h2>Requirements</h2>
                                        {
                                            requirements.map((requirement, index) => {
                                                return (
                                                    <ul key={index}>
                                                        <li>{requirement}</li> 
                                                    </ul>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className='general_post_detail_skills'>
                                        <h2>Skills Required</h2>
                                        {
                                            skillsRequired.map((skill, index) => {
                                                return (
                                                    <ul key={index}>
                                                        <li>{skill}</li> 
                                                    </ul>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className='general_post_detail_miscellaneous'>
                                        <h2>Employment Type</h2>
                                        <span>This is a {selectedJobData.employmentType} Job Opportunity</span>
                                    </div>
                                    <div className='general_post_detail_miscellaneous'>
                                        <h2>Work Location</h2>
                                        <span>The Job is {selectedJobData.location} Based</span>
                                    </div>
                                    <div className='general_post_detail_miscellaneous'>
                                        <h2>Salary</h2>
                                        <span>Monthly Base Salary {selectedJobData.salary} + Incentives</span>
                                    </div>
                                    {
                                        userRole === 'FREELANCER' ?
                                        (
                                            !applied ? (
                                                <div className='general_post_detail_apply'>
                                                    <button onClick={handleFreelancerApply}>Apply</button>
                                                </div>
                                            ) 
                                            :
                                            (
                                                <div className='general_post_detail_apply'>
                                                    <button style={{ marginRight: '2rem', backgroundColor: '#ec7694' }}>Applied</button>
                                                    <button onClick={handleFreelancerUnApply}>UnApply</button>
                                                </div>
                                            )
                                        )
                                        : (<></>)
                                    }
                                </div>
                            </div>
                        </>
                    )
                }
                
            </>
        )
    }

    // ------------IF USER IS PRODUCER AND JOB POST IS CREATED BY HIM----------------
    else if (userRole === 'PRODUCER' && selectedJobData.producer === producerId) {
        return (
            <>
                <div className='producer_navbar_container'>
                    <div className='producer_navbar_left'>
                        <a href='/producer-dashboard'>
                            <span className='producer_nav_span_1'>Retrocraft</span>
                            <span className='producer_nav_span_2'>Hub</span>
                        </a>
                    </div>
                    <div className='producer_navbar_right'>
                        <button className='producer_profile_button' onClick={handleProfileClick}><AccountCircleIcon style={{ fontSize: '2rem' }}/></button>
                        <button className='producer_navbar_logout' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className='post_detail_main_area'>
                    <div className='post_detail_form'>
                        <div className='post_detail_heading'>
                            <span>Preview / Update</span>
                        </div>
                        <div className='post_detail_form_title'>
                            <span>Title</span>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => {setTitle(e.target.value); setMessage('')}}
                                placeholder='Enter Title'
                            />
                        </div>
                        <div className='post_detail_form_description'>
                            <label htmlFor="description">Description:</label>
                            <textarea 
                                name="description" 
                                rows="5" 
                                cols="67"
                                value={description}
                                onChange={(e) => {setDescription(e.target.value); setMessage('')}}
                                placeholder="Enter Description"
                            />
                        </div>
                        <div className='post_detail_form_requirements'>
                            <label htmlFor='requirements'>Requirements (one per line):</label>
                            <textarea
                                rows="5" 
                                cols="67"
                                name='requirements'
                                value={requirements}
                                onChange={(e) => {setRequirements(e.target.value.split(',').map((item) => item.trim())); setMessage('');}}
                                placeholder="Enter requirements"
                            />
                        </div>
                        <div className='post_detail_form_skills'>
                            <label htmlFor='skills'>Skills (Separated By Comma):</label>
                            <textarea
                                name='skills'
                                value={skillsRequired}
                                onChange={(e) => {setSkillsRequired(e.target.value.split(',').map((item) => item.trim())); setMessage('');}}
                                placeholder="Enter skills"
                            />
                        </div>
                        <div className='post_detail_form_employment_type'>
                            <label htmlFor='employment'>Employment Type:</label>
                            <select name='employment' value={employmentType} onChange={(e) => {setEmploymentType(e.target.value); setMessage('');}}>
                                <option value="" disabled>Select Employment Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                        <div className='post_detail_form_location'>
                            <label htmlFor='location'>Location:</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => {setLocation(e.target.value); setMessage('');}}
                                placeholder="Enter location"
                            />
                        </div>
                        <div className='post_detail_form_salary'>
                            <label htmlFor='salary'>Salary:</label>
                            <input
                                name='salary'
                                type="number"
                                value={salary}
                                onChange={(e) => {setSalary(e.target.value); setMessage('');}}
                                placeholder="Enter salary"
                            />
                        </div>
                        <div className='post_detail_form_update'>
                            <button onClick={handleJobUpdateSubmit}>Update Job</button>
                        </div>
                        {
                            message ? 
                            ( <div className='post_detail_informative_message'><span>{message}</span></div> ) : ( <></> )
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default PostDetail;