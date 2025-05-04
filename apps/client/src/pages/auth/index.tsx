import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoginForm from './Forms/Login';
import RegisterForm from './Forms/Register';

const GoogleAuthButton = () => {
  return (
    <Button variant="outline" className="w-full">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      Google
    </Button>
  );
};

enum activeFormType {
  LOGIN = 'login',
  REGISTER = 'register',
}

const AuthMain = () => {
  const [activeForm, setActiveForm] = useState<activeFormType>(activeFormType.LOGIN);

  const handleSwitchForm = () => {
    setActiveForm((prevState: activeFormType) => {
      return prevState === activeFormType.LOGIN ? activeFormType.REGISTER : activeFormType.LOGIN;
    });
  };

  return (
    <div className="w-full bg-gradient flex justify-center items-center">
      <Card className="max-w-xl w-full shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            {activeForm === activeFormType.LOGIN ? 'Login with your Google account' : 'Create your account'}
          </CardDescription>
        </CardHeader>

        <CardContent className=" flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <GoogleAuthButton />
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              {activeForm === activeFormType.LOGIN ? 'Or continue with' : 'Or with email and password'}
            </span>
          </div>

          {activeForm === activeFormType.LOGIN ? <LoginForm /> : <RegisterForm />}

          {activeForm === activeFormType.LOGIN ? (
            <div className="text-center text-sm">
              Don&apos;t have an account?
              <p onClick={handleSwitchForm} className="underline underline-offset-4 cursor-pointer inline-block ml-1">
                Sign up
              </p>
            </div>
          ) : (
            <div className="text-center text-sm">
              Have an account?
              <p onClick={handleSwitchForm} className="underline underline-offset-4 cursor-pointer inline-block ml-1">
                Log in
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthMain;
