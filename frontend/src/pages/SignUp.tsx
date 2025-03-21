import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import axios from 'axios';

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/h2c/signup', {
        name,
        email,
        password,
        role: selectedRole,
      });

      setIsLoading(false);
      if (response.data.success) {
        alert('Signup successful! Please log in.');
        navigate('/login');
      } else {
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      alert('An error occurred. Please try again.');
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 to-background px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to EduPrep</h1>
            <p className="text-muted-foreground">Select how you want to continue</p>
          </div>

          <div className="grid gap-4">
            <Card
              className="cursor-pointer transform transition-all duration-300"
              onClick={() => setSelectedRole('user')}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-xl">Student</h2>
                  <p className="text-muted-foreground text-sm mt-1">Access your learning dashboard</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check size={20} />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transform transition-all duration-300"
              onClick={() => setSelectedRole('admin')}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-xl">Administrator</h2>
                  <p className="text-muted-foreground text-sm mt-1">Manage students and content</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Check size={20} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 to-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {selectedRole === 'admin' ? 'Admin Signup' : 'Student Signup'}
          </h1>
          <p className="text-muted-foreground">
            Enter your details to create an account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              {selectedRole === 'admin'
                ? 'Create an admin account to manage content and students.'
                : 'Create your personalized learning experience.'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  'Sign up'
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
          <div className="p-4 pt-0 text-center">
            <button
              onClick={() => setSelectedRole(null)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Go back to selection
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
