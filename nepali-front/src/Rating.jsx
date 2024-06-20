import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { submitReview } from './api';
import { Textarea } from '@chakra-ui/react';

function RatingReview({ productId, rating, setRating }) {
  const { accessToken, user } = useContext(AuthContext);
  const [comment, setComment] = useState('');

  const handleRatingClick = async (star) => {
    setRating(productId, star);
    console.log(`Clicked star: ${star}`);

    if (user) {
      const reviewData = {
        product_id: productId,
        rating: star,
        comment: comment,
      };

      try {
        await submitReview(reviewData, accessToken);
        console.log('Review submitted:', reviewData);
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className='star'
          style={{
            cursor: 'pointer',
            color: rating >= star ? 'gold' : 'gray',
            fontSize: `35px`,
          }}
          onClick={() => handleRatingClick(star)}
        >
          ★
        </span>
      ))}
      <Textarea 
        placeholder="Leave a comment" 
        value={comment} 
        onChange={(e) => setComment(e.target.value)} 
        mt="4"
      />
    </div>
  );
}

export default RatingReview;






