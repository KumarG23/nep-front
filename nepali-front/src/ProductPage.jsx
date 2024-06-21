import { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import { getProducts } from './api';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider, Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, ButtonGroup, Button, Center, Spinner } from '@chakra-ui/react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FaFacebook, FaTwitter, FaWhatsapp, FaShareAlt } from 'react-icons/fa';
import theme from './theme';
import { url } from './api';
import RatingReview from './Rating';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const ProductPage = () => {
  const { cart, setCart, addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({});
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
                fetchPriority='high'
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
                <FacebookShareButton url={`${window.location.origin}/product/${product.id}`} quote={product.description}>
                  <Button variant='ghost' colorScheme='blue'>
                    <FaFacebook /> Share
                  </Button>
                </FacebookShareButton>
                <TwitterShareButton url={`${window.location.origin}/product/${product.id}`} title={product.name}>
                  <Button variant='ghost' colorScheme='blue'>
                    <FaTwitter /> Share
                  </Button>
                </TwitterShareButton>
              </ButtonGroup>
            </CardFooter>
            {/* <RatingReview productId={product.id} rating={ratings[product.id]} setRating={handleSetRating} /> */}
          </Card>
        ))}
      </div>
    </ChakraProvider>
  );
};



