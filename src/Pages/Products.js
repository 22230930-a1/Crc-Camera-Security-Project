import React, { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import products from "../data/products";
import { CartContext } from "../Context/CartContext";

const categories = ["All", "Cameras", "NVRs", "Accessories"];

export default function Products() {
  const { addToCart } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const selectedCategory = searchParams.get("category") || "All";

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  function changeCategory(category) {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  function handleAddToCart(product) {
    addToCart(product);

    setMessage(`${product.name} added successfully`);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  return (
    <div className="container section">
      {message && (
        <div className="cartSuccessToast">
          <span>✓ {message}</span>
          <Link to="/cart">View Cart</Link>
        </div>
      )}

      <div className="pageHeader productsHeaderPro">
        <div>
          <span className="sectionLabel">CRC catalog</span>
          <h2 className="h2 bigTitle">Products</h2>
          <p className="muted">
            Choose cameras, NVR recorders, and accessories.
          </p>
        </div>
      </div>

      <div className="filterBar">
        {categories.map((category) => (
          <button
            key={category}
            className={
              category === selectedCategory ? "filterBtn active" : "filterBtn"
            }
            onClick={() => changeCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid">
        {filteredProducts.map((p) => (
          <div className="card productCardPro" key={p.id}>
            <Link to={`/products/${p.id}`} className="productImageLink">
              <div className="productTag">{p.category}</div>
              <img className="cardImg" src={p.image} alt={p.name} />
            </Link>

            <div className="cardBody">
              <Link
                to={`/products/${p.id}`}
                className="cardTitle productTitleLink"
              >
                {p.name}
              </Link>

              <div className="productMeta">{p.type}</div>
              <div className="muted priceText">
                ${Number(p.price).toFixed(2)}
              </div>

              <div className="cardActions">
                <Link className="btnSmall btnSmallDark" to={`/products/${p.id}`}>
                  View Details
                </Link>

                <button
                  className="btnSmall btnSmallOutline"
                  onClick={() => handleAddToCart(p)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}