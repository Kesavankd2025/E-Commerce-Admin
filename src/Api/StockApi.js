import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class StockApi {
    async updateManual(data) {
        try {
            const response = await apiClient.post("/stock/update-manual", data);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update stock.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async getLogs(productId = "", page = 0, limit = 10) {
        try {
            const url = `/stock/logs?productId=${productId}&page=${page}&limit=${limit}`;
            const response = await apiClient.get(url);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get stock logs.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new StockApi();
