import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../static/css/pages/FreelancerDashboard.css";
import "../static/css/pages/ProducerDashboard.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Loading from "../components/Loading";
import ChatIcon from "@mui/icons-material/Chat";

// Using this until i use an actual api to fetch blogs online
// (Since number of requests per day are limited :D)
const blogPosts = [
  {
    image: "",
    title: "",
    link: "",
  },
  {
    image: "",
    title: "",
    link: "",
  },
  {
    image: "",
    title: "",
    link: "",
  },
  {
    image: "",
    title: "",
    link: "",
  },
  {
    image: "",
    title: "",
    link: "",
  },
];

const connectionRequestsData = [
  {
    username: "USER-1",
    role: "FREELANCER",
    status: "PENDING",
  },
  {
    username: "USER-2",
    role: "PRODUCER",
    status: "PENDING",
  },
  {
    username: "USER3",
    role: "FREELANCER",
    status: "PENDING",
  },
];

const FreelancerDashboard = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // States for dynamic rendering
  const [appliedJobPosts, setAppliedJobPosts] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  // const [connectionRequests, setConnectionRequest] = useState([]);
  const [appliedJob, setAppliedJobs] = useState([]);
  const [incomingConnectionRequests, setIncomingConnectionRequests] = useState(
    []
  );

  // HATE SEEING THE SPLIT SECOND FLASHES
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ----------------- FETCHING USER DETAILS LIKE ROLE AND USERNAME -----------------
    axios
      .get("http://localhost:3000/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data)
        const role = response.data.user.payload.role;
        localStorage.setItem("role", role);
        setUserRole(role);
        setUsername(response.data.user.payload.username);
      })
      .catch((error) => {
        // console.log(error.response.data)
        console.error("Error fetching user data:", error);
      });

    // ----------------- ONLY FREELANCERS CAN ACCESS THE FREELANCER DASHBOARD -----------------
    if (userRole === "PRODUCER") {
      navigate("/");
    }

    // ----------------- FETCHING THE JOBS TO SHOW ON THE DASHBOARD -----------------
    axios
      .get("http://localhost:3000/freelancer/get-job-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data)
        setJobPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    // ----------------- FETCHING THE APPLIED JOBS TO SHOW ON THE DASHBOARD -----------------
    axios
      .get("http://localhost:3000/freelancer/get-applied-job-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data)
        setAppliedJobPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  // ----------------- HANDLING THE PROFILE BUTTON CLICK -----------------
  const handleProfileClick = () => {
    navigate(`/profile/${userRole}/${username}`);
  };

  // ----------------- HANDLING THE CHAT BUTTON CLICK -----------------
  const handleChatClick = () => {
    navigate(`/chat/${userRole}/${username}`);
  };

  // ----------------- HANDLING THE LOGOUT BUTTON CLICK -----------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // console.log(appliedJobPosts)

  // ----------------- FOR UNAUTHORIZED USERS -----------------
  if (token === null) {
    return (
      <div>
        <h1>
          Unauthorized, Please Signin <a href="/signin">Here</a>
        </h1>
      </div>
    );
  }

  // ----------------- FOR AUTHORIZED USERS FURTHER BETWEEN FREELANCERS AND PRODUCERS -----------------
  else if (userRole === "FREELANCER") {
    return (
      <>
        <div className="freelancer_navbar_container">
          <div className="freelancer_navbar_left">
            <a href="/freelancer-dashboard">
              <span className="freelancer_nav_span_1">Linked</span>
              <span className="freelancer_nav_span_2">X</span>
            </a>
          </div>
          <div className="freelancer_navbar_right">
            <button
              className="freelancer_chat_button"
              onClick={handleChatClick}
            >
              <ChatIcon style={{ fontSize: "2rem" }} />
            </button>
            <button
              className="freelancer_profile_button"
              onClick={handleProfileClick}
            >
              <AccountCircleIcon style={{ fontSize: "2rem" }} />
            </button>
            <button className="freelancer_logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="freelancer_dash_main_area">
          <div className="freelancer_dash_main_left_area">
            <div className="freelancer_dash_main_left_head">
              <span>Open Vacancies</span>
            </div>
            <div className="freelancer_dash_main_posts">
              {jobPosts.length ? (
                jobPosts.map((job, index) => {
                  return (
                    <div
                      className="producer_dash_job_card"
                      key={job._id}
                      onClick={() => navigate(`/job/${job._id}`)}
                    >
                      <div className="producer_dash_job_card_top">
                        <span>{job.title}</span>
                      </div>
                      <div className="producer_dash_job_card_bottom">
                        <div className="producer_dash_job_card_bottom_left">
                          <span>
                            {job.employmentType}, {job.location}
                          </span>
                        </div>
                        <div className="producer_dash_job_card_bottom_right">
                          {/* <button onClick={() => navigate(`/job/${job._id}`)}>View</button> */}
                          <span>Posted By {job.producer.username}</span>
                          <span>
                            On {new Date(job.postedDate).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : loading ? (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loading />
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Job Posts Yet
                </div>
              )}
            </div>
          </div>

          <div className="freelancer_dash_main_right_area">
            <div className="freelancer_dash_main_right_head">
              <span>Pending Connection Requests</span>
            </div>
            <div className="freelancer_dash_main_requests">
              {incomingConnectionRequests.length ? (
                <div></div>
              ) : loading ? (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loading />
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Pending Connection Requests
                </div>
              )}
            </div>
            <div className="freelancer_dash_main_right_head">
              <span>Applied Jobs</span>
            </div>
            <div className="freelancer_dash_main_requests">
              {appliedJobPosts.length ? (
                appliedJobPosts.map((job, index) => {
                  return (
                    <div
                      className="freelancer_dash_applied_jobs_cards"
                      key={job._id}
                      onClick={() => navigate(`/job/${job._id}`)}
                    >
                      {job.title}
                    </div>
                  );
                })
              ) : loading ? (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loading />
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Applied Jobs Yet
                </div>
              )}
            </div>
            <div className="freelancer_dash_main_right_head">
              <span>Blogs You Might Like:</span>
            </div>
            <div className="freelancer_dash_main_requests">
              {loading ? (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loading />
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Blog Posts Available Right Now
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default FreelancerDashboard;
