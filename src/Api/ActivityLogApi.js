import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class ActivityLogApi {
  async getLogs(params) {
    try {
      const response = await apiClient.get(`/auth/login-report`, { params });
      if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to get logs.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }
}

export default new ActivityLogApi();
