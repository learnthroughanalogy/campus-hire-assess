
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
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
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Login to access the assessment platform
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">Password</label>
                      <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-emerald-200 focus:border-emerald-400"
                    />
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </div>
                </form>
              </CardContent>
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
            </TabsContent>
            
            <TabsContent value="help">
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-medium">Login Help</h3>
                  <p className="text-sm text-gray-500">
                    If you're a candidate, your login details should have been provided by your college placement officer.
                  </p>
                  <p className="text-sm text-gray-500">
                    For recruiters, SMEs, and administrators, please contact the system administrator to get your login credentials.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = 'mailto:support@campushire.com'}>
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
