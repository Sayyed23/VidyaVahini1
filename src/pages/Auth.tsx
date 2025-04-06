import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User, BookOpen, Briefcase } from 'lucide-react';
import Logo from '@/components/Logo';
import SimpleLanguageSwitcher from '@/components/SimpleLanguageSwitcher';
import TranslatedText from '@/components/TranslatedText';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  role: z.enum(['student', 'teacher', 'employer'], { required_error: 'Please select a role' }),
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const RoleButton: React.FC<{ role: string; selectedRole: string; onSelect: (role: string) => void }> = ({ role, selectedRole, onSelect }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <User className="h-4 w-4" />;
      case 'teacher':
        return <BookOpen className="h-4 w-4" />;
      case 'employer':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Button
      type="button"
      variant={selectedRole === role ? 'default' : 'outline'}
      className={selectedRole === role ? 'bg-edu-purple border-edu-purple' : 'border-gray-600'}
      onClick={() => onSelect(role)}
    >
      {getRoleIcon(role)}
      <span className="ml-2 capitalize">
        <TranslatedText text={role} />
      </span>
    </Button>
  );
};

const Auth: React.FC = () => {
  const { user, signIn, signUp, resetPassword, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/';

  const handleBack = () => navigate('/');

  useEffect(() => {
    if (user) {
      const userRole = user.user_metadata?.role;
      const rolePath = userRole === 'teacher' ? '/educator' : userRole === 'employer' ? '/employer' : '/student';
      navigate(rolePath, { replace: true });
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', username: '', role: 'student' },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleSubmit = async (action: () => Promise<{ success: boolean; error?: string }>, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, error } = await action();
      if (success && onSuccess) onSuccess();
      if (!success) setError(error || 'An unexpected error occurred');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (name: string, label: string, placeholder: string, type = 'text', icon: React.ReactNode, form: any) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <TranslatedText text={label} />
          </FormLabel>
          <FormControl>
            <div className="relative">
              {icon}
              <Input type={type} placeholder={placeholder} className="bg-edu-dark pl-10 py-2 md:py-3" {...field} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="min-h-screen flex flex-col bg-edu-dark">
      <div className="flex items-center justify-between p-4 md:p-6 lg:p-8">
        <button onClick={handleBack} className="text-white bg-edu-purple px-3 py-2 rounded md:px-4 md:py-2">
          Back
        </button>
        <Logo size={36} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-edu-card-bg border-none shadow-xl">
          <CardHeader className="space-y-2 md:space-y-3">
            <CardTitle className="text-xl md:text-2xl font-bold text-center">
              <TranslatedText text={activeTab === 'login' ? 'Welcome back' : activeTab === 'register' ? 'Create an account' : 'Reset your password'} />
            </CardTitle>
            <CardDescription className="text-sm md:text-base text-center">
              <TranslatedText text={activeTab === 'login' ? 'Enter your credentials to sign in' : activeTab === 'register' ? 'Fill in your details to register' : 'Enter your email to reset your password'} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 rounded">{error}</div>}
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 gap-2 mb-6">
                <TabsTrigger value="login">
                  <TranslatedText text="Login" />
                </TabsTrigger>
                <TabsTrigger value="register">
                  <TranslatedText text="Register" />
                </TabsTrigger>
                <TabsTrigger value="reset">
                  <TranslatedText text="Reset" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((values) => handleSubmit(() => signIn(values.email, values.password)))}>
                    {renderFormField('email', 'Email', 'your.email@example.com', 'text', <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />, loginForm)}
                    {renderFormField('password', 'Password', '••••••••', 'password', <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />, loginForm)}
                    <Button type="submit" className="w-full bg-edu-purple py-2 md:py-3" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TranslatedText text="Sign In" />}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit((values) => handleSubmit(() => signUp(values.email, values.password, { username: values.username, role: values.role }), () => setActiveTab('login')))}>
                    {renderFormField('email', 'Email', 'your.email@example.com', 'text', <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />, registerForm)}
                    {renderFormField('username', 'Username', 'johndoe', 'text', <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />, registerForm)}
                    {renderFormField('password', 'Password', '••••••••', 'password', <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />, registerForm)}
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <TranslatedText text="I am a..." />
                          </FormLabel>
                          <div className="grid grid-cols-3 gap-2">
                            {['student', 'teacher', 'employer'].map((role) => (
                              <RoleButton key={role} role={role} selectedRole={field.value} onSelect={field.onChange} />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-edu-purple py-2 md:py-3" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TranslatedText text="Create Account" />}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="reset">
                <Form {...resetPasswordForm}>
                  <form onSubmit={resetPasswordForm.handleSubmit((values) => handleSubmit(() => resetPassword(values.email), () => setActiveTab('login')))}>
                    {renderFormField('email', 'Email', 'your.email@example.com', 'text', <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />, resetPasswordForm)}
                    <Button type="submit" className="w-full bg-edu-purple py-2 md:py-3" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TranslatedText text="Send Reset Link" />}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <SimpleLanguageSwitcher />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
