# Express File-Based Routing

A file-based API starter template for Express.js with automatic route handling. Supports both **JavaScript** and **TypeScript**.

## Installation

```bash
npx express-file-based-routing@latest init
```

This will prompt you to choose between JavaScript or TypeScript, then create a new API project in the current directory.

## Features

- **File-based routing**: Create routes by adding files in the `api` directory
- **Dynamic routes**: Support for dynamic routes using `[param].js` or `[param].ts` syntax
- **Automatic route handling**: Express routes are automatically created based on your file structure
- **Method handlers**: Export `GET`, `POST`, `PUT`, `DELETE`, etc. from your route files
- **TypeScript support**: Full TypeScript support with type definitions

## Usage

### Basic Route

**JavaScript** - Create `api/user/index.js`:
```javascript
exports.GET = (req, res) => {
    return res.json({
        status: 200,
        message: 'User route',
        data: { users: [] }
    });
};
```

**TypeScript** - Create `api/user/index.ts`:
```typescript
import { Request, Response } from 'express';

export const GET = (req: Request, res: Response) => {
    return res.json({
        status: 200,
        message: 'User route',
        data: { users: [] }
    });
};
```

This creates a `GET /user` endpoint.

### Dynamic Routes

**JavaScript** - Create `api/city/[city].js`:
```javascript
exports.GET = (req, res) => {
    return res.json({
        status: 200,
        city: req.params.city
    });
};
```

**TypeScript** - Create `api/city/[city].ts`:
```typescript
import { Request, Response } from 'express';

export const GET = (req: Request, res: Response) => {
    return res.json({
        status: 200,
        city: req.params.city
    });
};
```

This creates a `GET /city/:city` endpoint where `:city` is available in `req.params.city`.

### Starting the Server

**JavaScript:**
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
```

**TypeScript:**
```bash
npm run dev        # Start development server with auto-reload (tsx watch)
npm run build      # Compile TypeScript to JavaScript
npm start          # Start production server (runs compiled code)
```

The server runs on the port specified in your `.env` file (default: 3000).

## Project Structure

**JavaScript:**
```
.
├── api/
│   └── index.js          # GET /
│   └── user/
│       └── index.js      # GET /user
│   └── city/
│       └── [city].js     # GET /city/:city
├── index.js              # Server file
├── .env                  # Environment variables
└── package.json
```

**TypeScript:**
```
.
├── api/
│   └── index.ts          # GET /
│   └── user/
│       └── index.ts      # GET /user
│   └── city/
│       └── [city].ts     # GET /city/:city
├── index.ts              # Server file
├── tsconfig.json         # TypeScript configuration
├── dist/                 # Compiled JavaScript (generated)
├── .env                  # Environment variables
└── package.json
```

## License

ISC
