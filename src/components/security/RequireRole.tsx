import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { hasRole } from '@/hooks/use-authorization';

export function RequireRole({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { user } = useAuth();

  if (!user || !hasRole(user.roles, roles as any)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insufficient permissions</CardTitle>
          <CardDescription>You don't have access to view this content.</CardDescription>
        </CardHeader>
        <CardContent>
          Contact an administrator if you believe this is an error.
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
