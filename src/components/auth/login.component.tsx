import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Dialog, DialogTitle, TextField, Button } from "@mui/material";
import { Navigate  } from "react-router-dom";
import { StoreContext } from "../../store.context";
import "./auth.style.css";

const LoginView: React.FC = () => {
  const { authStore } = useContext(StoreContext);
  const authenticated = authStore.isAuthenticated();
  const loginState = authStore.getLoginState();
  const registerState = authStore.getRegisterState();

  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [showDialog, setShowDialog] = useState(1);

  if(authenticated) return (<Navigate to={"/guest"}/>)

  return (
    <>
    <Dialog open={!authenticated && showDialog === 1}>
      <DialogTitle>Sign In</DialogTitle>
      <div className="container">
        <TextField
          className="text-field"
          label="Username"
          type="text"
          value={name}
          onChange={(event) => setUsername(event.target.value)}
          style={{width: '500px'}}
        />
        <TextField
          className="text-field"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <span className="link-field" onClick={() => setShowDialog(2)}>Sign up!</span>
        <Button onClick={() => authStore.login({ name, password })}>
          Login
        </Button>
        <span className="link-field" style={!loginState ? { color: 'red' } : { display: 'none' }}>Login Fail!</span>
      </div>
    </Dialog>
    <Dialog open={!authenticated && showDialog === 2}>
      <DialogTitle>Sign Up</DialogTitle>
      <div className="container">
        <TextField
          className="text-field"
          label="Username"
          type="text"
          value={name}
          onChange={(event) => setUsername(event.target.value)}
          style={{width: '500px'}}
        />
        <TextField
          className="text-field"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          className="text-field"
          label="Password Confirm"
          type="password"
          value={password_confirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
        />
        <span className="link-field" onClick={() => setShowDialog(1)}>Sign in!</span>
        <Button onClick={() => authStore.register({ name, password, password_confirmation})}>
          Register
        </Button>
        <span className="link-field" style={!registerState ? { color: 'red' } : { display: 'none', color: 'red' }}>Register Fail!</span>
      </div>
    </Dialog>
    </>
  );
};

const Login = observer(LoginView);
export { Login };
