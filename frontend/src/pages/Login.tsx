import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import axios from 'axios';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/h2c/login', {
        email,
        password,
      });

      const token = response.data.token;

      console.log("response in login",response)
      console.log("token",token)

      setIsLoading(false);
      if (response.data.success) {
        // Store the role in localStorage
        localStorage.setItem('role', selectedRole);

        localStorage.setItem("token",token)

        if (selectedRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
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
            {selectedRole === 'admin' ? 'Admin Login' : 'Student Login'}
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              {selectedRole === 'admin'
                ? 'Access the admin dashboard to manage content and students.'
                : 'Access your personalized learning experience.'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="h-4 w-4 mr-2" />
                Google
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
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

export default Login;
