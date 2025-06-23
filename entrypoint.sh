#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Copy the .env.example to .env
# cp .env.example .env

# Fill .env file from the values in the original .env.txt
# This is a basic example; for production, consider a more secure way to handle secrets
# Note: This assumes the structure of .env.example and the provided .env are compatible.
echo "HOST=0.0.0.0" >> .env
echo "PORT=5000" >> .env
echo "PGHOST=db" >> .env
echo "PGUSER=zenmachi" >> .env
echo "PGDATABASE=forumapi" >> .env
echo "PGPASSWORD=183492765" >> .env
echo "PGPORT=5432" >> .env
echo "PGHOST_TEST=db" >> .env
echo "PGUSER_TEST=zenmachi" >> .env
echo "PGDATABASE_TEST=forumapi_test" >> .env
echo "PGPASSWORD_TEST=183492765" >> .env
echo "PGPORT_TEST=5432" >> .env
echo "ACCESS_TOKEN_KEY=8b7b4ef375716ab08b2a3951b29d52fc00b1c855f9d1a847229b8c5935bef56d9d271e76a9cf08e614300395c3b90ebe559cf968a0741b18c9505549394b2c70" >> .env
echo "REFRESH_TOKEN_KEY=5078605e074a462b1460608fcbe0d0963c644402e04ad334455ff5a856cb43fd99825861dde02957d5e3184c90c532ca7d0249df20fe93d535632f3d11be7bad" >> .env
echo "ACCESS_TOKEN_AGE=3000" >> .env

# Wait for the database to be ready
# We'll use a simple loop and `nc` (netcat) to check if the port is open.
# The `db` hostname is available because of Docker's internal networking.
echo "Waiting for postgres..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Run database migrations
echo "Running migrations..."
npm run migrate up # Make sure you have a "migrate:up" script in your package.json

# Start the main application
echo "Starting server..."
npm run start
