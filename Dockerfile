FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
# Note: In a real prod scenario we might want to prune devDeps, 
# but we need typescript devDep for some setups or if we were building.
# Since we are using --experimental-strip-types, we just need the runtime.
# However, purely running 'npm ci --only=production' might exclude typescript if it's in devDeps.
# But 'node --experimental-strip-types' handles TS syntax natively (stripping it), so we DON'T need 'typescript' package at runtime!
# We just need 'express' and 'qrcode'.
RUN npm install

COPY . .

EXPOSE 3003

# Run using ts-node which we know works with the current setup
CMD ["npx", "ts-node", "server.ts"]
