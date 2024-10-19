import { useNavigate } from "react-router-dom";
import "../static/css/components/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="navbar_container">
            <div className="navbar_left">
                <a href="/">
                    <span className="span_1">Linked</span>
                    <span className="span_2">X</span>
                </a>
            </div>
            <div className="navbar_right">
                <button
                    className="navbar_option_1"
                    onClick={() => navigate("/signup")}
                >
                    SignUp
                </button>
                <button
                    className="navbar_option_2"
                    onClick={() => navigate("/signin")}
                >
                    SignIn
                </button>
            </div>
        </div>
    );
};

export default Navbar;
