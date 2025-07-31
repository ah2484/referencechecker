# Deployment Guide

This guide covers different deployment options for the Reference Validator application.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications with zero configuration.

#### Prerequisites

- GitHub account
- Vercel account
- Service accounts (Supabase, Clerk, Resend, OpenAI)

#### Steps

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone
   git clone https://github.com/your-username/reference-validator.git
   cd reference-validator
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your forked repository

3. **Configure environment variables**
   In the Vercel dashboard, add the following environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Reference Validator
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Your app will be available at `https://your-project.vercel.app`

5. **Set up custom domain (optional)**
   - In Vercel dashboard, go to "Settings" → "Domains"
   - Add your custom domain
   - Update DNS records as instructed

### Netlify

Netlify is another excellent option for static site deployment.

#### Steps

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"

2. **Configure build settings**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

3. **Add environment variables**
   - Go to "Site settings" → "Environment variables"
   - Add all required environment variables

4. **Deploy**
   - Netlify will automatically deploy on every push to main branch

## 🐳 Docker Deployment

### Local Docker Setup

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app

   # Install dependencies based on the preferred package manager
   COPY package.json package-lock.json* ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .

   # Next.js collects completely anonymous telemetry data about general usage.
   # Learn more here: https://nextjs.org/telemetry
   # Uncomment the following line in case you want to disable telemetry during the build.
   ENV NEXT_TELEMETRY_DISABLED 1

   RUN npm run build

   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV production
   # Uncomment the following line in case you want to disable telemetry during runtime.
   ENV NEXT_TELEMETRY_DISABLED 1

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public

   # Set the correct permission for prerender cache
   RUN mkdir .next
   RUN chown nextjs:nodejs .next

   # Automatically leverage output traces to reduce image size
   # https://nextjs.org/docs/advanced-features/output-file-tracing
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000

   ENV PORT 3000
   # set hostname to localhost
   ENV HOSTNAME "0.0.0.0"

   # server.js is created by next build from the standalone output
   # https://nextjs.org/docs/pages/api-reference/next-config-js/output
   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
         - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
         - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
         - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
         - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
         - RESEND_API_KEY=${RESEND_API_KEY}
         - FROM_EMAIL=${FROM_EMAIL}
         - FROM_NAME=${FROM_NAME}
         - OPENAI_API_KEY=${OPENAI_API_KEY}
       env_file:
         - .env.production
   ```

3. **Build and run**
   ```bash
   # Build the image
   docker build -t reference-validator .

   # Run with docker-compose
   docker-compose up -d

   # Or run directly
   docker run -p 3000:3000 --env-file .env.production reference-validator
   ```

### Production Docker Deployment

#### Using Docker Swarm

1. **Initialize Docker Swarm**
   ```bash
   docker swarm init
   ```

2. **Deploy the stack**
   ```bash
   docker stack deploy -c docker-compose.yml reference-validator
   ```

#### Using Kubernetes

1. **Create deployment.yaml**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: reference-validator
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: reference-validator
     template:
       metadata:
         labels:
           app: reference-validator
       spec:
         containers:
         - name: reference-validator
           image: reference-validator:latest
           ports:
           - containerPort: 3000
           env:
           - name: NODE_ENV
             value: "production"
           - name: NEXT_PUBLIC_SUPABASE_URL
             valueFrom:
               secretKeyRef:
                 name: app-secrets
                 key: supabase-url
           # Add other environment variables...
   ```

2. **Create service.yaml**
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: reference-validator-service
   spec:
     selector:
       app: reference-validator
     ports:
     - protocol: TCP
       port: 80
       targetPort: 3000
     type: LoadBalancer
   ```

3. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   ```

## ☁️ Cloud Platform Deployment

### AWS

#### Using AWS ECS

1. **Create ECS cluster**
   ```bash
   aws ecs create-cluster --cluster-name reference-validator
   ```

2. **Create task definition**
   ```json
   {
     "family": "reference-validator",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "reference-validator",
         "image": "your-ecr-repo/reference-validator:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           }
         ]
       }
     ]
   }
   ```

3. **Deploy to ECS**
   ```bash
   aws ecs register-task-definition --cli-input-json file://task-definition.json
   aws ecs create-service --cluster reference-validator --service-name reference-validator-service --task-definition reference-validator
   ```

#### Using AWS App Runner

1. **Connect your repository**
   - Go to AWS App Runner console
   - Connect your GitHub repository
   - Configure build settings

2. **Set environment variables**
   - Add all required environment variables in the App Runner console

3. **Deploy**
   - App Runner will automatically build and deploy your application

### Google Cloud Platform

#### Using Cloud Run

1. **Build and push to Container Registry**
   ```bash
   # Build the image
   docker build -t gcr.io/your-project/reference-validator .

   # Push to Container Registry
   docker push gcr.io/your-project/reference-validator
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy reference-validator \
     --image gcr.io/your-project/reference-validator \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production
   ```

### Azure

#### Using Azure Container Instances

1. **Build and push to Azure Container Registry**
   ```bash
   # Build the image
   docker build -t yourregistry.azurecr.io/reference-validator .

   # Push to Azure Container Registry
   docker push yourregistry.azurecr.io/reference-validator
   ```

2. **Deploy to Container Instances**
   ```bash
   az container create \
     --resource-group your-resource-group \
     --name reference-validator \
     --image yourregistry.azurecr.io/reference-validator \
     --dns-name-label reference-validator \
     --ports 3000 \
     --environment-variables NODE_ENV=production
   ```

## 🔧 Self-Hosting

### Traditional Server Deployment

#### Prerequisites

- Ubuntu 20.04+ server
- Node.js 18+
- Nginx
- PM2 (for process management)

#### Steps

1. **Set up the server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Clone and set up the application**
   ```bash
   # Clone the repository
   git clone https://github.com/your-org/reference-validator.git
   cd reference-validator

   # Install dependencies
   npm install

   # Build the application
   npm run build

   # Set up environment variables
   cp env.example .env.production
   # Edit .env.production with your values
   ```

3. **Configure PM2**
   ```bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << 'EOF'
   module.exports = {
     apps: [{
       name: 'reference-validator',
       script: 'npm',
       args: 'start',
       cwd: '/path/to/reference-validator',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF

   # Start the application
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/reference-validator
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/reference-validator /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Set up SSL with Let's Encrypt**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y

   # Get SSL certificate
   sudo certbot --nginx -d your-domain.com

   # Set up auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 🔒 Security Considerations

### Environment Variables

- Never commit sensitive environment variables to version control
- Use environment-specific files (`.env.production`, `.env.staging`)
- Rotate API keys regularly
- Use secrets management services in production

### SSL/TLS

- Always use HTTPS in production
- Set up proper SSL certificates
- Configure security headers
- Enable HSTS

### Database Security

- Use connection pooling
- Implement proper access controls
- Regular backups
- Monitor for suspicious activity

### Application Security

- Keep dependencies updated
- Implement rate limiting
- Use proper authentication and authorization
- Regular security audits

## 📊 Monitoring and Logging

### Application Monitoring

- Set up health checks
- Monitor application performance
- Track error rates
- Set up alerts

### Logging

- Implement structured logging
- Centralize log collection
- Set up log rotation
- Monitor for errors

### Performance Monitoring

- Track response times
- Monitor resource usage
- Set up performance alerts
- Regular performance reviews

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploy to production"
  only:
    - main
```

## 🆘 Troubleshooting

### Common Issues

1. **Build failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment variable issues**
   - Verify all required variables are set
   - Check variable names and values
   - Ensure proper escaping

3. **Database connection issues**
   - Verify database credentials
   - Check network connectivity
   - Ensure database is running

4. **Performance issues**
   - Monitor resource usage
   - Check for memory leaks
   - Optimize database queries

### Getting Help

- Check the [GitHub Issues](https://github.com/your-org/reference-validator/issues)
- Review the [documentation](./README.md)
- Ask questions in [GitHub Discussions](https://github.com/your-org/reference-validator/discussions)

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS Documentation](https://aws.amazon.com/documentation/)
- [Google Cloud Documentation](https://cloud.google.com/docs/)
- [Azure Documentation](https://docs.microsoft.com/azure/) 