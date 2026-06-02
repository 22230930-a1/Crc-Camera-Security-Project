import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/products";
import { CartContext } from "../Context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <section className="productDetailsPage">
        <div className="notFoundCard">
          <h1>Product not found</h1>
          <Link to="/products" className="detailBtn detailBtnDark">
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  const lbpPrice = Number(product.price || 0) * 90000;

  return (
    <section className="productDetailsPage">
      <div className="productDetailsHero">
        <div className="productImagePanel">
          <span className="detailCategory">{product.category}</span>

          <div className="productGlow"></div>

          <img
            src={product.image}
            alt={product.name}
            className="detailsProductImage"
          />
        </div>

        <div className="productInfoPanel">
          <span className="detailBadge">CRC Camera Security</span>

          <h1>{product.name}</h1>

          <p className="detailType">{product.type}</p>

          <div className="priceBox">
            <div>
              <span>USD Price</span>
              <strong>${Number(product.price || 0).toFixed(2)}</strong>
            </div>

            <div>
              <span>LBP Estimate</span>
              <strong>{lbpPrice.toLocaleString()} LBP</strong>
            </div>
          </div>

          <p className="detailDescription">
            Professional security product suitable for homes, shops, offices,
            and businesses. Designed for reliable monitoring, clear image
            quality, and clean installation.
          </p>

          <div className="detailActions">
            <button
              className="detailBtn detailBtnDark"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

            <Link to="/quote" className="detailBtn detailBtnBlue">
              Request Installation
            </Link>
<Link to="/products" className="detailBtn detailBtnLight">
              Back
            </Link>
            
          </div>
        </div>
      </div>

      <div className="detailsCreativeGrid">
        <div className="detailBox">
          <div className="boxIcon">✦</div>
          <h2>Highlights</h2>

          <ul>
            {(product.highlights || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="detailBox specsCreativeBox">
          <div className="boxIcon">▣</div>
          <h2>Specifications</h2>

          <div className="specsList">
            {product.specs &&
              Object.entries(product.specs).map(([key, value]) => (
                <div className="specLine" key={key}>
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}