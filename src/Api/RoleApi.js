import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class RoleApi {
  async getRoles(params) {
    try {
      const response = await apiClient.get(`/role/list`, { params });
      if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to get data.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async getRoleById(id) {
    try {
      const response = await apiClient.get(`/role/${id}`);
      if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to get details.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async createRole(data) {
    try {
      const response = await apiClient.post(`/role`, data);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "Role created successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async updateRole(id, data) {
    try {
      const response = await apiClient.put(`/role/${id}`, data);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "Role updated successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async deleteRole(id) {
    try {
      const response = await apiClient.delete(`/role/${id}`);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "Role deleted successfully!", true);
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
      const response = await apiClient.patch(`/role/${id}/toggle-active`);
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

export default new RoleApi();
