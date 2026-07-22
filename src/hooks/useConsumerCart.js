import { useContext } from 'react';
import { ConsumerCartContext } from '../contexts/consumerCartContextValue';

export function useConsumerCart() {
  const context = useContext(ConsumerCartContext);
  if (!context) throw new Error('useConsumerCart must be used inside ConsumerCartProvider.');
  return context;
}
