exports.handler = (req, res) => {
    return res.json({
        status: 200,
        message: `Index route handler`,
        data: {
            message: 'Hello World'
        }
    });
};