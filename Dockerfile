###############
# Build Stage #
###############
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy configuration files (if you have them)
COPY tsconfig.json ./
COPY tailwind.config.* ./
COPY postcss.config.* ./
COPY next.config.* ./

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

######################
# Production Stage   #
######################
FROM node:18-alpine AS production

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use npm start like your working service
CMD ["npm", "run", "start"]