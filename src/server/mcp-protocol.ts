import { ALL_MCP_TOOLS } from './tools-catalog.js';
import { QboService } from './qbo-service.js';
import { companyManager } from './company-manager.js';
import { auditLogger } from './audit-logger.js';
import { JsonRpcRequest, JsonRpcResponse } from '../types/mcp.js';

export class McpProtocolHandler {
  public static handleJsonRpc(req: JsonRpcRequest, clientIp = '127.0.0.1'): JsonRpcResponse {
    const { id, method, params } = req;

    try {
      switch (method) {
        case 'initialize': {
          return {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              serverInfo: {
                name: 'quickbooks-online-mcp-server',
                version: '2.4.0',
                description: 'Enterprise Model Context Protocol Server for QuickBooks Online with 120 accounting and financial intelligence tools.'
              },
              capabilities: {
                tools: {
                  listChanged: false
                },
                prompts: {},
                resources: {},
                logging: {}
              }
            }
          };
        }

        case 'notifications/initialized': {
          return {
            jsonrpc: '2.0',
            id,
            result: {}
          };
        }

        case 'ping': {
          return {
            jsonrpc: '2.0',
            id,
            result: {}
          };
        }

        case 'tools/list': {
          const categoryFilter = params?.category;
          let tools = ALL_MCP_TOOLS;
          if (categoryFilter) {
            tools = tools.filter(t => t.category === categoryFilter);
          }

          return {
            jsonrpc: '2.0',
            id,
            result: {
              tools: tools.map(t => ({
                name: t.name,
                description: t.description,
                inputSchema: t.inputSchema,
                category: t.category,
                isDestructive: Boolean(t.isDestructive),
                requiresAdmin: Boolean(t.requiresAdmin)
              }))
            }
          };
        }

        case 'tools/call': {
          const toolName = params?.name;
          const args = params?.arguments || {};
          const toolDef = ALL_MCP_TOOLS.find(t => t.name === toolName);

          if (!toolDef) {
            return {
              jsonrpc: '2.0',
              id,
              error: {
                code: -32601,
                message: `Method or tool not found: ${toolName}`
              }
            };
          }

          // Resolve targeted company
          const targetCompanyId = args.company_id || companyManager.getActiveCompany().id;
          const targetCompany = companyManager.getCompany(targetCompanyId) || companyManager.getActiveCompany();

          // Security check 1: RBAC role
          if (toolDef.isDestructive || toolDef.category === 'Sales & Accounts Receivable' || toolDef.category === 'Purchasing & Accounts Payable') {
            if (targetCompany.role === 'read_only') {
              auditLogger.log({
                toolName,
                category: toolDef.category,
                companyId: targetCompany.id,
                companyName: targetCompany.name,
                actor: `MCP Client (${clientIp})`,
                status: 'blocked_by_safety',
                durationMs: 4,
                inputPayload: args,
                summary: `Access Denied: Company ${targetCompany.name} is configured as Read-Only.`,
                isDestructive: Boolean(toolDef.isDestructive)
              });

              return {
                jsonrpc: '2.0',
                id,
                result: {
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify({
                        error: 'RBAC_PERMISSION_DENIED',
                        message: `Action denied. Company "${targetCompany.name}" is set to Read-Only mode. Write operations are restricted.`
                      }, null, 2)
                    }
                  ],
                  isError: true
                }
              };
            }
          }

          // Security check 2: Safe Mode enforcement on destructive tools (e.g. void, delete)
          if (toolDef.isDestructive && companyManager.isSafeMode()) {
            auditLogger.log({
              toolName,
              category: toolDef.category,
              companyId: targetCompany.id,
              companyName: targetCompany.name,
              actor: `MCP Client (${clientIp})`,
              status: 'blocked_by_safety',
              durationMs: 6,
              inputPayload: args,
              summary: `Blocked by Safe Mode: Destructive action "${toolName}" requires Safe Mode disarmed.`,
              isDestructive: true
            });

            return {
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      error: 'DESTRUCTIVE_ACTION_BLOCKED',
                      message: `Safety Block: "${toolName}" is flagged as a destructive accounting action (e.g., void/delete). Safe Mode is currently ENABLED on this server. To execute, disarm Safe Mode in the QBO MCP control panel or provide verified administrative confirmation.`
                    }, null, 2)
                  }
                ],
                isError: true
              }
            };
          }

          // Execution
          const startTime = Date.now();
          try {
            const data = QboService.executeTool(toolName, { ...args, company_id: targetCompany.id });
            const durationMs = Date.now() - startTime;

            auditLogger.log({
              toolName,
              category: toolDef.category,
              companyId: targetCompany.id,
              companyName: targetCompany.name,
              actor: `MCP Client (${clientIp})`,
              status: 'success',
              durationMs,
              inputPayload: args,
              summary: `Executed successfully in ${durationMs}ms against ${targetCompany.name}.`,
              isDestructive: Boolean(toolDef.isDestructive)
            });

            return {
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(data, null, 2)
                  }
                ]
              }
            };
          } catch (execErr: any) {
            const durationMs = Date.now() - startTime;
            auditLogger.log({
              toolName,
              category: toolDef.category,
              companyId: targetCompany.id,
              companyName: targetCompany.name,
              actor: `MCP Client (${clientIp})`,
              status: 'failure',
              durationMs,
              inputPayload: args,
              summary: `Execution Error: ${execErr?.message || 'Unknown error'}`,
              isDestructive: Boolean(toolDef.isDestructive)
            });

            return {
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      error: 'EXECUTION_FAILURE',
                      message: execErr?.message || 'Error executing QBO tool.'
                    }, null, 2)
                  }
                ],
                isError: true
              }
            };
          }
        }

        default:
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Unknown JSON-RPC method: ${method}`
            }
          };
      }
    } catch (globalErr: any) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: `Internal MCP Server Error: ${globalErr?.message || 'Unexpected failure'}`
        }
      };
    }
  }
}
