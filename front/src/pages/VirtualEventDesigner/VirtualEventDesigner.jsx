import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  Input,
  IconButton,
  Alert,
  Pagination,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import Draggable from "react-draggable";

const ImageUploader = ({ onImageUpload }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => { // Handle image upload logic here
    const file = event.target.files[0]; // Get the selected file
    setError(null);

    if (file) { // Check if a file is selected
      if (file.type.startsWith("image/")) { // Check if the file is an image
        if (file.size <= 5 * 1024 * 1024) { // Check if the file size is within the limit (5MB)
          // 5MB limit
          const reader = new FileReader(); // Create a new FileReader instance
          reader.onload = (e) => { // Set up the onload event handler
            setPreviewImage(e.target.result); // Set the preview image source
            onImageUpload(e.target.result); // Call the onImageUpload callback with the image data
          };
          reader.readAsDataURL(file); // Read the file as a data URL
        } else { // If the file size exceeds the limit, show an error message
          setError("File size exceeds 5MB limit.");
        }
      } else { // If the file is not an image, show an error message
        setError("Please upload an image file.");
      }
    }
  };

  const handleRemoveImage = () => { // Handle image removal logic here
    setPreviewImage(null); // Clear the preview image source
    setError(null); // Clear any error messages
    if (fileInputRef.current) { // Clear the file input value
      fileInputRef.current.value = "";
    }
    onImageUpload(null); // Call the onImageUpload callback with null to indicate that the image has been removed 
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload Background Image
      </Typography>

      <Input
        type="file"
        inputRef={fileInputRef}
        onChange={handleImageUpload}
        sx={{ display: "none" }}
        id="contained-button-file"
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Choose Image
        </Button>
      </label>

      {error && ( // Display error message if there is one
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {previewImage && ( // Display preview image if there is one
        <Box sx={{ mt: 2, position: "relative" }}>
          <img
            src={previewImage}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: "absolute",
              top: 5,
              right: 5,

              bgcolor: "rgba(255,255,255,0.7)",
              zIndex: 10000000, // Make sure the icon is on top of any other layers
            }}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

const VirtualEventDesigner = () => {
  const [products, setProducts] = useState([]);
  const [background, setBackground] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [activeDecoration, setActiveDecoration] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const itemsPerPage = 6; // Number of items per page
  const [showIcons, setShowIcons] = useState(true);

  const backgroundTemplates = [ // Array of background templates
    {
      name: "Living Room",
      url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2023/7/19/3/DOTY2023_Dramatic-Before-And-Afters_Hidden-Hills-11.jpg.rend.hgtvcom.1280.1280.suffix/1689786863909.jpeg",
    },
    {
      name: "Backyard",
      url: "https://www.galimganim.com/wp-content/uploads/2023/01/hazter1-5.jpg",
    },
  ];

  const handlePageChange = (event, newPage) => { // Handle page change logic here
    setCurrentPage(newPage);
  };

  const currentDecorations = products.slice( // Slice the products array to get the current page's items
    (currentPage - 1) * itemsPerPage, // Start index of the slice
    currentPage * itemsPerPage // End index of the slice
  );

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isResizing) { // Handle resizing logic here
        handleResizeMove(event);
      }
    };

    const handleMouseUp = () => { // Handle mouse up logic here
      if (isResizing) {
        handleResizeEnd();
      }
    };

    const handleTouchMove = (event) => {
      if (isResizing && event.touches.length === 1) {
        handleResizeMove(event.touches[0]); // Use touch event for resizing
      }
    };
  
    const handleTouchEnd = () => {
      if (isResizing) {
        handleResizeEnd();
      }
    };
    const handleClickOutside = (event) => { // Handle click outside logic here
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        activeDecoration
      ) {
        setActiveDecoration(null);
        setShowIcons(false); // Hide icons when clicking outside
      }
    };
  
    document.addEventListener("mousemove", handleMouseMove); 
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchmove", handleTouchMove); 
    document.addEventListener("touchend", handleTouchEnd); 

    return () => { // Clean up event listeners when the component unmounts
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchmove", handleTouchMove); 
    document.removeEventListener("touchend", handleTouchEnd); 
    };
  }, [isResizing, activeDecoration]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get( // Fetch products from the API
          "https://backstore-iqcq.onrender.com/products/all"
        );
        setProducts(response.data.decorations); // Set the products state with the fetched data
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  const handleBackgroundUpload = (imageData) => {
    setBackground(imageData);
  };

  const handleTemplateSelect = (event) => {
    setBackground(event.target.value);
  };

  const handleDecorationSelect = (decoration) => {
    setSelectedDecoration({ // Set the selected decoration state with the clicked decoration object
      ...decoration,
      width: 150,
      height: 150,
      id: Date.now(),
      image: decoration.imageUrl,
    });
  };

  const handleContainerClick = (event) => { // Handle container click logic here
    if (selectedDecoration && containerRef.current) { // If there is a selected decoration and the container ref is available
      const rect = containerRef.current.getBoundingClientRect(); // Get the container's bounding rectangle
      const x = event.clientX - rect.left; // Calculate the x-coordinate of the new decoration relative to the container
      const y = event.clientY - rect.top;  // Calculate the y-coordinate of the new decoration relative to the container
      const newDecoration = { ...selectedDecoration, x, y }; // Create a new decoration object with the calculated coordinates
      setDecorations([...decorations, newDecoration]);  // Add the new decoration to the decorations state array
      setSelectedDecoration(null); // Reset the selected decoration state to null
    }
  };

  const handleDecorationClick = (decoration, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up to the container
    setActiveDecoration(decoration);
    setShowIcons(true); // Show icons when a decoration is clicked
  };

  const handleResizeStart = (event, decoration) => {
    event.stopPropagation(); 
    setIsResizing(true);
    setActiveDecoration(decoration);
  };

  const handleResizeMove = (event) => {
    if (!isResizing || !activeDecoration || !containerRef.current) return;
  
    const containerRect = containerRef.current.getBoundingClientRect();
  
    // Calculate the current aspect ratio of the image
    const aspectRatio = activeDecoration.width / activeDecoration.height;
  
    // Get the new width and height based on mouse position, but constrain to the container bounds
    let newWidth = Math.max(5, event.clientX - containerRect.left - activeDecoration.x);
    let newHeight = newWidth / aspectRatio; // Set the height based on the aspect ratio
  
    // Ensure the resized image stays within container bounds
    if (activeDecoration.x + newWidth > containerRect.width) {
      newWidth = containerRect.width - activeDecoration.x;
      newHeight = newWidth / aspectRatio; // Adjust height based on aspect ratio
    }
    if (activeDecoration.y + newHeight > containerRect.height) {
      newHeight = containerRect.height - activeDecoration.y;
      newWidth = newHeight * aspectRatio; // Adjust width based on aspect ratio
    }
  
    // Update the decorations state with the new width and height while maintaining the position
    setDecorations(
      decorations.map((d) =>
        d.id === activeDecoration.id
          ? { ...d, width: newWidth, height: newHeight }
          : d
      )
    );
  };
  

  const handleResizeEnd = () => { // Handle resize end logic here
    setIsResizing(false);
  };

  const handleDeleteDecoration = (id) => {
    setDecorations(decorations.filter((d) => d.id !== id)); // Filter out the decoration with the given id from the decorations state array
  };

  const handleDrag = (e, ui, id) => {
    const updatedDecorations = decorations.map((d) =>
      d.id === id ? { ...d, x: ui.x, y: ui.y } : d   // Update the x and y coordinates of the decoration with the given id based on the drag event
    );
    setDecorations(updatedDecorations);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "primary.main",
          mb: 4,
        }}
      >
        Virtual Event Designer
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box
              ref={containerRef}
              onClick={handleContainerClick} // Handle container click event
              sx={{
                position: "relative",
                width: "100%",
                height: "calc(100vh - 100px)",
                overflow: "hidden",
                backgroundImage: `url(${background})`, // Set the background image based on the selected template or uploaded image
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: selectedDecoration ? "crosshair" : "default", // Change the cursor based on the selected decoration
              }}
            >
              {decorations.map((decoration) => (
                 <Draggable
                 key={decoration.id}
                 position={{ x: decoration.x, y: decoration.y }} // Set the initial position of the decoration based on its x and y coordinates
                 onDrag={(e, ui) => handleDrag(e, ui, decoration.id)} // Handle drag event for the decoration
                 bounds="parent"
               >
                 <div
                   style={{
                     width: decoration.width,
                     height: decoration.height,
                     position: "absolute",
                     backgroundImage: `url(${decoration.image})`,
                     backgroundSize: "contain",
                     backgroundPosition: "center center",
                     backgroundRepeat: "no-repeat",
                     cursor: "move",
                     border:
                       activeDecoration && // Add a border if the decoration is active
                       activeDecoration.id === decoration.id
                         ? "2px solid blue"
                         : "none",
                     overflow: "hidden", // Hide overflow for decorations to prevent clipping of their images
                   }}
                   onClick={(event) =>
                     handleDecorationClick(decoration, event)
                   }
                 >
                   {showIcons && activeDecoration && activeDecoration.id === decoration.id && (
                     <>
                       <IconButton
                         size="small"
                         style={{
                           position: "absolute",
                           top: 0,
                           right: 0,
                           backgroundColor: "rgba(255, 255, 255, 0.7)",
                           zIndex: 1000,
                         }}
                         onClick={(e) => {
                           e.stopPropagation(); // Prevent the event from bubbling up to the decoration
                           handleDeleteDecoration(decoration.id);
                         }}
                       >
                         <DeleteIcon fontSize="small" />
                       </IconButton>
                       <div
                         style={{
                           position: "absolute",
                           right: 0,
                           bottom: 0,
                           width: 20,
                           height: 20,
                           backgroundColor: "rgba(0, 0, 255, 0.5)",
                           cursor: "se-resize",
                           display: "flex",
                           justifyContent: "center",
                           alignItems: "center",
                           transition: "background-color 0.3s",
                         }}
                         onMouseDown={(event) =>
                           handleResizeStart(event, decoration)
                         }
                         onMouseEnter={(e) =>
                           (e.target.style.backgroundColor =
                             "rgba(0, 0, 255, 0.8)")
                         }
                         onMouseLeave={(e) =>
                           (e.target.style.backgroundColor =
                             "rgba(0, 0, 255, 0.5)")
                         }
                       >
                         <ZoomOutMapIcon
                           style={{ fontSize: 16, color: "white" }}
                         />
                       </div>
                     </>
                   )}
                 </div>
               </Draggable>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <ImageUploader onImageUpload={handleBackgroundUpload} />

          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Or choose a template:
            </Typography>
            <Select
              fullWidth
              value={background}
              onChange={handleTemplateSelect}
            >
              {backgroundTemplates.map((template, index) => ( // Map through the background templates and create a menu item for each one
                <MenuItem key={index} value={template.url}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </Paper>

          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Decorations
            </Typography>
            <Grid container spacing={1}>
              {currentDecorations.map((product) => ( // Map through the current decorations and create a grid item for each one
                <Grid item key={product._id} xs={4}>
                  <img
                    src={product.imageUrl} // Set the source of the image based on the decoration's image URL
                    alt={product.name}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      border:
                      selectedDecoration &&
                      selectedDecoration._id === product._id
                          ? "2px solid blue"
                          : "none",
                    }}
                    onClick={() => handleDecorationSelect(product)}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(products.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange} // Handle page change event for the decorations pagination
                color="primary"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VirtualEventDesigner;
