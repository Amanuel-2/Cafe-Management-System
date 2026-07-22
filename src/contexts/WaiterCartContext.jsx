import { useMemo, useState } from 'react';
import { WaiterCartContext } from './waiterCartContextValue';

export function WaiterCartProvider({ children }) {
  const [table, setTable] = useState('table-01'); const [items, setItems] = useState([]);
  const value = useMemo(() => ({ table, items, setTable,
    addItem(item) { setItems((current) => { const existing = current.find((entry) => entry.menuItemId === item.id); return existing ? current.map((entry) => entry.menuItemId === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { menuItemId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, notes: '' }]; }); },
    incrementItem(id) { setItems((current) => current.map((item) => item.menuItemId === id ? { ...item, quantity: item.quantity + 1 } : item)); },
    decrementItem(id) { setItems((current) => current.map((item) => item.menuItemId === id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0)); },
    removeItem(id) { setItems((current) => current.filter((item) => item.menuItemId !== id)); },
    updateNotes(id, notes) { setItems((current) => current.map((item) => item.menuItemId === id ? { ...item, notes } : item)); },
    clearCart() { setItems([]); setTable('table-01'); },
  }), [items, table]);
  return <WaiterCartContext.Provider value={value}>{children}</WaiterCartContext.Provider>;
}
