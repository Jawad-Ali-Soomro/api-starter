# API Starter

A file-based API starter template for Express.js with automatic route handling.

## Installation

```bash
npx @jawad-dakhan/api-starter@latest init
```

Or if you prefer the shorter command, you can also use:
```bash
npx api-starter@latest init
```

This will create a new API project in the current directory.

## Features

- **File-based routing**: Create routes by adding files in the `api` directory
- **Dynamic routes**: Support for dynamic routes using `[param].js` syntax
- **Automatic route handling**: Express routes are automatically created based on your file structure
- **Method handlers**: Export `GET`, `POST`, `PUT`, `DELETE`, etc. from your route files

## Usage

### Basic Route

Create `api/user/index.js`:

```javascript
exports.GET = (req, res) => {
    return res.json({
        status: 200,
        message: 'User route',
        data: { users: [] }
    });
};
```

This creates a `GET /user` endpoint.

### Dynamic Routes

Create `api/city/[city].js`:

```javascript
exports.GET = (req, res) => {
    return res.json({
        status: 200,
        city: req.params.city
    });
};
```

This creates a `GET /city/:city` endpoint where `:city` is available in `req.params.city`.

### Starting the Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The server runs on the port specified in your `.env` file (default: 3000).

## Project Structure

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

## License

ISC
