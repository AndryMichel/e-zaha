# Base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
FROM deps AS builder
COPY . .
# Set environment variables for production build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public/document ./public/document

# Make sure the nextjs user owns the files
RUN chown -R nextjs:nodejs /app

# Set the correct user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run the app
CMD ["node", "server.js"]