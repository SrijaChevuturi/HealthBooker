import React from 'react'
import './Aboutus.css'

function Aboutus() {
  return (
    <div className='container'>
        <h2 className='about-heading'>About Us</h2>
    <div className='ahero'>
        <div className='about'>
            <div className='ahero-img'>
                <img src="https://hms.harvard.edu/sites/default/files/media/800-Doctors-Talking-GettyImages-1421919753.jpg"></img>
            </div>
            <div className='ahero-content'>
                <p>At our hospital, we are committed to providing exceptional care that prioritizes both medical expertise and compassionate support. With state-of-the-art facilities and a dedicated team of healthcare professionals, we strive to deliver personalized treatment tailored to each patient's needs. Our commitment to innovation and continuous improvement ensures that we remain at the forefront of medical advancements, while our unwavering focus on patient-centered care ensures that every individual receives the attention and support they deserve throughout their healthcare journey.</p>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Aboutus