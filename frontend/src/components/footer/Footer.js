import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import './Footer.css'

function Footer() {
  return (
    <div className='f'>
    <div className='footer d-flex justify-content-between m-auto'>
        <div className='footer-links text-white'>
            <h3>Links</h3>
            <ul>
                <li>
                    <NavLink className="text-white" to={"/"}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink className="text-white"  to={"/Doctors"}>
                        Doctors
                    </NavLink>
                </li>
                <li>
                    <NavLink className="text-white"  to={"/Aboutus"}>
                        About Us
                    </NavLink>
                </li>
                <li>
                    <NavLink className="text-white"  to={"/ContactUs"}>
                        Contact Us
                    </NavLink>
                </li>
                <li>
                    <NavLink className="text-white"  to={"/Register"}>
                        Register
                    </NavLink>
                </li>
                <li>
                    <NavLink className="text-white"  to={"/Login"}>
                        Login
                    </NavLink>
                </li>
            </ul>
        </div>
        <div className="social">
            <h3>Social links</h3>
            <ul>
              <li className="facebook">
                <a
                  href="https://www.facebook.com/"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaFacebookF />
                </a>
              </li>
              <li className="youtube">
                <a
                  href="https://www.youtube.com/"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaYoutube />
                </a>
              </li>
              <li className="instagram">
                <a
                  href="https://www.instagram.com/"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaInstagram />
                </a>
              </li>
            </ul>
          </div>

    </div>
    </div>
  )
}

export default Footer