import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class ManualPaymentApi {
    async list(page = 0, limit = 10, paymentStatus = "", orderFrom = "", search = "") {
        try {
            let url = `/manual-payment/list?page=${page}&limit=${limit}`;
            if (paymentStatus) url += `&paymentStatus=${paymentStatus}`;
            if (orderFrom) url += `&orderFrom=${orderFrom}`;
            if (search) url += `&search=${search}`;
            
            const response = await apiClient.get(url);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get data.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async details(id) {
        try {
            const response = await apiClient.get(`/manual-payment/details/${id}`);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get details.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async update(data) {
        try {
            const response = await apiClient.post(`/manual-payment/update`, data);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Payment updated successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update payment.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new ManualPaymentApi();
