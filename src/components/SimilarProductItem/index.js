// Write your code here

import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {brand, imageUrl, price, rating, title} = similarProductDetails
  return (
    <li className="similar-list-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <p className="title">{title}</p>
      <p className="brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="price">Rs {price}/-</p>
        <p className="rating-para">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
