# Use the official Node.js 20 image as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install netcat-openbsd for the wait-for script to work
RUN apk add --no-cache netcat-openbsd

# Install project dependencies
RUN npm install

# Copy the rest of your application's source code to the working directory
COPY . .

# Copy the entrypoint script and make it executable
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Expose the port the app runs on
EXPOSE 5000

# Specify the command to run on container startup
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]