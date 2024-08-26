import React, { useState, useEffect } from 'react';
import './dashboard.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';

import InputGroup from 'react-bootstrap/InputGroup';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { v4 as uuidv4 } from 'uuid';


const Dashboard = ({ auth, logoutUser }) => {
  const [data, setData] = useState([]);

  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [volumeMin, setVolumeMin] = useState('');
  const [volumeMax, setVolumeMax] = useState('');
  const [tmcapMin, setTmcapMin] = useState('');
  const [tmcapMax, setTmcapMax] = useState('');

  const [state, setState] = useState();
  const [alarm, setAlarm] = useState(false);
  const [clientId] = useState(uuidv4());
  const [error, setError] = useState('');

  const [subscribed, setSubscribed] = useState(true);

  const handleSubscription = async () => {
    const { user } = auth;
    const clients = await fetch(
      `http://localhost:3000/api/users/getUser?email=${user.email}`
    );
    const res= await clients.json()
    // console.log(clients.json())
    if(res.paymentStatus == "unpaid"){
      setSubscribed(false)
    }
    // setSubscribed()
    // console.log(res)
  }

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






  const { user } = auth;
  console.log(user)
  useEffect(() => {
    handleSubscription()
    // if (user.paymentStatus === 'unpaid') {
    //   console.log("Payment is unpaid");
    //   window.location.href = 'https://commerce.coinbase.com/checkout/de28a0c3-2542-4555-805e-bc7b6b625625';
    // } else {
    //   console.log("Payment is paid");
    // }
  }, [auth, user.paymentStatus]);
  const onLogout = e => {
    e.preventDefault();
    logoutUser();
  };

  const handleNumberChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (ageMin !== '' && ageMax !== '' && parseInt(ageMin) > parseInt(ageMax)) {
      console.log("Age min is greater")
      setError('Age Min should not be greater than Age Max');
      return;
    }
    if (volumeMin !== '' && volumeMax !== '' && parseInt(volumeMin) > parseInt(volumeMax)) {
      setError('Volume Min should not be greater than Volume Max');
      return;
    }
    if (tmcapMin !== '' && tmcapMax !== '' && parseInt(tmcapMin) > parseInt(tmcapMax)) {
      setError('TmCap Min should not be greater than TmCap Max');
      return;
    }
    setError('');
    try {
      // Check if the scrapper for the current client ID is already running on the backend
      const clients = await fetch('http://localhost:3000/sockets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client: clientId }), // Sending client in the body
      });
      
      const returned = await clients.json();
      console.log(returned);
      if (returned) {
        setAlarm(true);
        return;
      }
      

      const myRequest = {
        ageMin: ageMin,
        ageMax: ageMax,
        volumeMin: volumeMin,
        volumeMax: volumeMax,
        tmcapMin: tmcapMin,
        tmcapMax: tmcapMax,
        clientId: clientId
      };

      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(myRequest),
      });
      console.log(response);
      if (response) {
        setState('Please wait while scrapper fetches the data....');
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      setState("Could not start Scrapper....");
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
                <span style={{ fontFamily: "monospace" }}>Typhoon telegram scrapper</span> 👏
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
        <h4 className="alarm">{alarm ? "Please retry on new Tab" : ""}</h4>
      </div>
      {
        subscribed == false ?
        <div className="text-center p-5">
          <blockquote class="blockquote text-center">
            <p class="mb-0">To Continue using Typhoon subscribe to one of following subscription.</p>
            <footer class="blockquote-footer mt-1">While payment please use the same email address you have used for account creation</footer>
            {/* <footer class="blockquote-footer mt-3">Someone famous in <cite title="Source Title">Source Title</cite></footer> */}
          </blockquote>
        {/* <div className="p-1"></div> */}
        <a href="https://commerce.coinbase.com/checkout/3bb8b720-2718-430d-8607-bdbd9566b5e7" 
           target="_blank" 
           className="btn btn-primary">
          Pay 0.1 sol for Trial
        </a>
        <a href="https://commerce.coinbase.com/checkout/de28a0c3-2542-4555-805e-bc7b6b625625" 
           target="_blank" 
           className="btn btn-primary mx-2">
          Pay 0.4 sol for Subscription
        </a>
      </div>
      
      :
      <div className="main-container">
        <div className="container1">

          {error && <Alert variant="danger">{error}</Alert>}
          <div className="age">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Age</InputGroup.Text>
              <Form.Control
                placeholder="Min - Hours"
                aria-label="min hours"
                aria-describedby="min hours"
                value={ageMin}
                onChange={handleNumberChange(setAgeMin)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Age</InputGroup.Text>
              <Form.Control
                placeholder="Max - Hours"
                aria-label="max hours"
                aria-describedby="max hours"
                value={ageMax}
                onChange={handleNumberChange(setAgeMax)}
              />
            </InputGroup>
          </div>
          <div className="volume">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Volume</InputGroup.Text>
              <Form.Control
                placeholder="Min $"
                aria-label="min vol"
                aria-describedby="min vol"
                value={volumeMin}
                onChange={handleNumberChange(setVolumeMin)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Volume</InputGroup.Text>
              <Form.Control
                placeholder="Max $"
                aria-label="max vol"
                aria-describedby="max vol"
                value={volumeMax}
                onChange={handleNumberChange(setVolumeMax)}
              />
            </InputGroup>
          </div>
          <div className="tmcap">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">TmCap</InputGroup.Text>
              <Form.Control
                placeholder="Min $"
                aria-label="min tmcap"
                aria-describedby="min tmcap"
                value={tmcapMin}
                onChange={handleNumberChange(setTmcapMin)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">TmCap</InputGroup.Text>
              <Form.Control
                placeholder="Max $"
                aria-label="max tmcap"
                aria-describedby="max tmcap"
                value={tmcapMax}
                onChange={handleNumberChange(setTmcapMax)}
              />
            </InputGroup>
          </div>
          <Button onClick={handleSubmit} variant="primary" type="button">
            Submit
          </Button>

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
      }
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
