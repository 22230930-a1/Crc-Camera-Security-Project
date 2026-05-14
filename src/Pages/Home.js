import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.jpg";
import products from "../data/products";
import cam1 from "../assets/products/cam1.jpg";

const categories = [
  {
    title: "Security Cameras",
    text: "Indoor, outdoor, full-color, and PoE cameras for homes and businesses.",
    link: "/products?category=Cameras",
    badge: "5+ models",
  },
  {
    title: "NVR Recorders",
    text: "4CH, 8CH, and 16CH recorders for reliable 24/7 camera storage.",
    link: "/products?category=NVRs",
    badge: "Smart recording",
  },
  {
    title: "Accessories",
    text: "PoE switches, brackets, power supplies, and cables for clean installation.",
    link: "/products?category=Accessories",
    badge: "Install ready",
  },
];

export default function Home() {
  return (
    <>{/* HERO */}
<section
  className="crcHero"
  style={{ backgroundImage: `url(${heroImg})` }}
>
  <div className="crcHeroContent">
  

    <h1>
      Smart CCTV <br />
      Protection <br />
      for Modern <br />
      Spaces
    </h1>

    <p>
      Professional security cameras, NVR systems, mobile viewing, and clean
      installation solutions for homes, shops, and businesses.
    </p>

    <div className="crcHeroButtons">
      <Link to="/products" className="crcHeroBtn crcHeroBtnFill">
        Explore Products
      </Link>

      <Link to="/quote" className="crcHeroBtn crcHeroBtnOutline">
  Request Installation
</Link>
    </div>
  </div>
</section>
      {/* ABOUT CRC */}
      <section className="about-crc-section">
        <div className="about-crc-card">
          <div className="about-crc-content">
            <h2>ABOUT CRC</h2>

            <p>
              CRC Camera Security provides professional security camera
              solutions for homes, shops, offices, and businesses. We offer
              cameras, NVR recorders, accessories, and installation support to
              help customers protect their places with reliable and clear
              monitoring.
            </p>
<Link to="/about-more" className="about-crc-btn">
  Read More
</Link>

   
          </div>

          <div className="about-crc-image-box">
            <img
              src={cam1}
              alt="CRC Camera Security"
              className="about-crc-image"
            />
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="container section sectionWide">
        <div className="sectionHeaderCenter">
          <span className="sectionLabel">Shop by category</span>

          <h2 className="h2 bigTitle">
            Everything your security system needs
          </h2>

          <p className="muted centerText">
            Choose cameras, NVRs, and installation accessories from one clean
            catalog.
          </p>
        </div>

        <div className="categoryGrid">
          {categories.map((cat) => (
            <Link className="categoryCard" to={cat.link} key={cat.title}>
              <div>
                <div className="categoryBadge">{cat.badge}</div>
                <h3>{cat.title}</h3>
                <p>{cat.text}</p>
              </div>

              <span className="categoryArrow">View products →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS AUTO SLIDER */}
      <section className="container section sectionWide">
        <div className="sectionHeaderSplit">
          <div>
            <span className="sectionLabel">Featured products</span>
            <h2 className="h2 bigTitle">Popular security picks</h2>
          </div>

          <Link className="viewAllLink" to="/products">
            View all products →
          </Link>
        </div>

        <ProductAutoSlider products={products} />
      </section>
    </>
  );
}

function ProductAutoSlider({ products }) {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;

    const autoSlide = setInterval(() => {
      if (!slider) return;

      const cardWidth = 340;

      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 20) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: cardWidth,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(autoSlide);
  }, []);

  return (
    <div className="homeProductsSliderWrap">
      <div className="homeProductsSlider" ref={sliderRef}>
        {products.map((product) => (
          <div className="homeProductCard" key={product.id}>
            <span className="homeProductBadge">{product.category}</span>

            <div className="homeProductImageBox">
              <img
                src={product.image}
                alt={product.name}
                className="homeProductImage"
              />
            </div>

            <div className="homeProductContent">
              <h3>{product.name}</h3>

              <p>${Number(product.price).toFixed(2)}</p>

              <Link
                to={`/products/${product.id}`}
                className="homeProductBtn"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
    
