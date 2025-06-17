import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [searchParams] = useSearchParams();
  const [newPasswordMode, setNewPasswordMode] = useState(false);
  const [recoverySession, setRecoverySession] = useState<any>(null);

  // Check if this is a password reset redirect
  useEffect(() => {
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    console.log('URL params:', { type, accessToken: !!accessToken, refreshToken: !!refreshToken });
    
    if (type === 'recovery' && accessToken && refreshToken) {
      console.log('Processing password recovery...');
      // Store the recovery tokens but don't set the session yet
      setRecoverySession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      setNewPasswordMode(true);
      toast({
        title: "Reset your password",
        description: "Please enter your new password below."
      });
    }
  }, [searchParams, toast]);

  // Only redirect if user is logged in AND not in password reset mode
  if (user && !newPasswordMode) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const currentUrl = window.location.origin;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${currentUrl}/`
      }
    });
    
    if (error) {
      toast({
        title: "Error with Google sign in",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

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

    // Use the actual domain instead of localhost
    const currentUrl = window.location.origin;
    const redirectUrl = `${currentUrl}/auth`;

    console.log('Sending password reset to:', email, 'with redirect:', redirectUrl);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
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

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    console.log('Updating password with recovery session...');

    try {
      // First set the session with the recovery tokens
      if (recoverySession) {
        await supabase.auth.setSession({
          access_token: recoverySession.access_token,
          refresh_token: recoverySession.refresh_token,
        });
      }

      // Then update the password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Password update error:', error);
        toast({
          title: "Error updating password",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password updated!",
          description: "Your password has been successfully updated. You will be redirected to the home page."
        });
        setNewPasswordMode(false);
        setRecoverySession(null);
        // Clear the URL parameters and redirect to home
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Error during password update:', error);
      toast({
        title: "Error updating password",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Whispry</CardTitle>
          <CardDescription className="text-white/70">
            Your peaceful escape to better sleep
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {newPasswordMode ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white text-center">Set New Password</h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <Input
                  name="password"
                  type="password"
                  placeholder="New password (min 6 characters)"
                  required
                  minLength={6}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          ) : resetMode ? (
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
            <div className="space-y-4">
              {/* Google Sign In Button */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "Signing in..." : "Continue with Google"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-white/50">Or continue with email</span>
                </div>
              </div>

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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
