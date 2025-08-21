import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, Role } from '@/hooks/use-auth';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loginAs } = useAuth();

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>Choose a temporary role to continue (mock auth)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(['viewer','contributor','reviewer','admin'] as Role[]).map((r) => (
            <Button key={r} variant="outline" onClick={() => loginAs(r)}>
              Continue as {r}
            </Button>
          ))}
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
