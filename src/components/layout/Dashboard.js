import React, { useState, useEffect } from 'react';
import './dashboard.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { v4 as uuidv4 } from 'uuid';


const Dashboard = ({ auth, logoutUser }) => {
  const [data, setData] = useState([]);

  const [selectedOptionGroup1, setSelectedOptionGroup1] = useState('age(oldest first)');
  const [state, setState] = useState();
  const [alarm, setAlarm] = useState(false);
  const [clientId] = useState(uuidv4());

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/${clientId}`);

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      
      setData((prevData) => {
        // Check if newData already exists in prevData
        const exists = prevData.some(data => JSON.stringify(data) === JSON.stringify(newData));
        
        // Only add newData if it doesn't already exist
        if (!exists) {
          return [...prevData, newData];
        }
        
        // Return prevData unchanged if newData already exists
        return prevData;
      });
    };

    return () => {
      ws.close();
    };
  }, [clientId]);



  const handleRadioChangeGroup1 = (event) => {
    setSelectedOptionGroup1(event.target.value);
  };
  const { user } = auth;
  console.log(user)
  const onLogout = e => {
    e.preventDefault();
    logoutUser();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`Selected option for Group 1: ${selectedOptionGroup1}`);
    const myRequest = { message: selectedOptionGroup1, clientId }; 

    try {
      //Check If the scrapper for current client ID is already running on Backend
      const clients = await fetch(`http://localhost:3000/clients?client=${encodeURIComponent(clientId)}`);
      const returned = await clients.json();
      console.log(returned)
      if (returned) {
        setAlarm(true);
        return;
      }

      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(myRequest),
      });
      if (response) {
        setState('Scrapper Starting....')
      }
      
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      setState("Could not start Scrapper....")
      console.error("Error:", error);
    }
  };

  return (
    <div className="app">
      <div className="container text-center mt-15">
        <div className="row">
          <div className="col-sm-12">
            <h4>
              Hey there, <b className="name-lable">{user.name.split(" ")[0]}</b>
              <p className="mt-4">
                You are logged in to{" "}
                <span style={{ fontFamily: "monospace" }}>Scrapper</span> 👏
              </p>
            </h4>
            <button
              onClick={onLogout}
              className="btn btn-large btn-light hoverable font-weight-bold"
            >
              Logout
            </button>
            
          </div>
          
        </div>
        <h4 className="alarm">
        {alarm ? 'Please retry on new Tab' : ''}
        </h4>
      </div>
      <div className="main-container">
        <div className="container1">
          <Form onSubmit={handleSubmit} className='my-form'>
            {/* Radio button group 1 */}
            <Form.Group>
              <Form.Label>Select the filter </Form.Label>
              <div>
                {/* On single Click on Age on Backend */}
                <Form.Check
                  type="radio"
                  label="Age (Oldest First)"
                  name="group1"
                  value="age(oldest first)"
                  checked={selectedOptionGroup1 === 'age(oldest first)'}
                  onChange={handleRadioChangeGroup1}
                />
                {/* On Double Click on Age on Backend */}
                <Form.Check
                  type="radio"
                  label="Age (Recent First)"
                  name="group1"
                  value="age(recent first)"
                  checked={selectedOptionGroup1 === 'age(recent first)'}
                  onChange={handleRadioChangeGroup1}
                />
                {/* On single Click on Volume on Backend */}
                <Form.Check
                  type="radio"
                  label="Volume (Highest First)"
                  name="group1"
                  value="volume(highest first)"
                  checked={selectedOptionGroup1 === 'volume(highest first)'}
                  onChange={handleRadioChangeGroup1}
                />
                {/* On Double Click on Age on Backend */}
                <Form.Check
                  type="radio"
                  label="Volume (Lowest First)"
                  name="group1"
                  value="volume(lowest first)"
                  checked={selectedOptionGroup1 === 'volume(lowest first)'}
                  onChange={handleRadioChangeGroup1}
                />

                <Form.Check
                  type="radio"
                  label="T.M Cap (Highest First)"
                  name="group1"
                  value="tmcap(highest first)"
                  checked={selectedOptionGroup1 === 'tmcap(highest first)'}
                  onChange={handleRadioChangeGroup1}
                />
                <Form.Check
                  type="radio"
                  label="T.M Cap (Low First)"
                  name="group1"
                  value="tmcap(low first)"
                  checked={selectedOptionGroup1 === 'tmcap(low first)'}
                  onChange={handleRadioChangeGroup1}
                />

              </div>
            </Form.Group>

            {/* Radio button group 2 */}


            <Button variant="primary" type="submit">
              Submit
            </Button>
            
          </Form>
        </div>
        <div className="container2">
          {state} 
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.href || item.message}</a>
              </li>//
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};
//jhhg
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
