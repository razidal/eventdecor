import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import { throttle } from "lodash";

import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeItem, editItem, clearCart } from "../../redux/cartSlice";
import Cookies from "js-cookie";
import styled from "styled-components";
import axios from "axios";

const TotalPriceText = styled(Typography)`
  text-align: right;
  margin-top: 20px;
  color: #333;
  font-weight: bold;
`;

const PayButton = styled(Button)`
  background-color: #007bff;
  color: white;
  margin-top: 20px;
  padding-bottom:300px;
  &:hover {
    background-color: #0056b3;
  }
`;
 
const cityList = [ // Israel city list 
  "Tel Aviv-Yafo","Jerusalem","Haifa","Rishon LeẔiyyon","Petaẖ Tiqwa","Ashdod","Netanya","Beersheba","Holon","Bené Beraq","Ramat Gan",
  "Ashqelon","Reẖovot","Bat Yam","Bet Shemesh","Kefar Sava","Modi‘in Makkabbim Re‘ut","Hadera","Herẕliyya",
  "Nazareth","Lod","Ramla","Ra‘ananna","Qiryat Gat","Rahat","Nahariyya","Afula","Givatayim","Hod HaSharon",
  "Rosh Ha‘Ayin","Qiryat Ata","Umm el Faḥm","Eilat","Nes Ẕiyyona","‘Akko","El‘ad","Ramat HaSharon","Karmiel",
  "Tiberias","Eṭ Ṭaiyiba","Ben Zakkay","Pardés H̱anna Karkur","Qiryat Moẕqin","Qiryat Ono","Shefar‘am","Qiryat Bialik",
  "Qiryat Yam","Or Yehuda","Ẕefat","Dimona","Tamra","Netivot","Sakhnīn","Be’er Ya‘aqov","Yehud","Ofaqim","Kefar Yona",
];

const countries = [ // List of countries for the autocomplete field
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const PaymentForm = ({ totalPrice, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user.user);
  const cartData = useSelector((state) => state.cart.items);
  const [validationError, setValidationError] = useState("");
  
    
  const handleSubmit = throttle(async (e) => { // Throttle the handleSubmit function to prevent multiple submissions
    e.preventDefault();
    setIsProcessing(true);
    setError("");
    setValidationError("");

    // Validation checks
   const cardNumberRegex = /^\d{16}$/; // Credit card number should be 16 digits
   const cvvRegex = /^\d{3,4}$/; // CVV should be 3 or 4 digits
   const nameRegex = /^[A-Za-z\s]+$/; // Name should only contain letters and spaces
   const postalCodeRegex = /^\d+$/; // Postal code should only contain numbers
   const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/; // Expiry date should be in MM/YY format

   if (!cardNumberRegex.test(cardNumber)) { // Check if the card number is valid
     setValidationError("Check fields."); 
     setIsProcessing(false);
     return;
   }

   if(!expiryDateRegex.test(expiryDate)) { // Check if the expiry date is valid
      setValidationError("Check fields.");
      setIsProcessing(false);
   }
 
   if (!cvvRegex.test(cvv)) { // Check if the CVV is valid
     setValidationError("Check fields.");  
     setIsProcessing(false);
     return;
   }

   if (!nameRegex.test(name)) { // Check if the name is valid
     setValidationError("Check fields.");
     setIsProcessing(false);
     return;
   }

   if (!postalCodeRegex.test(postalCode)) { // Check if the postal code is valid
     setValidationError("Check fields.");
     setIsProcessing(false);
     return;
   }
    // Check if all required fields are filled
    if (!street || !city || !postalCode || !country) { 
      setError("All address fields are required.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await axios.post( // Send a POST request to the server to process the payment
        "https://backstore-iqcq.onrender.com/pay/process-payment",
        {
          userId: user._id,
          cartData: cartData.map((item) => ({ // Map the cart data to the required format
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice,
          paymentMethod,
          email: user.email,
          address: { 
            street,
            city,
            postalCode,
            country,
          },
        },
        {
          timeout: 5000, // Set a timeout of 5 seconds for the request
        }
      );

      if (response.data.success) { // Check if the payment was successful
        onSuccess(response.data.orderId);
      } else { // If the payment was not successful, set the error message
        setError("Payment failed. Please try again."); 
      }
    } catch (error) { // If an error occurred, log the error and set the error message
      console.error("Error processing payment:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, 5000);

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)} // Set the payment method based on the selected radio button
      >
        <FormControlLabel
          value="creditCard"
          control={<Radio />}
          label="Credit Card"
        />
      </RadioGroup>

      {paymentMethod === "creditCard" && ( // Render the credit card form if the credit card payment method is selected
        <>
          <TextField
            fullWidth
            label="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)} 
            margin="normal"
            required
            error={!!validationError && !/^\d{16}$/.test(cardNumber)} 
            helperText="Must be 16 digits."
          />
          <TextField
            fullWidth
            label="Expiry Date (MM/YY)"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            margin="normal"
            required
            error={!!validationError && !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)}
            helperText="Must be in MM/YY format."
          />
          <TextField
            fullWidth
            label="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            margin="normal"
            required
            error={!!validationError && !/^\d{3,4}$/.test(cvv)}
            helperText="Must be 3 or 4 digits."
          />
          <TextField
            fullWidth
            label="Cardholder Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            error={!!validationError && !/^[A-Za-z\s]+$/.test(name)}
            helperText="Must contain only letters."
          />
          <TextField
            fullWidth
            label="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            margin="normal"
            required
          />
          <Autocomplete
            fullWidth
            options={cityList}
            value={city}
            onChange={(e, newValue) => setCity(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="City" margin="normal" required />
            )}
          />
          <TextField
            fullWidth
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            margin="normal"
            required
            error={!!validationError && !/^\d+$/.test(postalCode)}
            helperText="Must contain only numbers."
          />
          <Autocomplete
            fullWidth
            options={countries}
            value={country}
            onChange={(event, newValue) => { // Set the country based on the selected value from the dropdown
              setCountry(newValue || ""); // If no value is selected, set the country to an empty string
            }}
            renderInput={(params) => ( // Render the dropdown input field
              <TextField {...params} label="Country" margin="normal" required />
            )}
          />
        </>
      )}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {validationError && <Alert severity="error" sx={{ mt: 2 }}>{validationError}</Alert>}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isProcessing} 
      >
        {isProcessing ? <CircularProgress size={24} /> : `Pay $${totalPrice}`} {/* Render a circular progress indicator if the payment is being processed, otherwise render the pay button */}
      </Button>
      <Button onClick={onCancel} variant="outlined" fullWidth sx={{ mt: 1 }}>
        Cancel
      </Button>
    </form>
  );
};

export default function Cart() {
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [open, setOpen] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cookieCart = Cookies.get("cart");

  useEffect(() => {
    if (cookieCart) { // Check if the cart exists in the cookies
      const parsedCart = JSON.parse(cookieCart); // Parse the cart data from the cookies
      setCartData(parsedCart);
      updateTotalPrice(parsedCart);
    }
  }, [cookieCart]); // Run the effect whenever the cart in the cookies changes

  const updateTotalPrice = (cartItems) => { // Calculate the total price of the items in the cart
    const total = cartItems.reduce( // Use the reduce method to calculate the total price
      (acc, item) => acc + item.price * item.quantity,  
      0
    );
    setTotalPrice(total);
  };

  const deleteItem = (id) => { // Remove an item from the cart based on its id
    const cookieCart = Cookies.get("cart"); // Get the cart data from the cookies
    const parsedCookieCart = cookieCart ? JSON.parse(cookieCart) : []; 

    const updateCookieCart = parsedCookieCart.filter((item) => item.id !== id); // Filter out the item with the matching id
    Cookies.set("cart", JSON.stringify(updateCookieCart)); // Update the cart data in the cookies

    dispatch(removeItem(id)); // Dispatch the removeItem action to update the Redux store

    const updatedCart = cartData.filter((item) => item.id !== id); // Filter out the item with the matching id from the cart data in the state
    setCartData(updatedCart); // Update the cart data in the state
    updateTotalPrice(updatedCart); // Update the total price of the items in the cart
    handleCloseDialog(); // Close the dialog box
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleQuantityChange = (id, newQuantity) => { // Update the quantity of an item in the cart based on its id and the new quantity value
    newQuantity = parseInt(newQuantity, 10);
    if (newQuantity >= 0) { // Check if the new quantity is a non-negative integer
      const updatedCart = cartData.map((item) => {
        if (item.id === id) { // Find the item with the matching id
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartData(updatedCart);
      updateTotalPrice(updatedCart);
      dispatch(editItem({ id, quantity: newQuantity }));
      Cookies.set("cart", JSON.stringify(updatedCart));
    }
  };

  const handlePaymentSuccess = async (orderId) => {
    setOpenPaymentDialog(false);
    setOpenSnackbar(true);
    setOrderStatus("Processing");
      // Clear cart
      setCartData([]);
      Cookies.remove("cart"); // Remove cart from cookies
      dispatch(clearCart()); // Clear cart from Redux store

      setOrderStatus("Completed"); // Update order status to "Completed"
  
  };

  const getStatusMessage = () => { // Get the status message based on the order status
    switch (orderStatus) { // Use a switch statement to handle different order statuses
      case "Processing": 
        return "Your order is being processed...";
      case "Completed": 
        return "Your order has been successfully placed! Check your email for confirmation.";
      case "Failed": 
        return "There was an issue with your order. Please contact support.";
      default:
        return "";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>
      {cartData.length === 0 ? ( // Check if the cart is empty
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="shopping cart table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Image</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartData.map((row) => ( // Map through the cart data to display each item in a table row
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        src={row.image}
                        alt={row.name}
                      />
                    </TableCell>
                    <TableCell align="right">${row.price}</TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        variant="outlined"
                        value={row.quantity}
                        onChange={(e) =>
                          handleQuantityChange(row.id, e.target.value)
                        }
                        inputProps={{ min: "0", step: "1" }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => {
                          setSelectedProduct(row); // Set the selected product for deletion
                          handleOpenDialog(); // Open the dialog box for confirmation
                        }}
                      >
                        <DeleteIcon color="error" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TotalPriceText variant="h6">
            Total Price: ${totalPrice.toFixed(2)} 
          </TotalPriceText>
          <PayButton
            variant="contained"
            onClick={() => setOpenPaymentDialog(true)}
          >
            Proceed to Payment
          </PayButton>
        </>
      )}

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this item from the cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button
            onClick={() => deleteItem(selectedProduct.id)} 
            color="error"
            autoFocus
          >
            Yes, Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)} 
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Complete Your Payment</DialogTitle>
        <DialogContent>
          <PaymentForm
            totalPrice={totalPrice}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setOpenPaymentDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} 
      >
        <Alert
          onClose={() => setOpenSnackbar(false)} 
          severity={orderStatus === "Failed" ? "error" : "success"}
          variant="filled"
        >
          {getStatusMessage()}
        </Alert>
      </Snackbar>
    </Box>
  );
}
