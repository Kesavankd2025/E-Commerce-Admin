import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class ReportsApi {
    async getProductReports(params) {
        try {
            const response = await apiClient.get("/reports/product", { params });
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get product reports.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getCustomerReports(params) {
        try {
            const response = await apiClient.get("/reports/customer", { params });
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get customer reports.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getVendorReports(params) {
        try {
            const response = await apiClient.get("/reports/vendor", { params });
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get vendor reports.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getPaymentReports(params) {
        try {
            const response = await apiClient.get("/reports/payment", { params });
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get payment reports.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getSalesReports(params) {
        try {
            const response = await apiClient.get("/reports/sales", { params });
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get sales reports.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new ReportsApi();
