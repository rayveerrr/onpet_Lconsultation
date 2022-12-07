import React from "react";

import "../../styles/footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="footer-section">
          <div>
            <h4>Popular Item</h4>
            <p>Dog Food</p>
            <p>Collar</p>
            <p>Cage</p>
          </div>
          <div>
            <h4>Paws and Claws Grooming Services</h4>
            <p>Facebook</p>
            <p>Instagram</p>
          </div>
          <div>
            <h4>About</h4>
            <p>About Us</p>
            <p>Contact Us</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
