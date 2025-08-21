import { Role } from './use-auth';

export type Permission =
  | 'documents:view'
  | 'documents:edit'
  | 'documents:approve'
  | 'proposals:submit'
  | 'proposals:approve'
  | 'meetings:start'
  | 'security:view'
  | 'security:manage';

const permissionRoles: Record<Permission, Role[]> = {
  'documents:view': ['viewer', 'contributor', 'reviewer', 'admin'],
  'documents:edit': ['contributor', 'reviewer', 'admin'],
  'documents:approve': ['reviewer', 'admin'],
  'proposals:submit': ['contributor', 'reviewer', 'admin'],
  'proposals:approve': ['reviewer', 'admin'],
  'meetings:start': ['reviewer', 'admin'],
  'security:view': ['reviewer', 'admin'],
  'security:manage': ['admin'],
};

export function hasRole(userRoles: Role[], required: Role | Role[]) {
  const req = Array.isArray(required) ? required : [required];
  return req.some((r) => userRoles.includes(r));
}

export function can(userRoles: Role[], permission: Permission) {
  const allowed = permissionRoles[permission] || [];
  return allowed.some((r) => userRoles.includes(r));
}
