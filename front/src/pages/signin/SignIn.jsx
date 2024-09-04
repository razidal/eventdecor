import React, { useState } from "react";
import styled from "styled-components";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { auth, googleProvider } from "../../FireBase"; 
import { signInWithPopup } from "firebase/auth";

const FormContainer = styled(Box)
`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  max-width: 400px;
  margin: auto;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #3f51b5;
  font-size: 36px;
  margin-bottom: 30px;
`;

const InputField = styled(TextField)`
  margin-bottom: 20px !important;
  width: 300px;
`;

const StyledButton = styled(Button)`
  margin-top: 30px;
  background-color: #3f51b5;
  width: 300px;
  &:hover {
    background-color: #2c387e;
  }
`;

const GoogleButton = styled(Button)`
  background-color: #4285f4;
  color: white;
  width: 300px;
  &:hover {
    background-color: #357ae8;
  }
`;
const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px; 
  align-items: center;
  width: 100%;
`;

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        "https://backstore-iqcq.onrender.com/auth/login",
        userData
      );
      const user = response.data.user;
      dispatch(login(user));
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "Admin") {
        navigate("/Admin/Management");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Send the user's Google credentials to your backend
      const response = await axios.post(
        "https://backstore-iqcq.onrender.com/auth/google-login",
        {
          email: user.email,
          googleId: user.uid,
          fullName: user.displayName,
        }
      );
      const userData = response.data.user;
      dispatch(login(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <FormContainer component="form" noValidate autoComplete="off">
      <Title>Sign In</Title>
      <InputField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <ButtonContainer>
        <StyledButton
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        >
          Sign In
        </StyledButton>
        <GoogleButton variant="contained" onClick={handleGoogleSignIn}>
          Sign In with Google
        </GoogleButton>
      </ButtonContainer>
      {error && (
        <Alert severity="error" style={{ marginTop: "20px", width: "100%" }}>
          {error}
        </Alert>
      )}
      <Typography variant="body1" align="center" style={{ marginTop: "20px" }}>
        Don't have an account? <Link to="/SignUp">Sign up</Link>
      </Typography>
    </FormContainer>
  );
};

export default SignIn;
