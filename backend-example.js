/**
 * Example OpenClaw Backend Integration
 * 
 * This is a reference implementation for connecting the voice chat frontend
 * to OpenClaw. Deploy this as a simple Node.js/Express server.
 * 
 * The frontend will POST to /api/chat with messages and receive responses.
 */

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * POST /api/chat
 * 
 * Request body:
 * {
 *   "messages": [
 *     { "role": "user", "content": "Hello" },
 *     { "role": "assistant", "content": "Hi there!" }
 *   ],
 *   "model": "claude-haiku"
 * }
 * 
 * Response:
 * {
 *   "response": "Generated response text"
 * }
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'No messages provided' });
        }

        // TODO: Integrate with OpenClaw via WebSocket, HTTP, or direct agent API
        // Example using environment variable for gateway URL:
        // const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:9999';

        // For now, return a mock response
        const lastMessage = messages[messages.length - 1].content;
        const mockResponse = `I heard: "${lastMessage}". Real OpenClaw integration pending.`;

        res.json({ response: mockResponse });
    } catch (error) {
        console.error('Error in /api/chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OpenClaw Voice Chat Backend listening on port ${PORT}`);
    console.log(`Frontend can reach: http://localhost:${PORT}/api/chat`);
});
