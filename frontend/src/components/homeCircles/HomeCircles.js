import React from "react";
import CountUp from "react-countup";
import './HomeCircles.css'

const HomeCircles = () => {
  return (
    <div className="container">
      <div className="circles">
      <div className="circle">
        <CountUp
          start={0}
          end={1000}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Satisfied
          <br />
          Patients
        </span>
      </div>
      <div className="circle">
        <CountUp
          start={0}
          end={250}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Verified
          <br />
          Doctors
        </span>
      </div>
      <div className="circle">
        <CountUp
          start={0}
          end={75}
          delay={0}
          enableScrollSpy={true}
          scrollSpyDelay={500}
        >
          {({ countUpRef }) => (
            <div className="counter">
              <span ref={countUpRef} />+
            </div>
          )}
        </CountUp>
        <span className="circle-name">
          Specialist
          <br />
          Doctors
        </span>
      </div>
      </div>
    </div>
  );
};

export default HomeCircles;
