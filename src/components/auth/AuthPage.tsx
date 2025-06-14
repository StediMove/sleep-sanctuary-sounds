
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in."
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account."
      });
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`
    });
    
    if (error) {
      toast({
        title: "Error sending reset email",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Reset email sent!",
        description: "Please check your email for password reset instructions."
      });
      setResetMode(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Sleep Sanctuary</CardTitle>
          <CardDescription className="text-white/70">
            Your peaceful escape to better sleep
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {resetMode ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white text-center">Reset Password</h3>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Email"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-white/70 hover:text-white"
                  onClick={() => setResetMode(false)}
                >
                  Back to Sign In
                </Button>
              </form>
            </div>
          ) : (
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-white/70 hover:text-white text-sm"
                    onClick={() => setResetMode(true)}
                  >
                    Forgot your password?
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <Input
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
