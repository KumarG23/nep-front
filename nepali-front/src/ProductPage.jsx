import { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import { getProducts } from './api';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider, Card, CardBody, CardFooter, Image, Stack, Heading, Text, ButtonGroup, Button, Center, Spinner, IconButton } from '@chakra-ui/react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import theme from './theme';
import { url } from './api';

export const ProductPage = () => {
  const { cart, setCart, addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state

  const handleGetProducts = async () => {
    try {
      const productData = await getProducts();
      console.log('Products: ', productData);
      setProducts(productData);
      setLoading(false); // Set loading to false once products are loaded
    } catch (error) {
      console.error('Error getting products: ', error);
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(productId, product.name, product.price, 1);
      const updatedCart = [...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <div id='products'>
        {products.map((product) => (
          <Card key={product.id} maxW='sm'>
            <CardBody>
              <Image
                loading='lazy'
                decoding='async'
                src={`${url}${product.image}`}
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
                <Text>{product.description}</Text>
                <Text color='blue.600' fontSize='2xl'>
                  {product.price}
                </Text>
              </Stack>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button variant='ghost' colorScheme='blue' onClick={() => handleAddToCart(product.id)}>
                  Add to cart
                </Button>
                <FacebookShareButton url={`${window.location.origin}/product/${product.id}`} quote="Check out this product!">
                  <div>
                    <IconButton icon={<FaFacebook />} variant='ghost' colorScheme='blue' aria-label='Share on Facebook' as='div' />
                  </div>
                </FacebookShareButton>
                <TwitterShareButton url={`${window.location.origin}/product/${product.id}`} title={product.name}>
                  <div>
                    <IconButton icon={<FaTwitter />} variant='ghost' colorScheme='blue' aria-label='Share on Twitter' as='div' />
                  </div>
                </TwitterShareButton>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ChakraProvider>
  );
};






