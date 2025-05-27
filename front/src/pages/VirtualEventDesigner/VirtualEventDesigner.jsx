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
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import Stack from "@mui/material/Stack";

const ImageUploader = ({ onImageUpload }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    setError(null);

    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size <= 5 * 1024 * 1024) {
          // 5MB limit
          const reader = new FileReader(); // Create a new FileReader instance
          reader.onload = (e) => {
            setPreviewImage(e.target.result); // Set the preview image source
            onImageUpload(e.target.result); // Call the onImageUpload callback with the image data
          };
          reader.readAsDataURL(file); // Read the file as a data URL
        } else {
          setError("File size exceeds 5MB limit.");
        }
      } else {
        setError("Please upload an image file.");
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null); // Clear the preview image source
    setError(null); // Clear any error messages
    if (fileInputRef.current) {
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

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {previewImage && (
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
  const itemsPerPage = 3; // Number of items per page
  const [showIcons, setShowIcons] = useState(true);
  const [loading, setLoading] = useState(true); // Loading state
  const [bgDimensions, setBgDimensions] = useState({ width: 800, height: 600 }); // Default aspect ratio

  const backgroundTemplates = [
    {
      name: "Living Room",
      url: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2023/7/19/3/DOTY2023_Dramatic-Before-And-Afters_Hidden-Hills-11.jpg.rend.hgtvcom.1280.1280.suffix/1689786863909.jpeg",
    },
    {
      name: "Backyard",
      url: "https://www.galimganim.com/wp-content/uploads/2023/01/hazter1-5.jpg",
    },
  ];

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const currentDecorations = products.slice(
    (currentPage - 1) * itemsPerPage, // Start index of the slice
    currentPage * itemsPerPage // End index of the slice
  );

  // Helper to update background and its dimensions
  const updateBackground = (imgSrc) => {
    if (!imgSrc) return;
    const img = new window.Image();
    img.onload = () => {
      setBgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setBackground(imgSrc);
    };
    img.src = imgSrc;
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isResizing) {
        handleResizeMove(event);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        handleResizeEnd();
      }
    };

    const handleClickOutside = (event) => {
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

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isResizing, activeDecoration]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          "https://backstore-iqcq.onrender.com/products/all"
        );
        setProducts(response.data.decorations); // Set the products state with the fetched data
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false after fetching
      }
    };

    getProducts();
  }, []);

  // Update for uploaded image
  const handleBackgroundUpload = (imageData) => {
    updateBackground(imageData);
  };

  // Update for template select
  const handleTemplateSelect = (event) => {
    updateBackground(event.target.value);
  };

  const handleDecorationSelect = (decoration) => {
    setSelectedDecoration({
      ...decoration,
      width: 150,
      height: 150,
      id: Date.now(),
      image: decoration.imageUrl,
    });
  };

  const handleContainerClick = (event) => {
    if (selectedDecoration && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newDecoration = { ...selectedDecoration, x, y };
      setDecorations([...decorations, newDecoration]);
      setSelectedDecoration(null);
    }
  };

  const handleDecorationClick = (decoration, event) => {
    event.stopPropagation();
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
    let newWidth = Math.max(20, event.clientX - containerRect.left - activeDecoration.x);
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

  const handleResizeEnd = () => {
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

  // Calculate container size based on aspect ratio and a fixed width (e.g., 800px)
  const containerWidth = 800;
  const containerHeight = Math.round(
    (bgDimensions.height / bgDimensions.width) * containerWidth
  );

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
              onClick={handleContainerClick}
              sx={{
                position: "relative",
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
                overflow: "hidden",
                backgroundImage: `url(${background})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                margin: "0 auto", // center the box
                cursor: selectedDecoration ? "crosshair" : "default",
                backgroundColor: "#fff", // ensure white background
              }}
            >
              {decorations.map((decoration) => (
                 <Draggable
                 key={decoration.id}
                 defaultPosition={{ x: decoration.x, y: decoration.y }} // Set the initial position of the decoration based on its x and y coordinates
                 onStop={(e, ui) => handleDrag(e, ui, decoration.id)} // Handle drag event for the decoration
                 
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
          <Stack spacing={2}>
            <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
              <ImageUploader onImageUpload={handleBackgroundUpload} />
            </Paper>
            <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Or choose a template:
              </Typography>
              <Select
                fullWidth
                value={background}
                onChange={handleTemplateSelect}
              >
                {backgroundTemplates.map((template, index) => (
                  <MenuItem key={index} value={template.url}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Decorations
              </Typography>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                  <CircularProgress />
                </div>
              ) : (
                <Grid container spacing={1}>
                  {currentDecorations.map((product) => (
                    <Grid item key={product._id} xs={4}>
                      <img
                        src={product.imageUrl}
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
              )}
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={Math.ceil(products.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VirtualEventDesigner;
