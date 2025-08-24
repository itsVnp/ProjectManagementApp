import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage; 