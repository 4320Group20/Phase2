module.exports = {
    createUser: async (userData) => {
        const user = new userModel(userData);
        return await user.save();
    },

    getAllUsers: async () => {
        return await userModel.find();
    },

    getUserById: async (id) => {
        return await userModel.findById(id);
    },

    updateUser: async (id, newData) => {
        return await userModel.findByIdAndUpdate(id, newData, {new: true});
    },

    deleteUser: async (id) => {
        return await userModel.findByIdAndDelete(id);
    }
};