import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class InventoryApi {
    async list(page = 0, limit = 10, search = "") {
        try {
            const url = `/inventory/list?page=${page}&limit=${limit}&search=${search}`;
            const response = await apiClient.get(url);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get inventory.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new InventoryApi();
