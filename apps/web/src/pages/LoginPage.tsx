import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <LoginForm redirectTo={from} />
      </div>
    </div>
  );
};

export default LoginPage; 