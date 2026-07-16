import { Plus, ShoppingCart } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useMenuStore } from '../../store/menuStore';
import { useOrderStore } from '../../store/orderStore';
import { useWaiterCartStore } from '../../store/waiterCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function AnimatedAddButton({ onClick, item }: { onClick: () => void; item: any }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flyingItems, setFlyingItems] = useState<{ id: number; image: string; start: { x: number; y: number } }[]>([]);

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setFlyingItems((prev) => [...prev, { id: Date.now(), image: item.image, start: { x: rect.left + rect.width / 2, y: rect.top } }]);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 150);
      onClick();
    }
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Button
          ref={buttonRef}
          className="mt-4 w-full transition-colors"
          size="lg"
          Icon={Plus}
          onClick={handleClick}
          style={{
            backgroundColor: isAnimating ? '#22c55e' : '',
          }}
        >
          Add
        </Button>
      </motion.div>

      <AnimatePresence>
        {flyingItems.map((flyingItem) => (
          <FlyingImage
            key={flyingItem.id}
            image={flyingItem.image}
            start={flyingItem.start}
            onComplete={() => setFlyingItems((prev) => prev.filter(i => i.id !== flyingItem.id))}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -40, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl font-bold text-green-600 pointer-events-none"
          >
            +1
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FlyingImage({ image, start, onComplete }: { image: string; start: { x: number; y: number }; onComplete: () => void }) {
  return (
    <motion.div
      initial={{ x: start.x, y: start.y, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        x: '50vw',
        y: window.innerHeight - 80,
        opacity: 0,
        scale: 0.3,
        rotate: 360,
      }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 150, damping: 15 }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-50"
      style={{ left: 0, top: 0, marginLeft: -25, marginTop: -25 }}
    >
      <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover shadow-lg" />
    </motion.div>
  );
}

function FloatingOrderSummary() {
  const cart = useWaiterCartStore();
  const navigate = useNavigate();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 p-4 z-40 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 p-2 rounded-lg">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <motion.span
                key={totalItems}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="font-bold text-lg"
              >
                {totalItems}
              </motion.span>
              <span className="text-stone-600 dark:text-stone-400">Items</span>
            </div>
            <div className="text-sm text-stone-500">
              Total: <motion.span
                key={totalPrice}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="font-semibold text-stone-900 dark:text-white"
              >
                ${totalPrice.toFixed(2)}
              </motion.span>
            </div>
          </div>
        </div>
        <Button size="lg" className="bg-stone-900 hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100" onClick={() => navigate('/waiter/checkout')}>
          View Order →
        </Button>
      </div>
    </motion.div>
  );
}

export function WaiterDashboard() {
  const { categories, menuItems } = useMenuStore();
  const orders = useOrderStore((state) => state.orders);
  const { addItem } = useWaiterCartStore();
  const cartItems = useWaiterCartStore((state) => state.items);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px] pb-24">
      <section className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => <button key={category.id} className={`min-h-14 rounded-lg px-5 text-base font-semibold ${category.color}`}>{category.name}</button>)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><h2 className="text-lg font-semibold">{item.name}</h2><p className="text-sm text-stone-500">{item.prepTimeMinutes} min</p></div>
                  <Badge>${item.price.toFixed(2)}</Badge>
                </div>
                <AnimatedAddButton onClick={() => addItem(item)} item={item} />
              </div>
            </Card>
          ))}
        </div>
      </section>
      <aside className="space-y-3">
        <h2 className="text-lg font-semibold">Active Tables</h2>
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-center justify-between">
              <div><p className="font-semibold">{order.table}</p><p className="text-sm text-stone-500">{order.items.length} items</p></div>
              <Badge variant={order.status === 'ready' ? 'success' : 'warning'}>{order.status}</Badge>
            </div>
          </Card>
        ))}
      </aside>
      <AnimatePresence>
        {cartItems.length > 0 && <FloatingOrderSummary />}
      </AnimatePresence>
    </div>
  );
}
