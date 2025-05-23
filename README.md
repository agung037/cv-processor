# RED CV Processor

## Deployment on Render

### Prerequisites
- GitHub account
- Render account
- **Groq API Key** (Required for CV Analysis)
  - Sign up at [Groq Console](https://console.groq.com/)
  - Create and copy your API key

### Deployment Steps
1. Fork this repository to your GitHub account

2. Create Services on Render:
   a. Web Service for Backend
   - Connect to your GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `HOST`: 0.0.0.0
     - `PORT`: 10000
     - `JWT_SECRET`: Generate a secure random secret
     - **`GROQ_API_KEY`**: 
       - **IMPORTANT**: You MUST set this manually in Render
       - Go to Service > Environment
       - Add new environment variable
       - Paste your Groq API key here

   b. Static Site for Frontend
   - Connect to your GitHub repository
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

3. Configure Environment Variables
   - Set `REACT_APP_API_URL` to your backend service URL
   - **Mandatory**: Set `GROQ_API_KEY` in backend service settings

### Local Development
1. Clone the repository
2. Install dependencies
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Create a `.env` file in the root directory
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm start`

### Troubleshooting
- Ensure all environment variables are correctly set
- Check Render deployment logs for any errors
- Verify Groq API Key is valid

### Troubleshooting Groq API Key
- If CV analysis fails, verify your Groq API key
- Check [Groq Documentation](https://console.groq.com/docs) for key management
- Ensure the key has necessary permissions
- Regenerate key if authentication fails

## Technologies
- Frontend: React
- Backend: Hapi.js
- Database: SQLite
- AI Analysis: Groq API

## License
[Your License Here] 