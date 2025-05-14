# Use Node.js 18 Alpine for a lightweight base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Copy the rest of the application code
COPY . .



# Install all dependencies (including devDependencies)
RUN npm install --legacy-peer-deps


# Expose the Next.js development port
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV=development
ENV PORT=3000

# Start the Next.js development server with hot-reloading
CMD ["npm", "run", "dev"] 
