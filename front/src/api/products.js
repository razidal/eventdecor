import axios from "axios";

export const PRODUCTS_API_URL = "https://backstore-iqcq.onrender.com";
export const PRODUCT_REQUEST_TIMEOUT_MS = 45000;

const productApi = axios.create({
  baseURL: PRODUCTS_API_URL,
  timeout: PRODUCT_REQUEST_TIMEOUT_MS,
});

export const fetchProducts = async () => {
  const response = await productApi.get("/products/all");
  const decorations = response.data?.decorations;

  if (!Array.isArray(decorations)) {
    throw new Error("The products response was invalid.");
  }

  return decorations;
};

export const fetchProductFilters = async () => {
  const [categoriesResponse, themesResponse, occasionsResponse] =
    await Promise.all([
      productApi.get("/products/categories"),
      productApi.get("/products/themes"),
      productApi.get("/products/occasions"),
    ]);

  const filters = [
    categoriesResponse.data,
    themesResponse.data,
    occasionsResponse.data,
  ];

  if (filters.some((filter) => !Array.isArray(filter))) {
    throw new Error("The product filters response was invalid.");
  }

  return {
    categories: categoriesResponse.data,
    themes: themesResponse.data,
    occasions: occasionsResponse.data,
  };
};
