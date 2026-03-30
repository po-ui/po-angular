/**
 * @po-ui/mcp — MCP Server para documentação do PO UI
 *
 * Configuração (claude_desktop_config.json / cursor settings):
 * {
 *   "mcpServers": {
 *     "po-ui": {
 *       "command": "npx",
 *       "args": ["-y", "@po-ui/mcp"]
 *     }
 *   }
 * }
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server';

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  process.stderr.write(`[po-ui-mcp] Erro fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
