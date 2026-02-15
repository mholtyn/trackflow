## DEV Instructions
### Prerequisites
You need to set up two local PostgreSQL databases (best if you use the native OS install or Docker). One for dev, one for testing.

#### Instructions for OS PostgreSQL
0. install PostgreSQL on your OS [link](https://www.postgresql.org/download/)
1. open your terminal
2. run `psql -U [your_username] -d postgres`
3. in the interactive terminal run `CREATE DATABASE [your_local_db_name];`
4. set the connection string in `.env` according to [.env.example](.env.example)

>Don't forget the testing DB!


### Start backend server

Install `uv` [link](https://docs.astral.sh/uv/getting-started/installation/)

```bash
uv sync # install dependencies - if needed
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```
alternatively run (must be inside root)
```bash
uv run python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Check API documentation at [link](http://0.0.0.0:8000/docs)


### Start frontend server

Install `pnpm` [link](https://pnpm.io/installation)

```bash
cd frontend
pnpm install # install dependencies if needed
pnpm dev
```

### Generate API client

Restart backend if it's currently running, then:

```bash
cd frontend
pnpx @hey-api/openapi-ts -i http://localhost:8000/openapi.json -o src/client
```


### Testing

To run backend tests (from repo root; also ensure `TEST_DATABASE_URL` is set in `.env`):
```bash
uv run pytest
```


### Deploy
Install `flyctl` [link](https://fly.io/docs/flyctl/install/)

```bash
# Build the frontend first
cd frontend
VITE_API_URL=https://trackflow-app.pl pnpm build
cd ..
fly deploy
```