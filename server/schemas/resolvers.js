const resolvers = {
    Query: {
        user: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne()
            }
            return 'Hello World';
        }
    }
};

module.exports = resolvers;