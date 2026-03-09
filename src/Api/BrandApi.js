import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class BrandApi {
  async getAll(page = 0, limit = 10, search = "") {
    try {
      const url = `/brands/list?page=${page}&limit=${limit}&search=${search}`;
      const response = await apiClient.get(url);
      if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to get data.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(`/brands/details/${id}`);
      if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to get details.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async create(data) {
    try {
      const response = await apiClient.post(`/brands/create`, data);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "Brands created successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async update(id, data) {
    try {
      const response = await apiClient.put(`/brands/edit/${id}`, data);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "Brands updated successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async delete(id) {
    try {
      const response = await apiClient.delete(`/brands/delete/${id}`);
      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message || "Brands deleted successfully!", true);
        return { status: true, response: response.data };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete.";
      ShowNotifications.showAlertNotification(errorMessage, false);
      return { status: false, response: error?.response?.data || error };
    }
  }

  async statusUpdate(id) {
    try {
      const response = await apiClient.put(`/brands/${id}/toggle-status`);
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

export default new BrandApi();
