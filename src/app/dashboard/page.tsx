"use client"
import { useContext, useEffect } from 'react';
import AuthContext from '@/app/context/auth-context';

import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const { user, isLoading, isAuthenticated, logout } = useContext(AuthContext);
  console.log('user: ',user)
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated (will be redirected)
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name} ({user.email})!</p>
      {/* Display other user information as needed */}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
