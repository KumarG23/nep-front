import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { url, getProductById, getReviewsByProductId, submitReview } from './api';
import { Card, Stack, Heading, Text, CardBody, Textarea, Button } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import RatingReview from './Rating';
import { AuthContext } from './AuthContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const { accessToken } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error getting product:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsData = await getReviewsByProductId(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error getting reviews:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleSetRating = (productId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [productId]: rating,
    }));
    console.log(`Rating set for product ${productId}: ${rating}`);
  };

  const handleSubmitReview = async () => {
    if (!accessToken) {
      setError('You need to login to submit a review');
      console.log('User not logged in');
      return;
    }
    try {
      const reviewData = {
        product_id: id,
        rating: ratings[id] || 0,
        comment,
      };
      await submitReview(reviewData, accessToken);
      setComment('');
      setRatings((prevRatings) => ({
        ...prevRatings,
        [id]: 0,
      }));
      console.log('Review submitted', reviewData);
      const reviewsData = await getReviewsByProductId(id);
      setReviews(reviewsData);
      setError(null);
    } catch (error) {
      console.error('Error creating review:', error);
      setError('Failed to submit review');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Card maxW="lg">
      <CardBody>
        <Carousel>
          <div>
            <img src={`${url}${product.image}`} alt={`Main Product Image`} />
          </div>
          {product.images.map((img, index) => (
            <div key={index}>
              <img src={`${url}${img.image}`} alt={`Product Image ${index}`} />
            </div>
          ))}
        </Carousel>
        <Stack mt="6" spacing="3">
          <Heading size="md">{product.name}</Heading>
          <Text>{product.description}</Text>
          <Text color="blue.600" fontSize="2xl">{product.price}</Text>
        </Stack>
        <RatingReview
          productId={product.id}
          rating={ratings[product.id] || 0}
          setRating={handleSetRating}
        />
        <Textarea
          placeholder="Leave a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          mt="4"
        />
        <Button onClick={handleSubmitReview} mt="4">Submit Review</Button>
        {error && <Text color="red.500">{error}</Text>}
        <Stack mt="6" spacing="3">
          <Heading size="md">Reviews</Heading>
          {reviews.map((review) => (
            <div key={review.id}>
              <Text><strong>{review.user.username}</strong></Text>
              <Text>Rating: {review.rating}</Text>
              <Text>{review.comment}</Text>
            </div>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ProductDetails;









