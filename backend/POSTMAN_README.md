# RED CV API Postman Documentation

## Overview
This Postman collection provides comprehensive documentation and testing capabilities for the RED CV API.

## Prerequisites
- Postman (latest version recommended)
- Running local backend server at `http://localhost:3000`

## Setup Instructions
1. Import Postman Collection
   - Open Postman
   - Click "Import" 
   - Select `RED_CV_Postman_Collection.json`

2. Import Environment
   - In Postman, go to Environments
   - Click "Import"
   - Select `RED_CV_Postman_Environment.json`

## Authentication
- Default Admin Credentials:
  - Username: `admin`
  - Password: `melonwater12`

## API Endpoints Categories
- Authentication
- CV Analysis
- CV History
- Admin Management

### Authentication Flow
1. Login using the "Login" endpoint
2. Copy the received JWT token
3. Set the `jwt_token` variable in the environment
4. Use this token for subsequent authenticated requests

## Environment Variables
- `base_url`: Base API endpoint
- `jwt_token`: Authentication token
- `admin_username`: Admin login username
- `admin_password`: Admin login password

## Testing Tips
- Always select the "RED CV Local Development" environment
- Ensure backend server is running before testing
- Replace placeholder values in request bodies with actual data

## Troubleshooting
- Check server logs if requests fail
- Verify JWT token is current
- Ensure correct environment is selected

## Security Notes
- Never commit actual credentials to version control
- Use environment variables for sensitive information
- Rotate credentials regularly