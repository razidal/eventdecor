import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import AddSingleProjact from "./add/AddSingleProjact";
import axios from "axios";
import Grid from "@mui/material/Grid";
import ProductsCard from "../../../components/card/products/ProductsCard";

const Management = () => {
  const [open, setOpen] = React.useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchProducts = async () => { // Fetch all products from the server
    try {
      const response = await axios.get("https://backstore-iqcq.onrender.com/products/all", {
        timeout: 5000,
      });
      setAllProducts(response?.data.decorations); // Set the fetched products in the state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { // Fetch products when the component mounts
    fetchProducts();
  }, []);

  return (
    <div>
      <Container>
        <h1>Products</h1>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleClickOpen}> 
            Add
          </Button>
        </Stack>
        <Container sx={{ marginTop: 2 }}>
          <Grid container spacing={3}>
            {allProducts?.map((product) => ( // Map through the fetched products and render a card for each one
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <ProductsCard product={product} fetchProducts={fetchProducts} />
              </Grid>
            ))}
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose} // Handle the dialog close event
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <AddSingleProjact setOpen={setOpen} />
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
        </Container>
      </Container>
    </div>
  );
};

export default Management;
