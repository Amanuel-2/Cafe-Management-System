import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-stone-100 text-stone-950 dark:bg-stone-950 dark:text-stone-50 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-[url('/src/assets/hero.png')] bg-cover bg-center lg:block" />
      <section className="flex items-center justify-center p-6">
        <Outlet />
      </section>
    </main>
  );
}
