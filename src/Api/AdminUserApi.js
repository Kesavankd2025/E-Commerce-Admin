import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class AdminUserApi {
  async getAdminUsers(params) {
    try {
      const response = await apiClient.get(`/adminUser`, { params });
      if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to get data.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async getAdminUserById(id) {
    try {
      const response = await apiClient.get(`/adminUser/${id}`);
      if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to get details.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async createAdminUser(data) {
    try {
      const response = await apiClient.post(`/adminUser`, data);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "User created successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async updateAdminUser(id, data) {
    try {
      const response = await apiClient.put(`/adminUser/${id}`, data);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "User updated successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async deleteAdminUser(id) {
    try {
      const response = await apiClient.delete(`/adminUser/${id}`);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "User deleted successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async toggleStatus(id) {
    try {
      const response = await apiClient.patch(`/adminUser/${id}/toggle-active`);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "Status updated successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update status.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }
}

export default new AdminUserApi();
