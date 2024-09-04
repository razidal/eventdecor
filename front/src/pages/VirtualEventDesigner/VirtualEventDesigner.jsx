import React, { useState, useRef, useEffect } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import Draggable from "react-draggable";
import axios from "axios";
const ImageUploader = ({ onImageUpload }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setError(null);

    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size <= 5 * 1024 * 1024) {
          // 5MB limit
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviewImage(e.target.result);
            onImageUpload(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          setError("File size exceeds 5MB limit.");
        }
      } else {
        setError("Please upload an image file.");
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageUpload(null);
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
  const [background, setBackground] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [activeDecoration, setActiveDecoration] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        "https://backstore-iqcq.onrender.com/products/all"
      );
      setProducts(response.data.decorations);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
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

  const decorationItems = [
    {
      name: "Balloon",
      url: "https://welcomefamily.com/8640-large_default/balloons-25-cm-variegated-colors.jpg",
    },
    {
      name: "Banner",
      url: "https://png.pngtree.com/png-clipart/20231127/original/pngtree-pastel-rainbow-flag-party-banner-png-image_13722467.png",
    },
    {
      name: "Cake",
      url: "https://modernomanbakery.com/wp-content/uploads/2021/02/Modern-Oman-Bakery-Cars-Cake-1.png",
    },
  ];

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

  const handleBackgroundUpload = (imageData) => {
    setBackground(imageData);
  };

  const handleTemplateSelect = (event) => {
    setBackground(event.target.value);
  };

  const handleDecorationSelect = (decoration) => {
    setSelectedDecoration({
      ...decoration,
      width: 50,
      height: 50,
      id: Date.now(),
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
  };

  const handleResizeStart = (event, decoration) => {
    event.stopPropagation();
    setIsResizing(true);
    setActiveDecoration(decoration);
  };

  const handleResizeMove = (event) => {
    if (!isResizing || !activeDecoration || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = Math.max(
      20,
      event.clientX - containerRect.left - activeDecoration.x
    );
    const newHeight = Math.max(
      20,
      event.clientY - containerRect.top - activeDecoration.y
    );

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
    setDecorations(decorations.filter((d) => d.id !== id));
  };

  const handleDrag = (e, ui, id) => {
    const updatedDecorations = decorations.map((d) =>
      d.id === id ? { ...d, x: ui.x, y: ui.y } : d
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
              onClick={handleContainerClick}
              sx={{
                position: "relative",
                width: 745,
                height: 600,
                overflow: "hidden",
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: selectedDecoration ? "crosshair" : "default",
              }}
            >
              {decorations.map((decoration) => (
                <Draggable
                  key={decoration.id}
                  position={{ x: decoration.x, y: decoration.y }}
                  onDrag={(e, ui) => handleDrag(e, ui, decoration.id)}
                  bounds="parent"
                >
                  <div
                    style={{
                      width: decoration.width,
                      height: decoration.height,
                      position: "absolute",
                      backgroundImage: `url(${decoration.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "move",
                      border:
                        activeDecoration &&
                        activeDecoration.id === decoration.id
                          ? "2px solid blue"
                          : "none",
                    }}
                    onClick={(event) =>
                      handleDecorationClick(decoration, event)
                    }
                  >
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
                        e.stopPropagation();
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
              {backgroundTemplates.map((template, index) => (
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
              {products.map((item, index) => (
                <Grid item key={index} xs={4}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      border:
                        selectedDecoration?.name === item.name
                          ? "2px solid blue"
                          : "none",
                    }}
                    onClick={() => handleDecorationSelect(item)}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VirtualEventDesigner;
