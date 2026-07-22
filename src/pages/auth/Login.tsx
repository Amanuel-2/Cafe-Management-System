import { Banknote, ChefHat, Coffee, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { roleHomePath } from '../../routes/access';

const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<LoginForm>({
    defaultValues: { email: 'admin@restaurant.com', password: '123456' },
  });

  if (user) return <Navigate to={roleHomePath[user.role]} replace />;

  async function onSubmit(values: LoginForm) {
    setFormError('');
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === 'email' || field === 'password') {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    try {
      const nextUser = await login(parsed.data);
      navigate(roleHomePath[nextUser.role], { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to sign in');
    }
  }

  const useDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="block space-y-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-stone-950 text-white dark:bg-white dark:text-stone-950">
          <Coffee className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-2xl">Sign in to Cafe Manager</CardTitle>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Sign in with an active restaurant staff account.</p>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
          {formError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{formError}</p> : null}
          <Button className="w-full" type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="h-4 w-4" /> : null}
            Sign in
          </Button>
        </form>
        <div className="mt-5 grid gap-2 text-sm">
          <Button variant="outline" Icon={ShieldCheck} onClick={() => useDemo('admin@restaurant.com', '123456')}>Admin account</Button>
          <Button variant="outline" Icon={Banknote} onClick={() => useDemo('cashier@restaurant.com', '123456')}>Cashier account</Button>
          <Button variant="outline" Icon={UtensilsCrossed} onClick={() => useDemo('waiter@restaurant.com', '123456')}>Waiter account</Button>
          <Button variant="outline" Icon={ChefHat} onClick={() => useDemo('chef@restaurant.com', '123456')}>Chef account</Button>
        </div>
      </CardContent>
    </Card>
  );
}
