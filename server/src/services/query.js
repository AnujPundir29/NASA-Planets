function getPagination(query) {
    const limit = Math.abs(query.limit) || 0;
    const page = Math.abs(query.page) || 1;
    const skip = limit * (page - 1);
    return {
        skip,
        limit
    };
}

module.exports = {
    getPagination
};