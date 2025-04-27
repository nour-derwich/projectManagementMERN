import React, { useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBCard,
  MDBCardBody
} from 'mdb-react-ui-kit';
import Register from '../components/Rgister';
import Login from '../components/Login';

const Landing = () => {
  const [justifyActive, setJustifyActive] = useState('tab1');

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  return (
    <div className="bg-light d-flex align-items-center justify-content-center min-vh-100">
      <MDBContainer className="p-3 my-5">
        <MDBCard className="shadow-sm">
          <MDBCardBody className="p-5">
            <MDBTabs pills justify className='mb-4'>
              <MDBTabsItem>
                <MDBTabsLink 
                  onClick={() => handleJustifyClick('tab1')} 
                  active={justifyActive === 'tab1'}
                  data-tab="login"
                >
                  Login
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink 
                  onClick={() => handleJustifyClick('tab2')} 
                  active={justifyActive === 'tab2'}
                  data-tab="register"
                >
                  Register
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
              <MDBTabsPane show={justifyActive === 'tab1'}>
                <Login />
              </MDBTabsPane>

              <MDBTabsPane show={justifyActive === 'tab2'}>
                <Register />
              </MDBTabsPane>
            </MDBTabsContent>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default Landing;