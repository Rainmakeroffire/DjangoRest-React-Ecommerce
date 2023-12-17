import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

function Product({ product }) {

  return (
    <Card className="my-3 p-3 rounded product-card">
      <Link to={`/product/${product.id}`}>
        <Card.Img src={product.image} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title as="div">
          <strong>{product.name.length > 37 ? `${product.name.slice(0, 37)}...` : product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.num_reviews} review${product.num_reviews !== 1 ? 's' : ''}`}
              color={"#f8e825"}
            />
          </div>
        </Card.Text>

        <Card.Text as="h3" className="card-prices-display">
          ${product.discounted_price < product.price ? product.discounted_price.toFixed(2) : product.price.toFixed(2)}
        </Card.Text>
        {product.discounted_price < product.price ? (
          <p className="card-prices-display" id="old-price">${product.price.toFixed(2)}</p>
        ) : null}
      </Card.Body>
    </Card>
  );
}

export default Product;
