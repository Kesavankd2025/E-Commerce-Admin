import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class PosApi {
    async searchCustomers(search) {
        try {
            const response = await apiClient.get(`/admin/pos/customers/search?search=${search}`);
            return { status: true, response: response.data };
        } catch (error) {
            return { status: false, response: error?.response?.data || error };
        }
    }

    async addCustomer(data) {
        try {
            const response = await apiClient.post(`/admin/pos/customers/add`, data);
            if (response.status === 201) {
                ShowNotifications.showAlertNotification("Customer added successfully", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            ShowNotifications.showAlertNotification(error?.response?.data?.message || "Error adding customer", false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async searchProducts(search) {
        try {
            const response = await apiClient.get(`/admin/pos/products/search?search=${search}`);
            return { status: true, response: response.data };
        } catch (error) {
            return { status: false, response: error?.response?.data || error };
        }
    }

    async createOrder(data) {
        try {
            const response = await apiClient.post(`/admin/pos/orders/create`, data);
            if (response.status === 201) {
                ShowNotifications.showAlertNotification("POS Order created successfully", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            ShowNotifications.showAlertNotification(error?.response?.data?.message || "Error creating POS order", false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getPosHistory(page = 0, limit = 10) {
        try {
            const response = await apiClient.get(`/admin/pos/orders/history?page=${page}&limit=${limit}`);
            return { status: true, response: response.data };
        } catch (error) {
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new PosApi();
