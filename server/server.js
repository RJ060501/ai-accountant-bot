// New server.js file (Backend Node/Express server)
// This connects to AWS Lex V2 (since your bot uses QnAIntent, which is V2-only)
// Run with: node server.js (after npm install express @aws-sdk/client-lex-runtime-v2)
// Assumes AWS credentials are set via `aws configure` (access key, secret, region)
// No Cognito needed server-side; uses IAM directly
// In production, deploy to EC2/Lambda with IAM role instead of keys

const express = require('express');
const { LexRuntimeV2Client, RecognizeTextCommand } = require('@aws-sdk/client-lex-runtime-v2');
const cors = require('cors'); // Install cors if needed: npm install cors

// Import AWS config (from awsConfig.js) - adjust path if needed
const { AWS_CONFIG } = require('./awsConfig'); // Use botId as lexBotName, botAliasId as lexBotAlias

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend to connect (e.g., from localhost:3001 if React dev server)

// AWS Lex V2 Client - credentials auto-loaded from ~/.aws/credentials
const client = new LexRuntimeV2Client({ region: AWS_CONFIG.region });

// POST /ask route to handle Lex calls
app.post('/ask', async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'No text provided' });

  const params = {
    botId: AWS_CONFIG.lexBotName,       // Treat as botId (from Lex console)
    botAliasId: AWS_CONFIG.lexBotAlias, // e.g., 'TSTALIASID' or published alias
    localeId: 'en_US',                  // Match your bot's language
    sessionId: 'chatbot-user-' + Date.now().toString(), // Unique per session
    text: text,
  };

  try {
    const command = new RecognizeTextCommand(params);
    const response = await client.send(command);
    const reply = response.messages?.[0]?.content || 'No response from bot';
    res.json({ reply });
  } catch (error) {
    console.error('Lex error:', error);
    res.status(500).json({ error: 'Sorry, there was an error with the bot.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});