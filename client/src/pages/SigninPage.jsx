import Navbar from "../components/Navbar";
import Signin from "../components/FreelancerSignin";
import "../static/css/pages/SigninPage.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch } from "@mui/material";
import FreelancerSignin from "../components/FreelancerSignin";
import ProducerSignin from "../components/ProducerSignin";
import axios from "axios";

const SigninPage = () => {
  const [formType, setFormType] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3001/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setToken(token);
          const role = response.data.user.payload.role;
          localStorage.setItem("role", role);
          setUserRole(role);
        })
        .catch((error) => {
          // console.log(error.response.data)
          console.error("Error fetching user data:", error);
        });
    }

    if (userRole === "FREELANCER") {
      navigate("/freelancer-dashboard");
    } else if (userRole === "PRODUCER") {
      navigate("/producer-dashboard");
    }
  }, []);
  console.log(token);

  const handleToggle = () => {
    setFormType(!formType);
  };

  if (token === null) {
    return (
      <div className="signin_page_container">
        <Navbar />
        {formType ? (
          <div className="signin_form_container">
            <FormControlLabel
              control={<Switch defaultChecked />}
              label={
                <span style={{ color: "grey", fontWeight: "bold" }}>
                  Producer / Freelancer
                </span>
              }
              onChange={handleToggle}
            />
            <FreelancerSignin />
          </div>
        ) : (
          <div className="signin_form_container">
            <FormControlLabel
              control={<Switch defaultChecked />}
              label={
                <span style={{ color: "grey", fontWeight: "bold" }}>
                  Producer / Freelancer
                </span>
              }
              onChange={handleToggle}
            />
            <ProducerSignin />
          </div>
        )}
      </div>
    );
  }
};

export default SigninPage;
