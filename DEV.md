## DEV

### Start server

Install `uv` [link](https://docs.astral.sh/uv/getting-started/installation/)

```bash
uv sync # install depedencies - if needed
uv run uvicorn app:main.app --host 0.0.0.0 --port 8000
```
alternatively run (must be inside root)
```bash
uv run python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Check API documentation at [link](http://0.0.0.0:8000/docs)


### Start frontend

Install `pnpm` [link](https://pnpm.io/installation)

```bash
cd frontend
pnpm install # install deps if needed
pnpm dev
```


### Generate API client

```bash
cd frontend
pnpx @hey-api/openapi-ts -i http://localhost:8000/openapi.json -o src/client
```