import Countries from '../models/Countries.js';

const countryService = {
    addCountries: async (countriesData) => {
        return await Countries.create(countriesData);
    },

    getAllCountries: async () => {
        return await Countries.find();
    },

    getCountryById: async (id) => {
        return await Countries.findById(id);
    },

    getCountryByName: async (name) => {
        return await Countries.find({ name: { $regex: name, $options: 'i' } }); // Tìm theo tên
    },

    updateCountry: async (id, updateData) => {
        return await Countries.findByIdAndUpdate(id, updateData, { new: true });
    },

    deleteCountry: async (id) => {
        return await Countries.findByIdAndDelete(id);
    },
};

export default countryService;