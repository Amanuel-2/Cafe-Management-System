import { useContext } from 'react';
import { WaiterCartContext } from '../contexts/waiterCartContextValue';
export function useWaiterCart() { const context = useContext(WaiterCartContext); if (!context) throw new Error('useWaiterCart must be used inside WaiterCartProvider.'); return context; }
