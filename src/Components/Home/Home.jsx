import "../../styles/Home.css";
import sideImage from "../../assets/sideImage.png";
import logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import data from "../../json/dynamicForm.json";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS

function Home() {
  const navigate = useNavigate();
  const [initialFields, setInitialFields] = useState([]);

  useEffect(() => {
    setInitialFields(data);
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Trigger animation only once
    });
  }, [data]);

  return (
    <div className="container">
      <div className="banner">
        <div className="banner_group">
          <div className="banner-left">
            <div data-aos="zoom-out">
              <img className="logo" src={logo} alt="Side" />
            </div>
            <h2 data-aos="fade-right">
              Welcome to the survey of selection page
            </h2>
            <p data-aos="fade-right">Select the Way that you wish to attend </p>
          </div>
          <div className="banner-right">
            <img
              data-aos="zoom-in"
              className="sideImage"
              src={sideImage}
              alt="Side"
            />
          </div>
        </div>
      </div>

      <div className="list-container">
        {initialFields.map((obj, index) => {
          return (
            <div className="list" key={index} data-aos="zoom-in">
              <p>{obj.formId}</p>
              <button
                className="submit-btn"
                style={{ backgroundColor: obj.color }}
                onClick={() => navigate(`/form/${obj.formId}`)}
              >
                Submit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
