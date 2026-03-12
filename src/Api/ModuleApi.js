import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class ModuleApi {
  async getModules() {
    try {
      const response = await apiClient.get(`/module`);
      if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to get data.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }
}

export default new ModuleApi();
