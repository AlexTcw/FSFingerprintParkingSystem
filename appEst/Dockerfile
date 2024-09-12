# Use a lightweight Node.js 18 image as the base
FROM node:18-alpine AS builder

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Configure NODE_OPTIONS for OpenSSL compatibility
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy all Angular application files to the container
COPY . .

# Build the Angular application into static files
RUN ng build --configuration=production

# Use a lightweight Nginx image as the base for serving static files
FROM nginx:alpine AS runner

# Set the working directory to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Copy the built Angular application files from the builder stage
COPY --from=builder /app/dist/app-est .

# Copy a custom Nginx configuration to listen on port 4200
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 4200
EXPOSE 4200

# Use the default Nginx configuration
CMD ["nginx", "-g", "daemon off;"]
