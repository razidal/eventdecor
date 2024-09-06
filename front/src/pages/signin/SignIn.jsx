import React, { useState } from "react";
import {
  Box, TextField, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle,
  Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    try {
      const response = await axios.post(
        "https://backstore-iqcq.onrender.com/auth/login", userData
      );
      const user = response.data.user;
      dispatch(login(user));
      localStorage.setItem("user", JSON.stringify(user));
      user.role === "Admin" ? navigate("/Admin/Management") : navigate("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("https://backstore-iqcq.onrender.com/auth/send-code", { email: resetEmail });
      setVerificationCode(response.data.code); // backend sends verification code
      setCodeSent(true);
    } catch (err) {
      setResetError("Failed to send verification code. Please check the email.");
    }
  };

  const handleResetPassword = async () => {
    if (resetCode !== verificationCode) {
      setResetError("Incorrect code.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    try {
      await axios.put("https://backstore-iqcq.onrender.com/auth/reset-password", {
        email: resetEmail, password: newPassword
      });
      setOpenDialog(false);
    } catch (err) {
      setResetError("Failed to reset password.");
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      {/* Sign In Form */}
      <Typography variant="body1" align="center" style={{ marginTop: "20px" }}>
        Forgot your password?{" "}
        <Link onClick={() => setOpenDialog(true)}>Click here</Link>
      </Typography>

      {/* Forgot Password Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {!codeSent ? (
            <TextField
              label="Enter your emaila"
              fullWidth
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          ) : (
            <>
              <TextField
                label="Enter verification code"
                fullWidth
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!codeSent ? (
            <Button onClick={handleForgotPassword}>Send Code</Button>
          ) : (
            <Button onClick={handleResetPassword}>Reset Password</Button>
          )}
        </DialogActions>
        {resetError && <Alert severity="error">{resetError}</Alert>}
      </Dialog>
    </Box>
  );
};

export default SignIn;
