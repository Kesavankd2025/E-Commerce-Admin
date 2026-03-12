import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class PaymentHistoryApi {
    async list(page, limit, paymentMethod = "", fromDate = "", toDate = "", search = "") {
        try {
            const url = `/payment-history/list?page=${page}&limit=${limit}&paymentMethod=${paymentMethod}&fromDate=${fromDate}&toDate=${toDate}&search=${search}`;
            const response = await apiClient.get(url);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get payment history.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new PaymentHistoryApi();
