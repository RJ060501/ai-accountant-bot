# AI Accounting Chatbot

A full-stack AI-powered chatbot that answers accounting questions using AWS Lex V2, Amazon Bedrock, and a React frontend with a Node.js/Express backend.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js / Express
- **AI/NLP**: AWS Lex V2 (QnAIntent)
- **Knowledge Base**: Amazon Bedrock with RAG (Retrieval-Augmented Generation)
- **Storage**: Amazon S3 (knowledge base documents)
- **Auth**: AWS IAM (server-side credentials via AWS CLI)

## Architecture

```
User (React frontend :3001)
  → Express backend (:3000)
    → AWS Lex V2
      → Amazon Bedrock Knowledge Base
        → S3 (accounting documents)
```

## Prerequisites

- Node.js >= 14
- AWS CLI configured (`aws configure`)
- AWS account with the following services enabled:
  - Amazon Lex V2
  - Amazon Bedrock
  - Amazon S3
  - AWS IAM

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-accountant-bot.git
cd ai-accountant-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure AWS credentials
```bash
aws configure
```
Enter your AWS Access Key ID, Secret Access Key, and region (`us-east-1`).

### 4. Update AWS config
Edit `awsConfig.js` with your Lex bot details:
```javascript
const AWS_CONFIG = {
  region: 'us-east-1',
  lexBotName: 'YOUR_BOT_ID',
  lexBotAlias: 'TSTALIASID',
  lexBotLocaleId: 'en_US',
};
```

### 5. Run the backend
```bash
node server.js
```
Server runs on `http://localhost:3000`

### 6. Run the frontend
In a separate terminal:
```bash
npm start
```
App runs on `http://localhost:3001`

## AWS Resources

| Resource | Details |
|----------|---------|
| Lex Bot | AccountingBot (Lex V2) |
| Bot Alias | TSTALIASID (Draft) |
| Bedrock Knowledge Base | Populated from S3 bucket |
| IAM Role | Custom role with Bedrock + Lex permissions |

## Testing the Bot via CLI

```bash
aws lexv2-runtime recognize-text \
  --bot-id YOUR_BOT_ID \
  --bot-alias-id TSTALIASID \
  --locale-id en_US \
  --session-id test \
  --text "What is accounting?" \
  --region us-east-1
```

## What This Demonstrates

- Full-stack application integrating AWS AI services
- AWS Lex V2 with QnAIntent and Bedrock Knowledge Base
- RAG (Retrieval-Augmented Generation) for contextual AI responses
- Secure server-side AWS credential handling
- REST API with Express proxying requests to AWS
- React frontend consuming a custom backend API

## Project Structure

```
ai-accountant-bot/
├── src/
│   └── App.js          # React frontend
├── server
|   └── Serever.js      # Express backend
│   └── awsConfig.js
├── package.json
└── README.md
```

## Cleanup

To avoid AWS charges, remember to delete unused resources:
- S3 bucket contents and bucket
- Bedrock Knowledge Base
- Lex bot