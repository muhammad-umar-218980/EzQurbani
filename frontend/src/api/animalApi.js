import axiosInstance from './axiosInstance';

export const getAnimalsSummary = async () => {
    const response = await axiosInstance.get('/animals/summary');
    return response.data;
};

export const getAnimals = async (category = '') => {
    const url = category ? `/animals?category=${category}` : '/animals';
    const response = await axiosInstance.get(url);
    return response.data;
};

export const getAnimalById = async (id) => {
    const response = await axiosInstance.get(`/animals/${id}`);
    return response.data;
};

export const getAnimalHissas = async (id) => {
    const response = await axiosInstance.get(`/animals/${id}/hissas`);
    return response.data;
};
