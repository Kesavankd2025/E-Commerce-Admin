import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class CustomerApi {
    async listCustomers(page = 0, limit = 10) {
        try {
            const response = await apiClient.get(`/admin/customers/list?page=${page}&limit=${limit}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to list customers.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getCustomerDetails(id) {
        try {
            const response = await apiClient.get(`/admin/customers/details/${id}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch details.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async updateStatus(id, isActive) {
        try {
            const response = await apiClient.put(`/admin/customers/update-status/${id}`, { isActive });
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update status.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new CustomerApi();
