// /lib/audit/log.ts
import { createServiceClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// ============================================================================
// TYPES
// ============================================================================

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'read'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'approve'
  | 'reject'
  | 'restore';

export type AuditResourceType =
  | 'connector'
  | 'terminal'
  | 'keying_document'
  | 'admin_user'
  | 'customer_inquiry'
  | 'translation'
  | 'system_setting'
  | 'audit_log';

export type AuditStatus = 'success' | 'failure' | 'partial';

export interface AuditEventParams {
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  resourceDescription?: string;
  details?: Record<string, unknown>;
  userId?: string;
  status?: AuditStatus;
  errorMessage?: string;
}

export interface RequestContext {
  ipAddress: string | null;
  userAgent: string | null;
  requestMethod: string | null;
  requestPath: string | null;
}

// ============================================================================
// REQUEST CONTEXT EXTRACTION
// ============================================================================

/**
 * Extracts request context (IP, user agent, method, path) from Next.js headers
 */
async function getRequestContext(): Promise<RequestContext> {
  try {
    const headersList = await headers();

    // Extract IP address (try multiple headers for proxy support)
    const ipAddress =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headersList.get('x-real-ip') ||
      headersList.get('cf-connecting-ip') || // Cloudflare
      headersList.get('x-client-ip') ||
      null;

    // Extract user agent
    const userAgent = headersList.get('user-agent') || null;

    // Extract request method and path
    const requestMethod = headersList.get('x-middleware-request-method') ||
                         headersList.get('x-invoke-method') ||
                         null;
    const requestPath = headersList.get('x-middleware-request-path') ||
                       headersList.get('x-invoke-path') ||
                       headersList.get('referer') ||
                       null;

    return {
      ipAddress,
      userAgent,
      requestMethod,
      requestPath,
    };
  } catch (error) {
    // If headers() fails (e.g., in non-request context), return nulls
    console.warn('Failed to extract request context:', error);
    return {
      ipAddress: null,
      userAgent: null,
      requestMethod: null,
      requestPath: null,
    };
  }
}

// ============================================================================
// MAIN AUDIT LOGGING FUNCTION
// ============================================================================

/**
 * Logs an audit event to the database
 *
 * @param params - Audit event parameters
 * @returns Promise<boolean> - true if successful, false if failed
 *
 * @example
 * await logAuditEvent({
 *   action: 'update',
 *   resourceType: 'connector',
 *   resourceId: connector.id,
 *   resourceDescription: `${connector.connector_name} - ${connector.connector_code}`,
 *   details: { changes: { status: 'active' } },
 *   userId: session.user.id,
 *   status: 'success'
 * });
 */
export async function logAuditEvent(params: AuditEventParams): Promise<boolean> {
  try {
    const {
      action,
      resourceType,
      resourceId = null,
      resourceDescription = null,
      details = null,
      userId = null,
      status = 'success',
      errorMessage = null,
    } = params;

    // Get request context
    const context = await getRequestContext();

    // Create service client (bypasses RLS)
    const supabase = createServiceClient();

    // Call the database function created in migration
    // @ts-expect-error - log_admin_action RPC function not available until migrations deployed
    const { error } = await supabase.rpc('log_admin_action', {
      p_user_id: userId,
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_resource_description: resourceDescription,
      p_details: details ? JSON.stringify(details) : null,
      p_ip_address: context.ipAddress,
      p_user_agent: context.userAgent,
      p_request_method: context.requestMethod,
      p_request_path: context.requestPath,
      p_status: status,
      p_error_message: errorMessage,
    });

    if (error) {
      console.error('Failed to log audit event:', error);
      return false;
    }

    return true;
  } catch (error) {
    // Never throw - audit logging should not break the app
    console.error('Audit logging error:', error);
    return false;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Logs a connector change (create, update, delete)
 */
export async function logConnectorChange(
  action: Extract<AuditAction, 'create' | 'update' | 'delete' | 'read'>,
  connectorId: string,
  details?: {
    connectorName?: string;
    connectorCode?: string;
    changes?: Record<string, unknown>;
    reason?: string;
  },
  userId?: string
): Promise<boolean> {
  const resourceDescription = details?.connectorName && details?.connectorCode
    ? `${details.connectorName} (${details.connectorCode})`
    : undefined;

  return logAuditEvent({
    action,
    resourceType: 'connector',
    resourceId: connectorId,
    resourceDescription,
    details,
    userId,
  });
}

/**
 * Logs a terminal change (create, update, delete)
 */
export async function logTerminalChange(
  action: Extract<AuditAction, 'create' | 'update' | 'delete' | 'read'>,
  terminalId: string,
  details?: {
    terminalName?: string;
    terminalCode?: string;
    changes?: Record<string, unknown>;
    reason?: string;
  },
  userId?: string
): Promise<boolean> {
  const resourceDescription = details?.terminalName && details?.terminalCode
    ? `${details.terminalName} (${details.terminalCode})`
    : undefined;

  return logAuditEvent({
    action,
    resourceType: 'terminal',
    resourceId: terminalId,
    resourceDescription,
    details,
    userId,
  });
}

/**
 * Logs a user management action (create, update, delete admin users)
 */
export async function logUserAction(
  action: Extract<AuditAction, 'create' | 'update' | 'delete'>,
  targetUserId: string,
  details?: {
    userEmail?: string;
    userRole?: string;
    changes?: Record<string, unknown>;
    reason?: string;
  },
  performingUserId?: string
): Promise<boolean> {
  const resourceDescription = details?.userEmail
    ? `${details.userEmail}${details.userRole ? ` (${details.userRole})` : ''}`
    : undefined;

  return logAuditEvent({
    action,
    resourceType: 'admin_user',
    resourceId: targetUserId,
    resourceDescription,
    details,
    userId: performingUserId,
  });
}

/**
 * Logs a login attempt (success or failure)
 */
export async function logLoginAttempt(
  userId: string | null,
  success: boolean,
  errorMessage?: string,
  details?: {
    email?: string;
    method?: 'password' | 'oauth' | 'magic_link';
  }
): Promise<boolean> {
  return logAuditEvent({
    action: success ? 'login' : 'login',
    resourceType: 'admin_user',
    resourceId: userId || undefined,
    resourceDescription: details?.email,
    details: {
      ...details,
      success,
    },
    userId: userId || undefined,
    status: success ? 'success' : 'failure',
    errorMessage: success ? undefined : errorMessage,
  });
}

/**
 * Logs a logout event
 */
export async function logLogoutEvent(
  userId: string,
  details?: {
    email?: string;
    reason?: 'manual' | 'timeout' | 'forced';
  }
): Promise<boolean> {
  return logAuditEvent({
    action: 'logout',
    resourceType: 'admin_user',
    resourceId: userId,
    resourceDescription: details?.email,
    details,
    userId,
  });
}

/**
 * Logs a keying document action
 */
export async function logKeyingDocumentChange(
  action: Extract<AuditAction, 'create' | 'update' | 'delete' | 'approve' | 'reject'>,
  documentId: string,
  details?: {
    documentName?: string;
    changes?: Record<string, unknown>;
    reason?: string;
  },
  userId?: string
): Promise<boolean> {
  return logAuditEvent({
    action,
    resourceType: 'keying_document',
    resourceId: documentId,
    resourceDescription: details?.documentName,
    details,
    userId,
  });
}

/**
 * Logs a data export action
 */
export async function logDataExport(
  resourceType: AuditResourceType,
  details: {
    format?: 'csv' | 'xlsx' | 'json' | 'pdf';
    recordCount?: number;
    filters?: Record<string, unknown>;
  },
  userId?: string
): Promise<boolean> {
  return logAuditEvent({
    action: 'export',
    resourceType,
    resourceDescription: `Exported ${details.recordCount || 'unknown'} records as ${details.format || 'unknown format'}`,
    details,
    userId,
  });
}

/**
 * Logs a data import action
 */
export async function logDataImport(
  resourceType: AuditResourceType,
  details: {
    format?: 'csv' | 'xlsx' | 'json';
    recordCount?: number;
    successCount?: number;
    errorCount?: number;
    errors?: unknown[];
  },
  userId?: string,
  status: AuditStatus = 'success'
): Promise<boolean> {
  return logAuditEvent({
    action: 'import',
    resourceType,
    resourceDescription: `Imported ${details.successCount || 0}/${details.recordCount || 0} records`,
    details,
    userId,
    status,
  });
}

/**
 * Logs a customer inquiry action
 */
export async function logCustomerInquiryChange(
  action: Extract<AuditAction, 'create' | 'update' | 'delete' | 'read'>,
  inquiryId: string,
  details?: {
    customerName?: string;
    inquiryType?: string;
    changes?: Record<string, unknown>;
  },
  userId?: string
): Promise<boolean> {
  const resourceDescription = details?.customerName
    ? `${details.customerName}${details.inquiryType ? ` - ${details.inquiryType}` : ''}`
    : undefined;

  return logAuditEvent({
    action,
    resourceType: 'customer_inquiry',
    resourceId: inquiryId,
    resourceDescription,
    details,
    userId,
  });
}

/**
 * Logs a system setting change
 */
export async function logSystemSettingChange(
  action: Extract<AuditAction, 'update'>,
  settingKey: string,
  details: {
    oldValue?: unknown;
    newValue?: unknown;
    reason?: string;
  },
  userId?: string
): Promise<boolean> {
  return logAuditEvent({
    action,
    resourceType: 'system_setting',
    resourceDescription: settingKey,
    details,
    userId,
  });
}

// ============================================================================
// BATCH LOGGING
// ============================================================================

/**
 * Logs multiple audit events in a batch
 * Useful for operations that affect multiple resources
 */
export async function logAuditEventBatch(events: AuditEventParams[]): Promise<boolean[]> {
  return Promise.all(events.map(event => logAuditEvent(event)));
}

// ============================================================================
// EXPORTS
// ============================================================================

const auditLogHelpers = {
  logAuditEvent,
  logConnectorChange,
  logTerminalChange,
  logUserAction,
  logLoginAttempt,
  logLogoutEvent,
  logKeyingDocumentChange,
  logDataExport,
  logDataImport,
  logCustomerInquiryChange,
  logSystemSettingChange,
  logAuditEventBatch,
};

export default auditLogHelpers;
