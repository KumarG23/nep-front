import { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import { getProducts } from './api';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider, Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, ButtonGroup, Button } from '@chakra-ui/react';
import theme from './theme';
import { url } from './api';
import RatingReview from './Rating';

export const ProductPage = () => {
    const { cart, setCart, addToCart } = useContext(CartContext)
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({});

  const handleGetProducts = async () => {
    try {
      const productData = await getProducts();
      console.log('Products: ', productData);
      setProducts(productData);
    } catch (error) {
      console.error('Error getting products: ', error);
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleAddToCart = (productId) => {
    addToCart(productId, products.name, products.price, 1);
    const updatedCart = [...cart, { id: products.id, name: products.name, price: products.price, quantity: 1}]
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  // const handleSetRating = (productId, rating) => {
  //   setRatings(prevRatings => ({
  //     ...prevRatings,
  //     [productId]: rating
  //   }));
  // };




  

  return (
    <div id='products' theme={theme}>
      {products.map((product) => (
        <Card key={product.id} maxW='sm'>
        <CardBody>
          <Image
            src={`${url}${product.image}`}
            // https://nep-back.fly.dev
            // http://127.0.0.1:8000
            alt={product.name}
            borderRadius='lg'
            width='100%'
            height='80%'
            objectFit='cover'
            onClick={() => navigate(`/product/${product.id}`)}
            style={{ cursor: 'pointer' }}
          />
          <Stack mt='6' spacing='3'>
            <Heading size='md'>{product.name}</Heading>
            <Text>
              {product.description}
            </Text>
            <Text color='blue.600' fontSize='2xl'>
              {product.price}
            </Text>
          </Stack>
        </CardBody>
        <CardFooter>
            <Button variant='ghost' colorScheme='blue' onClick={() => handleAddToCart(product.id)}>
              Add to cart
            </Button>
        </CardFooter>
        {/* <RatingReview
          productId={product.id}
          rating={ratings[product.id]} setRating={handleSetRating} /> */}
      </Card>
      ))}
    </div>
  );
};

