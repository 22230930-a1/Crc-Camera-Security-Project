import React, { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext();

function loadCart() {
  try {
    const raw = localStorage.getItem("crc_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadCart());

  useEffect(() => {
    try {
      localStorage.setItem("crc_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === product.id);
      if (found) {
        return prev.map((x) => (x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((x) => x.id !== id));

  const updateQty = (id, qty) => {
    const safeQty = Math.max(1, Number(qty) || 1);
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: safeQty } : x)));
  };

  const incrementQty = (id) =>
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));

 const decrementQty = (id) => {
  setCart((prevCart) =>
    prevCart
      .map((item) =>
        item.id === id
          ? { ...item, qty: Number(item.qty || 1) - 1 }
          : item
      )
      .filter((item) => item.qty > 0)
  );
};

  const clearCart = () => setCart([]);

  const itemsCount = useMemo(() => cart.reduce((sum, x) => sum + (x.qty || 0), 0), [cart]);

  const total = useMemo(
    () => cart.reduce((sum, x) => sum + Number(x.price) * (x.qty || 0), 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQty,
        incrementQty,
        decrementQty,
        clearCart,
        total,
        itemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
