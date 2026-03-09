import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class ShippingMethodApi {
    async save(data) {
        try {
            const response = await apiClient.post(`/shipping-methods/save`, data);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Shipping method saved successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to save.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getActive() {
        try {
            const response = await apiClient.get(`/shipping-methods/get-active`);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get active method.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getAll() {
        try {
            const response = await apiClient.get(`/shipping-methods/get-all`);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get all methods.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new ShippingMethodApi();
