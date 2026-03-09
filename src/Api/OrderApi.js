import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class OrderApi {
    async getOrderList(page = 0, limit = 10, status = "", search = "") {
        try {
            const url = `/orders/list?page=${page}&limit=${limit}&status=${status}&search=${search}`;
            const response = await apiClient.get(url);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get orders.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getOrderDetails(id) {
        try {
            const response = await apiClient.get(`/orders/details/${id}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch order details.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async updateOrderStatus(id, status, cancelReason = null) {
        try {
            const body = { status };
            if (cancelReason) body.cancelReason = cancelReason;
            const response = await apiClient.put(`/orders/update-status/${id}`, body);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Order status updated successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update order status.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getCancelledOrderList(page = 0, limit = 10) {
        try {
            const response = await apiClient.get(`/orders/cancelled/list?page=${page}&limit=${limit}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get cancelled orders.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getReturnOrderList(page = 0, limit = 10, status = "") {
        try {
            const response = await apiClient.get(`/orders/returns/list?page=${page}&limit=${limit}&status=${status}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get return orders.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getReturnOrderDetails(id) {
        try {
            const response = await apiClient.get(`/orders/returns/details/${id}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch return order details.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async updateReturnOrderStatus(id, status) {
        try {
            const response = await apiClient.put(`/orders/returns/update-status/${id}`, { status });
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Return order status updated successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update return order status.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new OrderApi();
