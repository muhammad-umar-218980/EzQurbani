import axiosInstance from './axiosInstance';

export const getDashboardStats = async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
};

export const getAdvancedReports = async () => {
    const response = await axiosInstance.get('/admin/reports');
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
};

export const getAllHouses = async () => {
    const response = await axiosInstance.get('/admin/houses');
    return response.data;
};

export const getAllButchers = async (date) => {
    const response = await axiosInstance.get('/admin/butchers', { params: { date } });
    return response.data;
};

export const createSchedule = async (scheduleData) => {
    const response = await axiosInstance.post('/admin/schedules', scheduleData);
    return response.data;
};

export const getAllSchedules = async () => {
    const response = await axiosInstance.get('/admin/schedules');
    return response.data;
};

export const getBookedAnimals = async () => {
    const response = await axiosInstance.get('/admin/booked-animals');
    return response.data;
};
