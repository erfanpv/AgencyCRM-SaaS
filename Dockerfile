# Use an official Bun runtime as a parent image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Install dependencies and wait-for-it tool
RUN apt-get update && apt-get install -y wait-for-it

# Copy the package files
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of the application files, including .env
COPY . .

# Generate the Prisma Client
RUN bunx prisma generate

# Optionally copy the .env file for build-time usage (not runtime)
COPY .env .env

# Build the project if needed
# RUN bun next build

# Expose the port that Next.js will run on
EXPOSE 3000

# Command to run the Next.js app
CMD ["bun", "run", "dev"]
