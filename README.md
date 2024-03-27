# Teslo Shop

This is an online store project to learn next 14

## Set up project

1. Clone this repository.

2. Create a copy from env.template file and put your environment variables.

3. Install dependencies.

```
npm install
```

4. Set up the database.

```
docker compose up -d
```

5. Execute seed

```
npm run seed
```

6. Run prisma migrations

```
npx prisma migrate dev
```

7. Remove localStorage to prevent errors

8. Run project

```
npm run dev
```
