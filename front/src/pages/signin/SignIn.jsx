import React, { useState } from "react";
import styled from "styled-components";
import { Box, Typography, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { auth, googleProvider } from "../../FireBase";
import { signInWithPopup } from "firebase/auth";

const FormContainer = styled(Box)`
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
  color: #1976d2;
  font-size: 36px;
  margin-bottom: 30px;
`;

const InputField = styled(TextField)`
  margin-bottom: 20px !important;
  width: 300px;
`;

const StyledButton = styled(Button)`
  margin-top: 30px;
  background-color: #1976d2;
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { // Define userData object here
      email: email,
      password: password,
    };
    try {
      const response = await axios.post("https://backstore-iqcq.onrender.com/auth/login", userData); // Use userData object here
      const user = response.data.user; // Assuming the user data is in the response.data.user property
      dispatch(login(user));
      localStorage.setItem("user", JSON.stringify(user)); // Store user data in localStorage
      if (user.role === "Admin") { // Check user role and navigate accordingly
        navigate("/Admin/Management");
      } else { // Assuming "User" role for regular users
        navigate("/");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // Use signInWithPopup from Firebase auth
      const user = result.user;
      const response = await axios.post("https://backstore-iqcq.onrender.com/auth/google-login", { 
        email: user.email,
        googleId: user.uid,
        fullName: user.displayName,
      });
      const userData = response.data.user; // Assuming the user data is in the response.data.user property
      dispatch(login(userData)); // Dispatch the login action with userData
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error(error);
    }
  };

  const handleForgotPassword = async () => {
    try { // Send verification code to the provided email
      const response = await axios.post("https://backstore-iqcq.onrender.com/auth/send-code", { email: forgotEmail });
      setSentCode(response.data.code); // Store the sent code for verification
    } catch (error) {
      setError("Failed to send verification code. Please check the email.");
      console.error(error);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode === sentCode) { // Check if the entered code matches the sent code
      if (newPassword.length>=6 && newPassword === confirmPassword) { // Check if the new password and confirm password match and length is at least 6 characters
        try {
          await axios.put("https://backstore-iqcq.onrender.com/auth/reset-password", { // Send a PUT request to reset the password
            email: forgotEmail,
            password: newPassword,
          });
          setDialogOpen(false);
          setError("");
          setSuccess("Password reset successful. You can now sign in with your new password.");
          setNewPassword("");
          setConfirmPassword("");
          navigate("/SignIn"); // Redirect to the sign-in page after successful password reset
        } catch (error) {
          setError("Failed to reset password. Please try again.");
        }
      } else if(newPassword !== confirmPassword) { // Check if the new password and confirm password match
        setError("Passwords do not match.");
      }else if(newPassword.length<6){  // Check if the new password length is at least 6 characters
        setError("Password must be at least 6 characters long.");
      }
    } else { // If the entered code does not match the sent code
      setError("Incorrect verification code.");
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
        <StyledButton type="submit" variant="contained" onClick={handleSubmit}>
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
      <Button
          variant="text"
          onClick={() => setDialogOpen(true)}
          style={{ marginTop: "10px", textTransform: "none" }}
        >
          Forgot your password?
      </Button>

      {/* Forgot Password Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter your email"
            fullWidth
            margin="normal"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <Button onClick={handleForgotPassword} variant="contained" fullWidth>
            Send Code
          </Button>
          {sentCode && (
            <>
              <TextField
                label="Enter Verification Code"
                fullWidth
                margin="normal"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)} 
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={handleVerifyCode} variant="contained" fullWidth>
                Reset Password
              </Button>
            </>
          )}
          {error && ( // Display error message if there is an error
          <Alert severity="error" style={{ marginTop: "20px", width: "100%" }}>
            {error}
          </Alert>
        )}
        {success && ( // Display success message if there is a success
          <Alert severity="success" style={{ marginTop: "20px", width: "100%" }}>
            {success}
          </Alert>
        )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </FormContainer>
  );
};

export default SignIn;
