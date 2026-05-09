import React, { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext();

const CART_KEY = "crc_cart";

function loadCart() {
  try {
    // Remove old saved cart from localStorage so old products do not come back
    localStorage.removeItem(CART_KEY);

    const raw = sessionStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadCart());

  useEffect(() => {
    try {
      sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === product.id);

      if (found) {
        return prev.map((x) =>
          x.id === product.id
            ? { ...x, qty: Number(x.qty || 1) + 1 }
            : x
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  };

  const updateQty = (id, qty) => {
    const safeQty = Math.max(1, Number(qty) || 1);

    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: safeQty } : x))
    );
  };

  const incrementQty = (id) => {
    setCart((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, qty: Number(x.qty || 1) + 1 } : x
      )
    );
  };

  const decrementQty = (id) => {
    setCart((prev) =>
      prev
        .map((x) =>
          x.id === id ? { ...x, qty: Number(x.qty || 1) - 1 } : x
        )
        .filter((x) => Number(x.qty || 0) > 0)
    );
  };

  const clearCart = () => {
    setCart([]);

    try {
      sessionStorage.removeItem(CART_KEY);
      localStorage.removeItem(CART_KEY);
    } catch {}
  };

  const itemsCount = useMemo(
    () => cart.reduce((sum, x) => sum + Number(x.qty || 0), 0),
    [cart]
  );

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, x) => sum + Number(x.price || 0) * Number(x.qty || 0),
        0
      ),
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