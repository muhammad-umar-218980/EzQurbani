import axiosInstance from './axiosInstance';

// Customer functions
export const trackDelivery = async (bookingId) => {
    const response = await axiosInstance.get(`/delivery/track/${bookingId}`);
    return response.data;
};

// Admin functions
export const getPendingDeliveries = async () => {
    const response = await axiosInstance.get('/delivery/pending');
    return response.data;
};

export const getAllDeliveries = async () => {
    const response = await axiosInstance.get('/delivery');
    return response.data;
};

export const getAllAgents = async () => {
    const response = await axiosInstance.get('/delivery/agents');
    return response.data;
};

export const getDeliveryStats = async () => {
    const response = await axiosInstance.get('/delivery/stats');
    return response.data;
};

export const createMeatPackage = async (packageData) => {
    const response = await axiosInstance.post('/delivery/package', packageData);
    return response.data;
};

export const createDelivery = async (deliveryData) => {
    const response = await axiosInstance.post('/delivery', deliveryData);
    return response.data;
};

export const updateDeliveryStatus = async (id, status) => {
    const response = await axiosInstance.patch(`/delivery/${id}/status`, { status });
    return response.data;
};
