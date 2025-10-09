/**
 * Unit Tests for Audit Logging Utilities
 *
 * Tests for audit event logging functions and request context extraction
 */

import {
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
  type AuditEventParams,
  type RequestContext,
} from '../log'
import { createServiceClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// ============================================================================
// Mock Setup
// ============================================================================

// Mock Next.js headers
const mockHeadersGet = jest.fn()

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))

// Mock Supabase RPC
const mockRpc = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createServiceClient: jest.fn(() => ({
    rpc: mockRpc,
  })),
}))

// ============================================================================
// Test Data
// ============================================================================

const mockRequestContext: RequestContext = {
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0 (Test Browser)',
  requestMethod: 'POST',
  requestPath: '/api/connectors',
}

const mockUserId = 'user-123'
const mockResourceId = 'resource-456'

// ============================================================================
// Setup and Teardown
// ============================================================================

beforeEach(() => {
  jest.clearAllMocks()

  // Default mock: successful RPC call
  mockRpc.mockResolvedValue({
    data: null,
    error: null,
  })

  // Default headers setup
  mockHeadersGet.mockImplementation((header: string) => {
    const headerMap: Record<string, string> = {
      'x-forwarded-for': mockRequestContext.ipAddress!,
      'user-agent': mockRequestContext.userAgent!,
      'x-middleware-request-method': mockRequestContext.requestMethod!,
      'x-middleware-request-path': mockRequestContext.requestPath!,
    }
    return headerMap[header] || null
  })

  // Mock headers function
  const mockedHeaders = headers as jest.Mock
  mockedHeaders.mockResolvedValue({
    get: mockHeadersGet,
  })
})

// ============================================================================
// Request Context Extraction Tests
// ============================================================================

describe('getRequestContext()', () => {
  describe('IP Address Extraction', () => {
    it('should extract IP from x-forwarded-for header', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'x-forwarded-for' ? '10.0.0.1, 10.0.0.2' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_ip_address: '10.0.0.1',
        })
      )
    })

    it('should extract IP from x-real-ip header when x-forwarded-for is missing', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'x-real-ip' ? '10.0.0.2' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_ip_address: '10.0.0.2',
        })
      )
    })

    it('should extract IP from cf-connecting-ip header (Cloudflare)', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'cf-connecting-ip' ? '10.0.0.3' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_ip_address: '10.0.0.3',
        })
      )
    })

    it('should extract IP from x-client-ip header as fallback', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'x-client-ip' ? '10.0.0.4' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_ip_address: '10.0.0.4',
        })
      )
    })

    it('should handle null IP when no headers are present', async () => {
      mockHeadersGet.mockReturnValue(null)

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_ip_address: null,
        })
      )
    })

    it('should trim whitespace from x-forwarded-for IP addresses', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'x-forwarded-for' ? '  10.0.0.5  , 10.0.0.6' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_ip_address: '10.0.0.5',
        })
      )
    })
  })

  describe('User Agent Extraction', () => {
    it('should extract user agent from user-agent header', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'user-agent' ? 'Test User Agent' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_user_agent: 'Test User Agent',
        })
      )
    })

    it('should handle null user agent when header is missing', async () => {
      mockHeadersGet.mockReturnValue(null)

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_user_agent: null,
        })
      )
    })
  })

  describe('Request Method and Path Extraction', () => {
    it('should extract request method from x-middleware-request-method', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'x-middleware-request-method' ? 'PUT' : null
      )

      await logAuditEvent({
        action: 'update',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_request_method: 'PUT',
        })
      )
    })

    it('should extract request method from x-invoke-method as fallback', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'x-invoke-method' ? 'DELETE' : null
      )

      await logAuditEvent({
        action: 'delete',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_request_method: 'DELETE',
        })
      )
    })

    it('should extract request path from x-middleware-request-path', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'x-middleware-request-path' ? '/api/connectors/123' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_request_path: '/api/connectors/123',
        })
      )
    })

    it('should extract request path from x-invoke-path as fallback', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'x-invoke-path' ? '/api/terminals' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'terminal',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_request_path: '/api/terminals',
        })
      )
    })

    it('should extract request path from referer as final fallback', async () => {
      mockHeadersGet.mockImplementation((header: string) =>
        header === 'referer' ? 'https://example.com/dashboard' : null
      )

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_request_path: 'https://example.com/dashboard',
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle headers() failure gracefully', async () => {
      const mockedHeaders = headers as jest.Mock
      mockedHeaders.mockRejectedValueOnce(new Error('Headers not available'))

      const result = await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(result).toBe(true)
      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_ip_address: null,
          p_user_agent: null,
          p_request_method: null,
          p_request_path: null,
        })
      )
    })

    it('should log warning when headers() fails', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      const mockedHeaders = headers as jest.Mock
      mockedHeaders.mockRejectedValueOnce(new Error('Headers not available'))

      await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to extract request context:',
        expect.any(Error)
      )

      consoleWarnSpy.mockRestore()
    })
  })
})

// ============================================================================
// logAuditEvent() Tests
// ============================================================================

describe('logAuditEvent()', () => {
  describe('Successful Logging', () => {
    it('should log audit event with all parameters', async () => {
      const params: AuditEventParams = {
        action: 'update',
        resourceType: 'connector',
        resourceId: mockResourceId,
        resourceDescription: 'Test Connector (TC-001)',
        details: { changes: { status: 'active' } },
        userId: mockUserId,
        status: 'success',
      }

      const result = await logAuditEvent(params)

      expect(result).toBe(true)
      expect(mockRpc).toHaveBeenCalledWith('log_admin_action', {
        p_user_id: mockUserId,
        p_action: 'update',
        p_resource_type: 'connector',
        p_resource_id: mockResourceId,
        p_resource_description: 'Test Connector (TC-001)',
        p_details: JSON.stringify({ changes: { status: 'active' } }),
        p_ip_address: mockRequestContext.ipAddress,
        p_user_agent: mockRequestContext.userAgent,
        p_request_method: mockRequestContext.requestMethod,
        p_request_path: mockRequestContext.requestPath,
        p_status: 'success',
        p_error_message: null,
      })
    })

    it('should log audit event with minimal parameters', async () => {
      const result = await logAuditEvent({
        action: 'read',
        resourceType: 'connector',
      })

      expect(result).toBe(true)
      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_action: 'read',
          p_resource_type: 'connector',
          p_resource_id: null,
          p_resource_description: null,
          p_details: null,
          p_user_id: null,
          p_status: 'success',
          p_error_message: null,
        })
      )
    })

    it('should use default status as "success"', async () => {
      await logAuditEvent({
        action: 'create',
        resourceType: 'connector',
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_status: 'success',
        })
      )
    })
  })

  describe('All Audit Actions', () => {
    const actions = [
      'create',
      'update',
      'delete',
      'read',
      'login',
      'logout',
      'export',
      'import',
      'approve',
      'reject',
      'restore',
    ] as const

    actions.forEach((action) => {
      it(`should handle "${action}" action`, async () => {
        await logAuditEvent({
          action,
          resourceType: 'connector',
        })

        expect(mockRpc).toHaveBeenCalledWith(
          'log_admin_action',
          expect.objectContaining({
            p_action: action,
          })
        )
      })
    })
  })

  describe('All Resource Types', () => {
    const resourceTypes = [
      'connector',
      'terminal',
      'keying_document',
      'admin_user',
      'customer_inquiry',
      'translation',
      'system_setting',
      'audit_log',
    ] as const

    resourceTypes.forEach((resourceType) => {
      it(`should handle "${resourceType}" resource type`, async () => {
        await logAuditEvent({
          action: 'read',
          resourceType,
        })

        expect(mockRpc).toHaveBeenCalledWith(
          'log_admin_action',
          expect.objectContaining({
            p_resource_type: resourceType,
          })
        )
      })
    })
  })

  describe('All Audit Statuses', () => {
    const statuses = ['success', 'failure', 'partial'] as const

    statuses.forEach((status) => {
      it(`should handle "${status}" status`, async () => {
        await logAuditEvent({
          action: 'update',
          resourceType: 'connector',
          status,
        })

        expect(mockRpc).toHaveBeenCalledWith(
          'log_admin_action',
          expect.objectContaining({
            p_status: status,
          })
        )
      })
    })
  })

  describe('Error Handling', () => {
    it('should return false when RPC call fails', async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const result = await logAuditEvent({
        action: 'create',
        resourceType: 'connector',
      })

      expect(result).toBe(false)
    })

    it('should log error when RPC call fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      mockRpc.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      await logAuditEvent({
        action: 'create',
        resourceType: 'connector',
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to log audit event:',
        { message: 'Database error' }
      )

      consoleErrorSpy.mockRestore()
    })

    it('should never throw - return false on exception', async () => {
      const mockedCreateServiceClient = createServiceClient as jest.Mock
      mockedCreateServiceClient.mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

      const result = await logAuditEvent({
        action: 'create',
        resourceType: 'connector',
      })

      expect(result).toBe(false)
    })

    it('should log error when exception occurs', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockedCreateServiceClient = createServiceClient as jest.Mock
      mockedCreateServiceClient.mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

      await logAuditEvent({
        action: 'create',
        resourceType: 'connector',
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Audit logging error:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Details Serialization', () => {
    it('should stringify details object', async () => {
      const details = {
        changes: { status: 'active', updated_at: '2025-01-01' },
        metadata: { source: 'api' },
      }

      await logAuditEvent({
        action: 'update',
        resourceType: 'connector',
        details,
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_details: JSON.stringify(details),
        })
      )
    })

    it('should handle null details', async () => {
      await logAuditEvent({
        action: 'update',
        resourceType: 'connector',
        details: undefined,
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_details: null,
        })
      )
    })

    it('should handle empty details object', async () => {
      await logAuditEvent({
        action: 'update',
        resourceType: 'connector',
        details: {},
      })

      expect(mockRpc).toHaveBeenCalledWith(
        'log_admin_action',
        expect.objectContaining({
          p_details: '{}',
        })
      )
    })
  })
})

// ============================================================================
// logConnectorChange() Tests
// ============================================================================

describe('logConnectorChange()', () => {
  it('should log connector create event', async () => {
    const result = await logConnectorChange(
      'create',
      mockResourceId,
      {
        connectorName: 'Test Connector',
        connectorCode: 'TC-001',
        changes: { status: 'active' },
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'create',
        p_resource_type: 'connector',
        p_resource_id: mockResourceId,
        p_resource_description: 'Test Connector (TC-001)',
        p_user_id: mockUserId,
      })
    )
  })

  it('should handle connector update without details', async () => {
    const result = await logConnectorChange('update', mockResourceId)

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'update',
        p_resource_type: 'connector',
        p_resource_id: mockResourceId,
        p_resource_description: null,
      })
    )
  })

  it('should handle connector delete with reason', async () => {
    const result = await logConnectorChange(
      'delete',
      mockResourceId,
      {
        connectorName: 'Test Connector',
        connectorCode: 'TC-001',
        reason: 'Deprecated',
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'delete',
        p_details: JSON.stringify({
          connectorName: 'Test Connector',
          connectorCode: 'TC-001',
          reason: 'Deprecated',
        }),
      })
    )
  })

  it('should handle connector read event', async () => {
    const result = await logConnectorChange('read', mockResourceId)

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'read',
        p_resource_type: 'connector',
      })
    )
  })
})

// ============================================================================
// logTerminalChange() Tests
// ============================================================================

describe('logTerminalChange()', () => {
  it('should log terminal create event', async () => {
    const result = await logTerminalChange(
      'create',
      mockResourceId,
      {
        terminalName: 'Test Terminal',
        terminalCode: 'TT-001',
        changes: { location: 'New York' },
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'create',
        p_resource_type: 'terminal',
        p_resource_id: mockResourceId,
        p_resource_description: 'Test Terminal (TT-001)',
        p_user_id: mockUserId,
      })
    )
  })

  it('should handle terminal update without details', async () => {
    const result = await logTerminalChange('update', mockResourceId)

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'update',
        p_resource_type: 'terminal',
        p_resource_description: null,
      })
    )
  })
})

// ============================================================================
// logUserAction() Tests
// ============================================================================

describe('logUserAction()', () => {
  it('should log user creation with full details', async () => {
    const targetUserId = 'target-user-789'
    const result = await logUserAction(
      'create',
      targetUserId,
      {
        userEmail: 'newuser@example.com',
        userRole: 'content_manager',
        changes: { is_active: true },
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'create',
        p_resource_type: 'admin_user',
        p_resource_id: targetUserId,
        p_resource_description: 'newuser@example.com (content_manager)',
        p_user_id: mockUserId,
      })
    )
  })

  it('should handle user deletion with only email', async () => {
    const targetUserId = 'target-user-789'
    const result = await logUserAction(
      'delete',
      targetUserId,
      {
        userEmail: 'deleteduser@example.com',
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'delete',
        p_resource_description: 'deleteduser@example.com',
      })
    )
  })

  it('should handle user update without details', async () => {
    const targetUserId = 'target-user-789'
    const result = await logUserAction('update', targetUserId)

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'update',
        p_resource_type: 'admin_user',
        p_resource_description: null,
      })
    )
  })
})

// ============================================================================
// logLoginAttempt() Tests
// ============================================================================

describe('logLoginAttempt()', () => {
  it('should log successful login with full details', async () => {
    const result = await logLoginAttempt(mockUserId, true, undefined, {
      email: 'user@example.com',
      method: 'password',
    })

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'login',
        p_resource_type: 'admin_user',
        p_resource_id: mockUserId,
        p_resource_description: 'user@example.com',
        p_user_id: mockUserId,
        p_status: 'success',
        p_error_message: null,
        p_details: JSON.stringify({
          email: 'user@example.com',
          method: 'password',
          success: true,
        }),
      })
    )
  })

  it('should log failed login with error message', async () => {
    const result = await logLoginAttempt(
      null,
      false,
      'Invalid credentials',
      {
        email: 'user@example.com',
        method: 'password',
      }
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'login',
        p_resource_id: null,
        p_user_id: null,
        p_status: 'failure',
        p_error_message: 'Invalid credentials',
        p_details: JSON.stringify({
          email: 'user@example.com',
          method: 'password',
          success: false,
        }),
      })
    )
  })

  it('should handle OAuth login', async () => {
    const result = await logLoginAttempt(mockUserId, true, undefined, {
      email: 'user@example.com',
      method: 'oauth',
    })

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_details: JSON.stringify({
          email: 'user@example.com',
          method: 'oauth',
          success: true,
        }),
      })
    )
  })

  it('should handle magic link login', async () => {
    const result = await logLoginAttempt(mockUserId, true, undefined, {
      email: 'user@example.com',
      method: 'magic_link',
    })

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_details: JSON.stringify({
          email: 'user@example.com',
          method: 'magic_link',
          success: true,
        }),
      })
    )
  })

  it('should handle login without additional details', async () => {
    const result = await logLoginAttempt(mockUserId, true)

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_status: 'success',
        p_details: JSON.stringify({ success: true }),
      })
    )
  })
})

// ============================================================================
// logLogoutEvent() Tests
// ============================================================================

describe('logLogoutEvent()', () => {
  it('should log manual logout', async () => {
    const result = await logLogoutEvent(mockUserId, {
      email: 'user@example.com',
      reason: 'manual',
    })

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'logout',
        p_resource_type: 'admin_user',
        p_resource_id: mockUserId,
        p_resource_description: 'user@example.com',
        p_user_id: mockUserId,
        p_details: JSON.stringify({
          email: 'user@example.com',
          reason: 'manual',
        }),
      })
    )
  })

  it('should log timeout logout', async () => {
    const result = await logLogoutEvent(mockUserId, {
      reason: 'timeout',
    })

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_details: JSON.stringify({ reason: 'timeout' }),
      })
    )
  })

  it('should log forced logout', async () => {
    const result = await logLogoutEvent(mockUserId, {
      email: 'user@example.com',
      reason: 'forced',
    })

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_details: JSON.stringify({
          email: 'user@example.com',
          reason: 'forced',
        }),
      })
    )
  })

  it('should handle logout without details', async () => {
    const result = await logLogoutEvent(mockUserId)

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'logout',
        p_resource_id: mockUserId,
      })
    )
  })
})

// ============================================================================
// logKeyingDocumentChange() Tests
// ============================================================================

describe('logKeyingDocumentChange()', () => {
  it('should log keying document creation', async () => {
    const result = await logKeyingDocumentChange(
      'create',
      mockResourceId,
      {
        documentName: 'Q1 2025 Report',
        changes: { status: 'draft' },
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'create',
        p_resource_type: 'keying_document',
        p_resource_id: mockResourceId,
        p_resource_description: 'Q1 2025 Report',
      })
    )
  })

  it('should log keying document approval', async () => {
    const result = await logKeyingDocumentChange(
      'approve',
      mockResourceId,
      {
        documentName: 'Q1 2025 Report',
        reason: 'Meets quality standards',
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'approve',
        p_resource_type: 'keying_document',
      })
    )
  })

  it('should log keying document rejection', async () => {
    const result = await logKeyingDocumentChange(
      'reject',
      mockResourceId,
      {
        documentName: 'Q1 2025 Report',
        reason: 'Incomplete data',
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'reject',
        p_details: JSON.stringify({
          documentName: 'Q1 2025 Report',
          reason: 'Incomplete data',
        }),
      })
    )
  })
})

// ============================================================================
// logDataExport() Tests
// ============================================================================

describe('logDataExport()', () => {
  it('should log CSV export with record count', async () => {
    const result = await logDataExport(
      'connector',
      {
        format: 'csv',
        recordCount: 150,
        filters: { status: 'active' },
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'export',
        p_resource_type: 'connector',
        p_resource_description: 'Exported 150 records as csv',
        p_user_id: mockUserId,
        p_details: JSON.stringify({
          format: 'csv',
          recordCount: 150,
          filters: { status: 'active' },
        }),
      })
    )
  })

  it('should log XLSX export', async () => {
    const result = await logDataExport(
      'terminal',
      {
        format: 'xlsx',
        recordCount: 75,
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_description: 'Exported 75 records as xlsx',
      })
    )
  })

  it('should log JSON export', async () => {
    const result = await logDataExport(
      'customer_inquiry',
      {
        format: 'json',
        recordCount: 200,
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_description: 'Exported 200 records as json',
      })
    )
  })

  it('should log PDF export', async () => {
    const result = await logDataExport(
      'keying_document',
      {
        format: 'pdf',
        recordCount: 10,
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_description: 'Exported 10 records as pdf',
      })
    )
  })

  it('should handle export without format or record count', async () => {
    const result = await logDataExport('connector', {}, mockUserId)

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_description: 'Exported unknown records as unknown format',
      })
    )
  })
})

// ============================================================================
// logDataImport() Tests
// ============================================================================

describe('logDataImport()', () => {
  it('should log successful CSV import', async () => {
    const result = await logDataImport(
      'connector',
      {
        format: 'csv',
        recordCount: 100,
        successCount: 100,
        errorCount: 0,
      },
      mockUserId,
      'success'
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'import',
        p_resource_type: 'connector',
        p_resource_description: 'Imported 100/100 records',
        p_status: 'success',
      })
    )
  })

  it('should log partial import with errors', async () => {
    const result = await logDataImport(
      'terminal',
      {
        format: 'xlsx',
        recordCount: 100,
        successCount: 85,
        errorCount: 15,
        errors: [{ row: 5, error: 'Invalid data' }],
      },
      mockUserId,
      'partial'
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_description: 'Imported 85/100 records',
        p_status: 'partial',
        p_details: JSON.stringify({
          format: 'xlsx',
          recordCount: 100,
          successCount: 85,
          errorCount: 15,
          errors: [{ row: 5, error: 'Invalid data' }],
        }),
      })
    )
  })

  it('should log failed import', async () => {
    const result = await logDataImport(
      'connector',
      {
        format: 'json',
        recordCount: 50,
        successCount: 0,
        errorCount: 50,
      },
      mockUserId,
      'failure'
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_description: 'Imported 0/50 records',
        p_status: 'failure',
      })
    )
  })

  it('should default to success status', async () => {
    const result = await logDataImport(
      'connector',
      {
        recordCount: 10,
        successCount: 10,
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_status: 'success',
      })
    )
  })
})

// ============================================================================
// logCustomerInquiryChange() Tests
// ============================================================================

describe('logCustomerInquiryChange()', () => {
  it('should log customer inquiry creation with full details', async () => {
    const result = await logCustomerInquiryChange(
      'create',
      mockResourceId,
      {
        customerName: 'John Doe',
        inquiryType: 'Product Question',
        changes: { status: 'open' },
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'create',
        p_resource_type: 'customer_inquiry',
        p_resource_id: mockResourceId,
        p_resource_description: 'John Doe - Product Question',
      })
    )
  })

  it('should handle inquiry with only customer name', async () => {
    const result = await logCustomerInquiryChange(
      'update',
      mockResourceId,
      {
        customerName: 'Jane Smith',
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_description: 'Jane Smith',
      })
    )
  })

  it('should handle inquiry without details', async () => {
    const result = await logCustomerInquiryChange('read', mockResourceId)

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_type: 'customer_inquiry',
        p_resource_description: null,
      })
    )
  })
})

// ============================================================================
// logSystemSettingChange() Tests
// ============================================================================

describe('logSystemSettingChange()', () => {
  it('should log system setting update with old and new values', async () => {
    const result = await logSystemSettingChange(
      'update',
      'max_upload_size',
      {
        oldValue: '10MB',
        newValue: '25MB',
        reason: 'Increased user demand',
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_action: 'update',
        p_resource_type: 'system_setting',
        p_resource_description: 'max_upload_size',
        p_details: JSON.stringify({
          oldValue: '10MB',
          newValue: '25MB',
          reason: 'Increased user demand',
        }),
      })
    )
  })

  it('should handle boolean setting changes', async () => {
    const result = await logSystemSettingChange(
      'update',
      'maintenance_mode',
      {
        oldValue: false,
        newValue: true,
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_details: JSON.stringify({
          oldValue: false,
          newValue: true,
        }),
      })
    )
  })

  it('should handle numeric setting changes', async () => {
    const result = await logSystemSettingChange(
      'update',
      'session_timeout',
      {
        oldValue: 30,
        newValue: 60,
        reason: 'Extended for better UX',
      },
      mockUserId
    )

    expect(result).toBe(true)
    expect(mockRpc).toHaveBeenCalledWith(
      'log_admin_action',
      expect.objectContaining({
        p_resource_description: 'session_timeout',
      })
    )
  })
})

// ============================================================================
// logAuditEventBatch() Tests
// ============================================================================

describe('logAuditEventBatch()', () => {
  it('should log multiple events in batch', async () => {
    const events: AuditEventParams[] = [
      {
        action: 'create',
        resourceType: 'connector',
        resourceId: 'conn-1',
        userId: mockUserId,
      },
      {
        action: 'create',
        resourceType: 'connector',
        resourceId: 'conn-2',
        userId: mockUserId,
      },
      {
        action: 'create',
        resourceType: 'terminal',
        resourceId: 'term-1',
        userId: mockUserId,
      },
    ]

    const results = await logAuditEventBatch(events)

    expect(results).toEqual([true, true, true])
    expect(mockRpc).toHaveBeenCalledTimes(3)
  })

  it('should handle batch with mixed success/failure', async () => {
    mockRpc
      .mockResolvedValueOnce({ data: null, error: null }) // Success
      .mockResolvedValueOnce({ data: null, error: { message: 'Error' } }) // Failure
      .mockResolvedValueOnce({ data: null, error: null }) // Success

    const events: AuditEventParams[] = [
      { action: 'create', resourceType: 'connector' },
      { action: 'update', resourceType: 'terminal' },
      { action: 'delete', resourceType: 'admin_user' },
    ]

    const results = await logAuditEventBatch(events)

    expect(results).toEqual([true, false, true])
  })

  it('should handle empty batch', async () => {
    const results = await logAuditEventBatch([])

    expect(results).toEqual([])
    expect(mockRpc).not.toHaveBeenCalled()
  })

  it('should handle single event in batch', async () => {
    const events: AuditEventParams[] = [
      {
        action: 'read',
        resourceType: 'connector',
        resourceId: mockResourceId,
      },
    ]

    const results = await logAuditEventBatch(events)

    expect(results).toEqual([true])
    expect(mockRpc).toHaveBeenCalledTimes(1)
  })
})
