import { useCallback, useMemo, useState } from 'react';
import { ConsumerCartContext } from './consumerCartContextValue';

const STORAGE_KEY = 'restaurant-consumer-cart';
function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((item) => item.menuItemId && Number(item.quantity) > 0) : [];
  } catch {
    return [];
  }
}

export function ConsumerCartProvider({ children }) {
  const [items, setItemsState] = useState(readCart);
  const setItems = useCallback((updater) => setItemsState((current) => {
    const next = typeof updater === 'function' ? updater(current) : updater;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }), []);
  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    addItem(item) { setItems((current) => { const existing = current.find((entry) => entry.menuItemId === item.id); return existing ? current.map((entry) => entry.menuItemId === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { menuItemId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, notes: '' }]; }); },
    updateQuantity(id, quantity) { setItems((current) => current.map((item) => item.menuItemId === id ? { ...item, quantity } : item).filter((item) => item.quantity > 0)); },
    updateNotes(id, notes) { setItems((current) => current.map((item) => item.menuItemId === id ? { ...item, notes } : item)); },
    removeItem(id) { setItems((current) => current.filter((item) => item.menuItemId !== id)); },
    clearCart() { setItems([]); },
  }), [items, setItems]);
  return <ConsumerCartContext.Provider value={value}>{children}</ConsumerCartContext.Provider>;
}
