import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "./api";
import { Box, Button, Input, Textarea, Select, FormLabel, FormControl, HStack } from '@chakra-ui/react';

export const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  // Fetch products and categories from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(`${url}/products/`);
        setProducts(productsResponse.data);

        const categoriesResponse = await axios.get(`${url}/categories/`);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setProductForm({
      ...productForm,
      image: e.target.files[0],
    });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category.id,
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    formData.append("category", productForm.category);
    if (productForm.image) {
      formData.append("image", productForm.image);
    }

    try {
      if (selectedProduct) {
        // Update existing product
        await axios.put(`${url}/products/${selectedProduct}/update/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Update the products state to reflect the changes
        setProducts(products.map(p => (p.id === selectedProduct ? { ...p, ...productForm } : p)));
      } else {
        // Create new product
        const response = await axios.post(`${url}/products/add/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProducts([...products, response.data]);
      }

      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleCancel = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
    });
    setSelectedProduct(null);
  };

  return (
    <Box m={4}>
      <h1>Admin Page</h1>

      <Box>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
              <Button ml={4} onClick={() => handleSelectProduct(product)}>Edit</Button>
            </li>
          ))}
        </ul>
      </Box>

      <h3>{selectedProduct ? "Edit Product" : "Add a Product"}</h3>
      <form onSubmit={handleSubmit}>
        <FormControl mb="4">
          <FormLabel>Name:</FormLabel>
          <Input
            type="text"
            name="name"
            value={productForm.name}
            onChange={handleChange}
            border="1px solid black"
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Description:</FormLabel>
          <Textarea
            name="description"
            value={productForm.description}
            onChange={handleChange}
            border="1px solid black"
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Price:</FormLabel>
          <Input
            type="number"
            step="0.01"
            name="price"
            value={productForm.price}
            onChange={handleChange}
            border="1px solid black"
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Category:</FormLabel>
          <Select
            name="category"
            value={productForm.category}
            onChange={handleChange}
            border="1px solid black"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Image:</FormLabel>
          <Input type="file" name="image" onChange={handleImageChange} border="1px solid black" />
        </FormControl>
        <HStack spacing="4">
          <Button type="submit">
            {selectedProduct ? "Update Product" : "Add Product"}
          </Button>
          {selectedProduct && (
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </HStack>
      </form>
    </Box>
  );
};


// name = models.CharField(max_length=100)
// description = models.TextField()
// price = models.DecimalField(max_digits=10, decimal_places=2)
// category = models.ForeignKey(Category, on_delete=models.CASCADE)
// created_at = models.DateTimeField(auto_now=True)
// image = models.ImageField(upload_to='product_images/')
