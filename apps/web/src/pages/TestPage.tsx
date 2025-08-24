import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import api from '../services/api';

const TestPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useQuery(
    'test-tasks',
    () => api.get('/api/tasks').then(res => res.data),
    {
      enabled: isAuthenticated,
      retry: false
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p>Please login to access this page.</p>
          <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user?.name} ({user?.email})</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">API Test</h2>
          {tasksLoading && <p>Loading tasks...</p>}
          {tasksError && (
            <div className="text-red-600">
              <p><strong>Error:</strong> {tasksError.message}</p>
              <pre className="mt-2 text-sm">{JSON.stringify(tasksError, null, 2)}</pre>
            </div>
          )}
          {tasksData && (
            <div>
              <p><strong>Tasks loaded:</strong> {tasksData.data?.tasks?.length || 0}</p>
              <pre className="mt-2 text-sm bg-white p-2 rounded overflow-auto">
                {JSON.stringify(tasksData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Navigation</h2>
          <div className="space-x-4">
            <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
            <a href="/tasks" className="text-blue-600 hover:underline">Tasks</a>
            <a href="/projects" className="text-blue-600 hover:underline">Projects</a>
            <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 