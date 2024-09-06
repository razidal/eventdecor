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

const cityList = [
  "Tel Aviv-Yafo","Jerusalem","Haifa","Rishon LeẔiyyon","Petaẖ Tiqwa","Ashdod","Netanya","Beersheba","Holon","Bené Beraq","Ramat Gan",
  "Ashqelon","Reẖovot","Bat Yam","Bet Shemesh","Kefar Sava","Modi‘in Makkabbim Re‘ut","Hadera","Herẕliyya",
  "Nazareth","Lod","Ramla","Ra‘ananna","Qiryat Gat","Rahat","Nahariyya","Afula","Givatayim","Hod HaSharon",
  "Rosh Ha‘Ayin","Qiryat Ata","Umm el Faḥm","Eilat","Nes Ẕiyyona","‘Akko","El‘ad","Ramat HaSharon","Karmiel",
  "Tiberias","Eṭ Ṭaiyiba","Ben Zakkay","Pardés H̱anna Karkur","Qiryat Moẕqin","Qiryat Ono","Shefar‘am","Qiryat Bialik",
  "Qiryat Yam","Or Yehuda","Ẕefat","Dimona","Tamra","Netivot","Sakhnīn","Be’er Ya‘aqov","Yehud","Ofaqim","Kefar Yona",
];

const countries = [
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
  const [validationError, setValidationError] = useState("");

  const handleSubmit = throttle(async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");
    setValidationError("");

    // Validation checks
    const cardNumberRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3,4}$/;
    const nameRegex = /^[A-Za-z\s]+$/;
    const postalCodeRegex = /^\d+$/;

    if (!cardNumberRegex.test(cardNumber)) {
      setValidationError("Card number must be 16 digits.");
      setIsProcessing(false);
      return;
    }

    if (!cvvRegex.test(cvv)) {
      setValidationError("CVV must be 3 or 4 digits.");
      setIsProcessing(false);
      return;
    }

    if (!nameRegex.test(name)) {
      setValidationError("Cardholder name must contain only letters.");
      setIsProcessing(false);
      return;
    }

    if (!postalCodeRegex.test(postalCode)) {
      setValidationError("Postal code must contain only numbers.");
      setIsProcessing(false);
      return;
    }

    // Process payment logic here
    try {
      const response = await axios.post("https://backstore-iqcq.onrender.com/pay/process-payment", {
        // Payment data
      });

      if (response.data.success) {
        onSuccess(response.data.orderId);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (error) {
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
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <FormControlLabel
          value="creditCard"
          control={<Radio />}
          label="Credit Card"
        />
      </RadioGroup>

      {paymentMethod === "creditCard" && (
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
            onChange={(event, newValue) => {
              setCountry(newValue || "");
            }}
            renderInput={(params) => (
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
        {isProcessing ? <CircularProgress size={24} /> : `Pay $${totalPrice}`}
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
    if (cookieCart) {
      const parsedCart = JSON.parse(cookieCart);
      setCartData(parsedCart);
      updateTotalPrice(parsedCart);
    }
  }, [cookieCart]);

  const updateTotalPrice = (cartItems) => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const deleteItem = (id) => {
    const cookieCart = Cookies.get("cart");
    const parsedCookieCart = cookieCart ? JSON.parse(cookieCart) : [];

    const updateCookieCart = parsedCookieCart.filter((item) => item.id !== id);
    Cookies.set("cart", JSON.stringify(updateCookieCart));

    dispatch(removeItem(id));

    const updatedCart = cartData.filter((item) => item.id !== id);
    setCartData(updatedCart);
    updateTotalPrice(updatedCart);
    handleCloseDialog();
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleQuantityChange = (id, newQuantity) => {
    newQuantity = parseInt(newQuantity, 10);
    if (newQuantity >= 0) {
      const updatedCart = cartData.map((item) => {
        if (item.id === id) {
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
      Cookies.remove("cart");
      dispatch(clearCart());

      setOrderStatus("Completed");
  
  };

  const getStatusMessage = () => {
    switch (orderStatus) {
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
      {cartData.length === 0 ? (
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
                {cartData.map((row) => (
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
                          setSelectedProduct(row);
                          handleOpenDialog();
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
