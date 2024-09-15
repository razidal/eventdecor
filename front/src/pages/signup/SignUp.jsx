import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Alert from "@mui/material/Alert";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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
  color: #3f51b5;
  font-size: 36px;
  margin-bottom: 30px;
`;

const InputField = styled(TextField)`
  margin-bottom: 20px !important;
`;

const StyledButton = styled(Button)`
  margin-top: 30px;
  background-color: #3f51b5;
  &:hover {
    background-color: #2c387e;
  }
`;

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({});
  let navigate = useNavigate();

  const Validate = () => {
    const error = {};
    const today = new Date(); // Get today's date

    if (!fullName) { 
      error.fullName = "Required field";
      //only English letters
    } else if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(fullName)) {
      error.fullName =
        "Please enter a valid full name without leading or trailing spaces";
    }
    if (!email) { //email validation
      error.email = "Required field";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error.email = "Invalid email address";
    }
    if (!password) { //password validation
      error.password = "Required field";
    } else if (password.length < 6) {
      error.password = "Password must be at least 6 characters long";
    }
    if (!date) { //date validation
      error.date = "Required field";
    }else if (new Date(date)> today) { //Check if the selected date is in the future
      error.date = "Date of birth cannot be in the future";
    }
    setValidationError(error);
    return Object.keys(error).length === 0; // Return true if no errors, false otherwise
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (Validate()) { //if validation is true, then submit the form
      const formattedDate = new Date(date).toISOString().split('T')[0];  // Convert date to ISO format without time
      
      const userData = { // Create user data object
        fullName: fullName,
        email: email,
        password: password,
        dateOfBirth: formattedDate,
      };

      try {
        const response = await axios.post( // Send POST request to the server
          "https://backstore-iqcq.onrender.com/auth/register",
          userData
        );
        console.log(response.data);
        setError("Registration successful");
        setTimeout(() => {
          ///after a succeful sign up , go to sign in page
          navigate("/signin");
        }, 2000); // Redirect to sign-in page after 2 seconds
      } catch (error) {
        if (error.response && error.response.data) { // Check if error response exists and has data property
          setError(error.response.data.error || "Registration failed");
        } else {
          setError("Registration failed"); // Set error message to "Registration failed" if no error response data is available
        }
        console.error(error);
      }
    }
  };
//sign up via Google
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // Sign in with Google using Firebase authentication
      const user = result.user;
 
      const response = await axios.post("https://backstore-iqcq.onrender.com/auth/google", { // Send POST request to the server with Google user data
        googleId: user.uid,
        email: user.email,
        fullName: user.displayName,
      });

      console.log("Google sign-up successful", response.data);
      setError("Google Sign Up successful");
      setTimeout(() => {
        navigate("/"); //go to homepage
      }, 2000); // Redirect to homepage after 2 seconds
    } catch (error) {
      console.error("Error during Google Sign Up:", error);
      setError("Google Sign Up failed");
    }
  };

  return (
    <FormContainer component="form" noValidate autoComplete="off">
      <Title>Sign Up</Title>
      <InputField
        id="outlined-fullname"
        label="Full Name"
        variant="outlined"
        required
        error={!!validationError.fullName}
        helperText={validationError.fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
      />
      <InputField
        id="outlined-date"
        type="date"
        label="Date of Birth"
        variant="outlined"
        required
        onChange={(e) => setDate(e.target.value)}
        helperText={validationError.date}
        error={!!validationError.date}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
      <InputField
        id="outlined-email"
        label="Email"
        type="email"
        required
        variant="outlined"
        onChange={(e) => setEmail(e.target.value)}
        error={!!validationError.email}
        helperText={validationError.email}
        fullWidth
      />
      <InputField
        id="outlined-password"
        label="Password"
        type="password"
        variant="outlined"
        onChange={(e) => setPassword(e.target.value)}
        required
        error={!!validationError.password}
        helperText={validationError.password}
        fullWidth
      />
      <Typography variant="body1" align="center" style={{ marginTop: "20px" }}>
        Have an account? <Link to="/SignIn">Sign In</Link>
      </Typography>
      <Button
        variant="contained"
        onClick={handleGoogleSignup}
        fullWidth
        style={{
          marginTop: "16px",
          marginBottom: "16px",
          backgroundColor: "#4285F4",
          color: "white",
        }}
      >
        Sign up with Google
      </Button>
      <StyledButton variant="contained" onClick={submitHandler} fullWidth>
        Sign Up
      </StyledButton>
      {error && (
        <Alert severity="error" style={{ marginTop: "20px", width: "100%" }}>
          {error}
        </Alert>
      )}
    </FormContainer>
  );
};

export default SignUp;
