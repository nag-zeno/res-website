const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Prisma errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Conflict',
            message: 'A record with this value already exists',
            field: err.meta?.target?.[0]
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Not Found',
            message: 'Record not found'
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            errors: err.errors
        });
    }

    // Default error
    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message || 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
