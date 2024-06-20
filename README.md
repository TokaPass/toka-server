# Toka Server

> [!CAUTION]
> Here be dragons. This project is still a huge work in progress and is not ready for production use.


# Setting up developer environment
```bash
# Install dependencies
bun install

# Generate prisma schemas
bunx prisma migrate dev --name init

# Run dev server
bun index.ts
```