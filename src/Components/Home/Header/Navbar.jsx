import { useNavigate } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import "./Header.css";
const Navbar = () => {
  return (
    <>
      <div className="sm-banner">
        <img className="logo-img" data-aos="zoom-in" src={logo} alt="" />
      </div>
      <br />
      <br />
    </>
  );
};

export default Navbar;
