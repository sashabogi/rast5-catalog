# Admin RBAC Components

This directory contains server components for implementing Role-Based Access Control (RBAC) in the admin interface. These components provide a declarative way to control access to UI elements based on user roles and permissions.

## Components

### RequireRole

A server component that conditionally renders content based on the current user's role.

#### Props

- `role: Role | Role[]` - The role(s) required to render the children
- `children: ReactNode` - Content to render if user has required role
- `fallback?: ReactNode` - Optional content to render if user lacks role (defaults to null)

#### Usage

```tsx
import { RequireRole } from '@/components/admin'

// Single role check
<RequireRole role="super_admin">
  <DeleteButton />
</RequireRole>

// Multiple roles check (user needs any of these roles)
<RequireRole
  role={["super_admin", "content_manager"]}
  fallback={<p>Access Denied</p>}
>
  <AdminPanel />
</RequireRole>
```

### RequirePermission

A server component that conditionally renders content based on the current user's permissions.

#### Props

- `permission: Permission | Permission[]` - The permission(s) required
- `requireAll?: boolean` - When using array, whether all permissions are required (default: false)
- `children: ReactNode` - Content to render if user has required permission(s)
- `fallback?: ReactNode` - Optional content to render if user lacks permission (defaults to null)

#### Usage

```tsx
import { RequirePermission } from '@/components/admin'

// Single permission check
<RequirePermission permission="connectors:delete">
  <DeleteButton />
</RequirePermission>

// Multiple permissions - requires ANY (OR logic)
<RequirePermission
  permission={["connectors:create", "connectors:update"]}
  requireAll={false}
  fallback={<p>Insufficient permissions</p>}
>
  <EditForm />
</RequirePermission>

// Multiple permissions - requires ALL (AND logic)
<RequirePermission
  permission={["connectors:create", "connectors:update"]}
  requireAll={true}
>
  <AdminForm />
</RequirePermission>
```

## Available Roles

The system supports the following roles (defined in `/lib/auth/permissions.ts`):

1. **super_admin** - Full system access including user management and system settings
2. **content_manager** - Manage all content (connectors, terminals, keying docs, translations) + audit logs
3. **translator** - Manage translations only
4. **sales_viewer** - Read-only access to all content

## Available Permissions

Permissions are organized by resource category:

### Connector Management
- `connectors:create`
- `connectors:read`
- `connectors:update`
- `connectors:delete`

### Terminal Management
- `terminals:create`
- `terminals:read`
- `terminals:update`
- `terminals:delete`

### Keying Document Management
- `keying_docs:create`
- `keying_docs:read`
- `keying_docs:update`
- `keying_docs:delete`

### Translation Management
- `translations:create`
- `translations:read`
- `translations:update`
- `translations:delete`

### User Management
- `users:create`
- `users:read`
- `users:update`
- `users:delete`

### Other
- `audit_logs:read` - Access to audit logs
- `system:manage` - System settings management

## Implementation Details

### Server Components

Both `RequireRole` and `RequirePermission` are **server components** that run on the server side. They:

1. Use `getCurrentAdminUserWithRole()` from `/lib/supabase/server` to get the current user
2. Check the user's role/permissions using utilities from `/lib/auth/permissions`
3. Return the appropriate content based on authorization

### Security

- Authentication checks happen server-side, making them secure
- No sensitive permission logic is exposed to the client
- Components gracefully handle null/undefined users
- Database queries use the service role client for bypassing RLS when checking admin status

### Performance

- Components are async and can use `await` for database queries
- Permission checks are done once at render time
- No client-side JavaScript is required for basic permission checks

## Examples

See `examples.tsx` for comprehensive usage examples including:

- Single and multiple role checks
- Permission checks with different requireAll settings
- Nested permission checks
- Role-based dashboard sections
- Fallback content handling

## Best Practices

1. **Use RequireRole for broad access control** - When you want to restrict entire sections to specific roles
2. **Use RequirePermission for fine-grained control** - When you need specific permission checks
3. **Always provide meaningful fallbacks** - Help users understand why they can't access something
4. **Compose components** - You can nest these components for complex authorization logic
5. **Keep permission checks close to the UI** - Makes it easy to understand what permissions affect what UI elements

## Testing

To test these components:

1. Set up test users with different roles in your `admin_users` table
2. Log in as different users to verify correct rendering
3. Check that fallback content appears appropriately
4. Verify that permission changes are reflected immediately

## Troubleshooting

### Component not hiding/showing content correctly

1. Check that the user is properly authenticated
2. Verify the user exists in the `admin_users` table with `is_active: true`
3. Confirm the role is correctly set in the database
4. Check that permission names match exactly (they're case-sensitive)

### getCurrentAdminUserWithRole returns null

1. User is not authenticated
2. User is not in the `admin_users` table
3. User's `is_active` field is false
4. Database connection issues

### TypeScript errors

1. Ensure you're importing types from `@/lib/auth/permissions`
2. Check that role/permission strings match the defined types exactly
3. Verify that fallback content is valid React nodes