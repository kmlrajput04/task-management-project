import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '../ui';

const loginValidationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});

export const LoginForm = ({ onSubmit, loading = false, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: { email: '', password: '' }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg font-medium">
          {error}
        </div>
      )}

      <Input
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        required
        disabled={loading}
        error={errors.email?.message}
        autoFocus
        {...register('email')}
      />

      <div className="relative">
        <Input
          label="Password"
          placeholder="Enter your password"
          type={showPassword ? 'text' : 'password'}
          required
          disabled={loading}
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-[38px] text-slate-500 hover:text-slate-350"
          aria-label="Toggle password visibility"
          disabled={loading}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        className="mt-6"
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
