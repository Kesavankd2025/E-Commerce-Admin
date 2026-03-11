import apiClient from "../Config/Index";

const VendorPaymentApi = {
    create: async (data) => {
        try {
            const response = await apiClient.post("/vendor-payment/create", data);
            return { status: true, response: response.data };
        } catch (error) {
            return { status: false, error: error.response?.data?.message || "Something went wrong" };
        }
    },
    list: async (page, limit, vendorId = "", status = "", fromDate = "", toDate = "") => {
        try {
            const response = await apiClient.get(`/vendor-payment/list?page=${page}&limit=${limit}&vendorId=${vendorId}&status=${status}&fromDate=${fromDate}&toDate=${toDate}`);
            return { status: true, response: response.data };
        } catch (error) {
            return { status: false, error: error.response?.data?.message || "Something went wrong" };
        }
    },
    getHistory: async (poId) => {
        try {
            const response = await apiClient.get(`/vendor-payment/history/${poId}`);
            return { status: true, response: response.data };
        } catch (error) {
            return { status: false, error: error.response?.data?.message || "Something went wrong" };
        }
    },
};

export default VendorPaymentApi;
