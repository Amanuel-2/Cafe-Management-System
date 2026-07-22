import { database } from './database.js';

const now = () => new Date().toISOString();
const normalizePhone = (value) => String(value ?? '').replace(/\D/g, '');

function validate(values) {
  if (values.name?.trim().length < 2) throw new Error('Enter your full name.');
  if (normalizePhone(values.phone).length < 9) throw new Error('Enter a valid phone number.');
  if (!values.items?.length) throw new Error('Your cart is empty.');
}

export const consumerOrderService = {
  create(values) {
    validate(values);
    return database.transaction((state) => {
      const timestamp = now();
      const phone = values.phone.trim();
      const preparedItems = values.items.map((line) => {
        const menuItem = state.menuItems.find((item) => item.id === line.menuItemId && item.available);
        if (!menuItem) throw new Error(`${line.name} is no longer available.`);
        const quantity = Number(line.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Item quantities must be positive whole numbers.');
        return { id: database.createId('order-item'), menuItemId: menuItem.id, name: menuItem.name, image: menuItem.image, price: menuItem.price, quantity, notes: line.notes?.trim() ?? '', status: 'pending' };
      });
      let customer = state.customers.find((entry) => normalizePhone(entry.phone) === normalizePhone(phone));
      if (!customer) {
        customer = { id: database.createId('customer'), name: values.name.trim(), phone, email: values.email?.trim().toLowerCase() ?? '', status: 'active', createdAt: timestamp, updatedAt: timestamp };
        state.customers.push(customer);
      }
      const subtotal = preparedItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const tax = subtotal * (Number(state.settings?.taxRate ?? 0) / 100);
      const sequence = state.orders.length + 1001;
      const order = {
        id: database.createId('order'), receiptNumber: `WEB-${new Date().getFullYear()}-${sequence}`,
        trackingCode: database.createId('track').split('-').at(-1).slice(0, 8).toUpperCase(),
        table: values.fulfillment === 'dine-in' ? 'Dine-in request' : 'Pickup', tableId: null,
        fulfillment: values.fulfillment, customerId: customer.id, customerName: customer.name, customerPhone: phone,
        waiterName: 'Online order', status: 'pending', paymentStatus: 'unpaid', items: preparedItems,
        subtotal, tax, discount: 0, total: subtotal + tax, billRequested: false,
        customerNotes: values.notes?.trim() ?? '', createdAt: timestamp, updatedAt: timestamp,
        timeline: [{ id: database.createId('timeline'), title: 'Online order placed', timestamp, completed: true }],
      };
      state.orders.push(order);
      state.notifications.push({ id: database.createId('notification'), title: 'New online order', description: `${order.receiptNumber} from ${customer.name} is waiting for the kitchen.`, type: 'order', audience: 'chef', read: false, createdAt: timestamp, updatedAt: timestamp });
      state.auditLogs.push({ id: database.createId('audit'), action: 'consumer.order_create', actorId: customer.id, actorName: customer.name, entityType: 'order', entityId: order.id, message: `${customer.name} placed ${order.receiptNumber} through the public menu`, createdAt: timestamp, updatedAt: timestamp });
      return order;
    }, 'orders,customers,notifications,auditLogs');
  },
  track(reference, phone) {
    const normalizedReference = reference.trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedReference || normalizedPhone.length < 4) return null;
    const order = database.list('orders').find((entry) => [entry.receiptNumber, entry.trackingCode].some((value) => value?.toLowerCase() === normalizedReference) && normalizePhone(entry.customerPhone) === normalizedPhone);
    if (!order) return null;
    return { receiptNumber: order.receiptNumber, trackingCode: order.trackingCode, status: order.status, paymentStatus: order.paymentStatus, fulfillment: order.fulfillment, total: order.total, items: order.items.map(({ name, quantity, status }) => ({ name, quantity, status })), timeline: order.timeline, createdAt: order.createdAt };
  },
};
