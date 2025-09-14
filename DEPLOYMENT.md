# EventHero Ticket Scanner - Deployment Guide

## 🚀 Production Deployment Instructions

### Prerequisites
- AWS Account with appropriate permissions
- GitHub repository access
- Domain name (optional)

## 📋 Pre-Deployment Checklist

### ✅ AWS Services Setup
- [ ] AWS Cognito User Pool created
- [ ] User Pool Client configured
- [ ] AWS AppSync API created
- [ ] DynamoDB table `SalesTickets` created
- [ ] IAM roles and policies configured

### ✅ Environment Configuration
- [ ] All environment variables documented
- [ ] API keys generated and secured
- [ ] Database schema deployed
- [ ] Test data populated (optional)

## 🔧 AWS Amplify Deployment

### Step 1: Connect Repository
1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect to GitHub repository: `BPSDynamic/eventhero-ticket-scanner`
4. Select branch: `main`

### Step 2: Configure Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Step 3: Environment Variables
Set these in Amplify Console:

```env
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_USER_POOL_ID=eu-west-1_xxxxxxxxx
NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APPSYNC_URL=https://xxxxxxxxx.appsync-api.eu-west-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_API_KEY=da2-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Deploy
1. Review configuration
2. Click "Save and deploy"
3. Wait for build completion
4. Test the deployed app

## 🔒 Security Configuration

### Cognito User Pool
```json
{
  "PasswordPolicy": {
    "MinimumLength": 8,
    "RequireUppercase": true,
    "RequireLowercase": true,
    "RequireNumbers": true,
    "RequireSymbols": true
  },
  "MfaConfiguration": "OFF",
  "UserPoolTags": {
    "Environment": "production"
  }
}
```

### AppSync API
- Enable API Key authentication
- Configure CORS for your domain
- Set up proper IAM policies

### DynamoDB
```json
{
  "TableName": "SalesTickets",
  "KeySchema": [
    {
      "AttributeName": "TicketID",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "TicketID",
      "AttributeType": "S"
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

## 📱 Mobile Configuration

### PWA Settings
The app is configured as a Progressive Web App with:
- Service worker for offline capability
- App manifest for mobile installation
- Responsive design for all screen sizes

### Camera Permissions
- Ensure HTTPS is enabled (required for camera access)
- Test camera functionality on various devices
- Provide fallback for manual ticket entry

## 🧪 Testing Checklist

### Pre-Production Tests
- [ ] User registration and login
- [ ] Event ID entry and validation
- [ ] QR code scanning functionality
- [ ] Ticket validation and admission
- [ ] Database update verification
- [ ] Duplicate ticket prevention
- [ ] Error handling and user feedback
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Load Testing
- [ ] Multiple concurrent users
- [ ] Database performance under load
- [ ] API rate limiting
- [ ] Mobile network conditions

## 📊 Monitoring Setup

### CloudWatch Metrics
- API Gateway request count and latency
- DynamoDB read/write capacity
- Cognito authentication metrics
- Application error rates

### Alerts
- High error rates (>5%)
- Authentication failures
- Database connection issues
- API timeout errors

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
name: Deploy to AWS Amplify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Amplify
        run: |
          # Add deployment commands here
```

## 🚨 Rollback Plan

### Emergency Rollback
1. Revert to previous commit in GitHub
2. Trigger new deployment in Amplify
3. Verify database integrity
4. Test critical functionality

### Database Rollback
- Use DynamoDB point-in-time recovery
- Restore from backup if needed
- Verify ticket status consistency

## 📈 Performance Optimization

### Frontend
- Enable Next.js production optimizations
- Configure CDN for static assets
- Implement proper caching strategies

### Backend
- Monitor DynamoDB performance
- Optimize GraphQL queries
- Implement connection pooling

## 🔍 Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Authentication Issues**
   - Verify Cognito configuration
   - Check environment variables
   - Test with different user accounts

3. **Database Connection**
   - Verify AppSync API configuration
   - Check IAM permissions
   - Test GraphQL queries manually

4. **Mobile Issues**
   - Test on various devices and browsers
   - Check camera permissions
   - Verify responsive design

## 📞 Support Contacts

- **Technical Issues**: Check GitHub Issues
- **AWS Support**: AWS Support Center
- **Emergency**: [Contact Information]

## 📋 Post-Deployment

### Immediate Tasks
- [ ] Test all functionality
- [ ] Verify database updates
- [ ] Check monitoring dashboards
- [ ] Update documentation

### Ongoing Maintenance
- [ ] Regular security updates
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Feature enhancements

---

**Deployment Status**: ✅ Ready for Production  
**Last Updated**: September 14, 2025  
**Version**: 1.0.0
