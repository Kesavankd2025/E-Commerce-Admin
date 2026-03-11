import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class PurchaseApi {
    async getAll(page = 0, limit = 10, filters = {}) {
        try {
            const { vendorId, productId, fromDate, toDate } = filters;
            let url = `/purchase/list?page=${page}&limit=${limit}`;
            if (vendorId) url += `&vendorId=${vendorId}`;
            if (productId) url += `&productId=${productId}`;
            if (fromDate) url += `&fromDate=${fromDate}`;
            if (toDate) url += `&toDate=${toDate}`;

            const response = await apiClient.get(url);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            ShowNotifications.showAlertNotification(error?.response?.data?.message || "Failed to get data.", false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getById(id) {
        try {
            const response = await apiClient.get(`/purchase/details/${id}`);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            ShowNotifications.showAlertNotification(error?.response?.data?.message || "Failed to get details.", false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async create(data) {
        try {
            const response = await apiClient.post(`/purchase/create`, data);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification("Purchase order created successfully", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            ShowNotifications.showAlertNotification(error?.response?.data?.message || "Failed to create.", false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async updateReceived(id, data) {
        try {
            const response = await apiClient.put(`/purchase/update-received/${id}`, data);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification("Stock markings updated", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            ShowNotifications.showAlertNotification(error?.response?.data?.message || "Failed to update stock.", false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new PurchaseApi();
