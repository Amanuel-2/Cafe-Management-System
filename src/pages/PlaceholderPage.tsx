import { EmptyState } from '../components/ui/EmptyState';

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <EmptyState title={title} description={description} />;
}
