import { useMemo } from 'react';
import { Shield, Download, Trash2, UserCog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { useAuditLog } from '@/hooks/use-audit-log';

export default function Security() {
  const { user, setRoles } = useAuth();
  const { events, addEvent, clear, exportJSON } = useAuditLog();

  const roleOptions = ['viewer','contributor','reviewer','admin'] as const;

  const handleRoleToggle = (role: typeof roleOptions[number], checked: boolean | string) => {
    if (!user) return;
    if (checked === 'indeterminate') return;
    const next = new Set(user.roles);
    if (checked === true) next.add(role as any); else next.delete(role as any);
    setRoles(Array.from(next) as any);
    addEvent({
      actor: { id: user.id, name: user.name, email: user.email },
      action: 'security.role.update',
      target: { type: 'user', id: user.id, name: user.name },
      severity: 'security',
      metadata: { roles: Array.from(next) },
    });
  };

  const rows = useMemo(() => events.slice(0, 100), [events]);

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Security & Compliance</h1>
          <p className="text-muted-foreground">Roles, permissions, and audit logging (mock)</p>
        </div>
        <Shield className="h-6 w-6 text-primary" />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" /> Current User Roles
            </CardTitle>
            <CardDescription>Toggle roles to simulate RBAC</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {roleOptions.map((r) => (
                <label key={r} className="flex items-center justify-between p-2 rounded border">
                  <span className="capitalize">{r}</span>
                  <Checkbox checked={user?.roles.includes(r as any)} onCheckedChange={(c) => handleRoleToggle(r, c)} />
                </label>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Active roles: {user?.roles.map((r) => (<Badge key={r} variant="outline" className="mx-1">{r}</Badge>))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage audit log data</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => exportJSON()} variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export JSON
            </Button>
            <Button onClick={() => clear()} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Clear Log
            </Button>
            <Button onClick={() => user && addEvent({ actor: { id: user.id, name: user.name }, action: 'security.test', severity: 'info', metadata: { note: 'manual test' } })}>
              Add Test Event
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
            <CardDescription>Last {rows.length} events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No events</TableCell>
                    </TableRow>
                  ) : rows.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{e.actor?.name || 'System'}</TableCell>
                      <TableCell>{e.action}</TableCell>
                      <TableCell>{e.target?.type}{e.target?.name ? ` • ${e.target?.name}` : ''}</TableCell>
                      <TableCell><Badge variant={e.severity === 'error' ? 'destructive' : 'outline'}>{e.severity}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
