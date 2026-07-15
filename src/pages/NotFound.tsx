import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 p-6 dark:bg-stone-950">
      <div>
        <EmptyState title="Page not found" description="This route is not part of the cafe workspace." />
        <Link to="/"><Button className="mt-4 w-full">Back to dashboard</Button></Link>
      </div>
    </main>
  );
}
