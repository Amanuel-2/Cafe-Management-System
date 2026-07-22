import { useCallback, useEffect, useMemo, useState } from 'react';
import { orderService } from '../services/orderService';
import { database } from '../services/database';
import { OrderContext } from './orderContextValue';

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => orderService.list());
  const refresh = useCallback(() => setOrders(orderService.list()), []);
  useEffect(() => { const changed = (event) => { if (String(event.detail?.collection ?? '').includes('orders')) refresh(); }; window.addEventListener(database.changeEvent, changed); return () => window.removeEventListener(database.changeEvent, changed); }, [refresh]);
  const value = useMemo(() => ({
    orders, refresh,
    addOrder(values, actor) { return orderService.create(values, actor); },
    updateOrderStatus(id, status, actor) { return orderService.transition(id, status, actor); },
    updateItemStatus(id, itemId, status, actor) { return orderService.updateItemStatus(id, itemId, status, actor); },
    acceptOrder(id, actor) { return orderService.transition(id, 'preparing', actor); },
    markOrderReady(id, actor) { return orderService.transition(id, 'ready', actor); },
    markOrderServed(id, actor) { return orderService.transition(id, 'served', actor); },
    requestBill(id, actor) { return orderService.requestBill(id, actor); },
    cancelOrder(id, actor) { return orderService.transition(id, 'cancelled', actor); },
  }), [orders, refresh]);
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
