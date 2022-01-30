const {User} = require('../models');
const {signToken} = require('../utils/auth');
const {AuthenticationError} = require('apollo-server-express');

const resolvers = {
    Query: {
        user: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({_id: context.user._id}).select(
                    "-_v -passowrd"
                );
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        login: async (parent, {eail, password}) =>{
            const user = await User.findOne({ email});
            if(!user) {
                throw new AuthenticationError("Incorrect credentials");
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);

            return { token, user};
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user)

            return {token, user};
        },
        saveBook: async (parent, {body}, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: { savedBook: body}},
                    {new: True}
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to log in!");
        },
        removeBook: async (parent, {bookId}, context) => {
            if(!context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: bookId}}},
                    {new: true}
                );
                return updatedUser;
            }
        },
    },
};

module.exports = resolvers;