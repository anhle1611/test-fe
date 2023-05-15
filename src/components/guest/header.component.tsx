import React, { useContext, useState } from "react";
import { Nav } from "react-bootstrap";
import { Navigate  } from "react-router-dom";
import { StoreContext } from "../../store.context";

const Header: React.FC = () => {
  const { authStore } = useContext(StoreContext);
  const accessToken = authStore.getAccessToken();
  
  return (
    <Nav className="justify-content-end" activeKey="/home">
        <Nav.Item onClick={async() => {
          authStore.logout(accessToken);
        }}>
            LogOut
        </Nav.Item>
    </Nav>
  );
};

export default Header ;
