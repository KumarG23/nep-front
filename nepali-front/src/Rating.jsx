import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { submitReview } from './api';

function RatingReview({ productId, rating, setRating }) {
  const { accessToken, user } = useContext(AuthContext);

  const handleRatingClick = async (star) => {
    setRating(productId, star);
    console.log(`Clicked star: ${star} for product ${productId}`);
    if (user) {
      const reviewData = {
        product_id: productId,
        rating: star,
        comment: '', 
      };
      try {
        await submitReview(reviewData, accessToken);
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
            fontSize: '35px',
          }}
          onClick={() => handleRatingClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingReview;





