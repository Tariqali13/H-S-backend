module.exports = {
    getOrder: async (model, query) => {
        let orderBy = 1;
        const maxOrderBy = await model.findOne(query)
            .sort({ order_by: -1 })
            .limit(1);
        if (maxOrderBy && maxOrderBy.order_by) {
            orderBy =   maxOrderBy.order_by + 1;
            return orderBy;
        } else {
            return orderBy;
        }
    },
}
