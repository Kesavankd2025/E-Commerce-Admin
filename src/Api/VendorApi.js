import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class VendorApi {
    async getAll(page = 0, limit = 10, search = "") {
        try {
            const url = `/vendor/list?page=${page}&limit=${limit}&search=${search}`;
            const response = await apiClient.get(url);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get data.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getById(id) {
        try {
            const response = await apiClient.get(`/vendor/details/${id}`);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get details.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async create(data) {
        try {
            const response = await apiClient.post(`/vendor/create`, data);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Vendor created successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to create.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async update(id, data) {
        try {
            const response = await apiClient.put(`/vendor/edit/${id}`, data);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Vendor updated successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async delete(id) {
        try {
            const response = await apiClient.delete(`/vendor/delete/${id}`);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Vendor deleted successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new VendorApi();
