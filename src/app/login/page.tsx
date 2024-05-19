"use client"
import { useState, useContext } from 'react';
import AuthContext from '@/app/context/auth-context';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const api_url = process.env.NEXT_PUBLIC_API_URL
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const res = await axios.post(`${api_url}/api/auth/login`, formData);
      await login(res.data.token); // Login with the received token
      router.push('/dashboard'); // Redirect to home page
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="usernameOrEmail">Username or Email:</label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
