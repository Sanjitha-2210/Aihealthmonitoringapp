import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Activity, Heart, TrendingUp } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase';
import { toast } from 'sonner';

interface AuthPageProps {
  onAuthSuccess: (accessToken: string, user: any) => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');

  const supabase = getSupabaseClient();

  // 🔐 SIGN IN
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) {
        toast.error(`Sign in error: ${error.message}`);
      } else if (data.session) {
        toast.success('Successfully signed in!');
        onAuthSuccess(data.session.access_token, data.user);
      }
    } catch (error) {
      toast.error('Failed to sign in');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🆕 SIGN UP (FIXED)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            name: signUpName
          },
          // Auto-confirm email since email server is not configured
          emailRedirectTo: undefined
        }
      });

      if (error) {
        toast.error(`Sign up error: ${error.message}`);
      } else if (data.user) {
        // Check if email confirmation is required
        const session = data.session;
        
        if (!session) {
          // Email confirmation required
          toast.success('Account created! Please check your email to confirm your account, or sign in directly if email confirmation is disabled in your Supabase settings.');
        } else {
          // Session created immediately (email confirmation disabled)
          toast.success('Account created successfully! You can now sign in.');
        }

        // Autofill login fields for convenience
        setSignInEmail(signUpEmail);
        setSignInPassword(signUpPassword);
        
        // Clear signup form
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpName('');
        
        // Automatically switch to sign in tab
        setTimeout(() => {
          document.querySelector('[value="signin"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }, 100);
      }
    } catch (error) {
      toast.error('Failed to create account');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
            <Heart className="w-6 h-6 text-red-500" />
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Health Monitor
          </h1>
          <p className="text-gray-600">
            Track vitals, predict risks, live healthier
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* SIGN IN */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIGN UP */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Start your health journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>

                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Demo app — not for real medical use
        </div>

      </div>
    </div>
  );
}