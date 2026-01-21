# 1. Base image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the source code
COPY . .

# 6. Generate Prisma client
RUN npx prisma generate

# 7. Expose the backend port
EXPOSE 5000

# 8. Start the server
CMD ["npm", "start"]
