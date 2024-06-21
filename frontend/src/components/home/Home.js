import React from 'react'
import './Home.css'
import Hero from '../Hero/Hero'
import Aboutus from '../aboutus/Aboutus'
import Contactus from '../contactus/Contactus'
import HomeCircles from '../homeCircles/HomeCircles'

function Home() {
  return (
    <>
    <Hero></Hero>
    <Aboutus></Aboutus>
    <HomeCircles></HomeCircles>
    <Contactus></Contactus>
    </>
  )
}

export default Home;
