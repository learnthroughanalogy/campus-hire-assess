import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: 'candidate' // Default role for new signups
            }
          }
        });
        if (error) throw error;
        
        toast({
          title: "Registration Successful",
          description: "Please check your email for verification.",
        });
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: isSignUp ? 'Registration Failed' : 'Login Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-10 w-10 text-emerald-600" />
            <h1 className="text-3xl font-bold text-emerald-800">CampusHire</h1>
          </div>
        </div>
        
        <Card className="border-emerald-100 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              {isSignUp ? 'Create an account to get started' : 'Sign in to access your account'}
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="auth" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger 
                value="auth" 
                onClick={() => setIsSignUp(false)}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="auth">
              <form onSubmit={handleSubmit} className="space-y-4">
                <CardContent className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={isSignUp}
                        className="border-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-emerald-200 focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {!isSignUp && (
                        <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700">
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (isSignUp ? 'Creating account...' : 'Signing in...') 
                      : (isSignUp ? 'Create Account' : 'Sign in')}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>

          {!isSignUp && (
            <CardFooter className="flex justify-center pt-0">
              <div className="text-sm text-center text-gray-500">
                <p className="mb-3">Demo Credentials:</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 bg-emerald-50 rounded">
                    <div className="font-semibold">Administrator</div>
                    <div>admin@example.com</div>
                    <div>password</div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded">
                    <div className="font-semibold">Recruiter</div>
                    <div>recruiter@example.com</div>
                    <div>password</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div className="p-2 bg-emerald-50 rounded">
                    <div className="font-semibold">Candidate</div>
                    <div>candidate@example.com</div>
                    <div>password</div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded">
                    <div className="font-semibold">SME</div>
                    <div>sme@example.com</div>
                    <div>password</div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded">
                    <div className="font-semibold">University SPOC</div>
                    <div>university@example.com</div>
                    <div>password</div>
                  </div>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
