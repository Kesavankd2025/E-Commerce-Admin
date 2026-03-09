import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class OrderFeedbackApi {
    async listReviews(page = 0, limit = 10) {
        try {
            const response = await apiClient.get(`/admin/reviews/list?page=${page}&limit=${limit}`);
            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to list reviews.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async updateReviewStatus(id, status) {
        try {
            const response = await apiClient.put(`/admin/reviews/update-status/${id}`, { status });
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

export default new OrderFeedbackApi();
