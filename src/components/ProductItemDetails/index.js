// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    productDetails: {},
    similarProductsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        id: fetchedData.id,
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        rating: fetchedData.rating,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
      }
      const updatedSimilarProductsList = fetchedData.similar_products.map(
        each => ({
          brand: each.brand,
          imageUrl: each.image_url,
          price: each.price,
          title: each.title,
          id: each.id,
          rating: each.rating,
        }),
      )

      this.setState({
        productDetails: updatedData,
        similarProductsList: updatedSimilarProductsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity === 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity,
      }))
    } else {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderDetailsOfProduct = () => {
    const {productDetails, quantity, similarProductsList} = this.state
    const {
      imageUrl,
      availability,
      brand,
      description,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails
    return (
      <>
        <div className="detail-container">
          <div className="image-product-details-container">
            <img src={imageUrl} alt="product" className="product-image-style" />
            <div className="details-container">
              <h1 className="main-heading">{title}</h1>
              <p className="price-para">Rs {price}/- </p>
              <div className="review-container">
                <p className="rating-para">
                  {rating}
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-img"
                  />
                </p>
                <p className="review-para">{totalReviews} Reviews</p>
              </div>
              <p className="description">{description}</p>
              <p className="avail-para">
                Available: <p className="avail-value-para">{availability}</p>
              </p>
              <p className="avail-para">
                Brand: <p className="avail-value-para">{brand}</p>
              </p>
              <hr className="horizontal" />
              <div className="quantity-container">
                <button
                  type="button"
                  className="sign-btn"
                  data-testid="minus"
                  onClick={this.onDecrementQuantity}
                >
                  <BsDashSquare className="sign-icon" />
                </button>
                <p className="quantity-para">{quantity}</p>
                <button
                  type="button"
                  className="sign-btn"
                  data-testid="plus"
                  onClick={this.onIncrementQuantity}
                >
                  <BsPlusSquare className="sign-icon" />
                </button>
              </div>
              <button type="button" className="cart-btn">
                ADD TO CART
              </button>
            </div>
          </div>
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-products-container">
            {similarProductsList.map(each => (
              <SimilarProductItem key={each.id} similarProductDetails={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoaderView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="error-heading">Product Not Found</h1>
      <button
        className="cart-btn"
        type="button"
        onClick={this.onContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderDetailsOfProduct()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderView()}
      </>
    )
  }
}

export default ProductItemDetails
