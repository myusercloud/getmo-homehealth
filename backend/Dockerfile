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

# 6. Generate Prisma client at build time
RUN npx prisma generate

# 7. Expose the backend port
EXPOSE 5000

# 8. Run migrations THEN start server
CMD npx prisma migrate deploy && npm start

