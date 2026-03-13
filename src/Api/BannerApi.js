import apiClient from "../Config/Index";
import ShowNotifications from "../helper/ShowNotifications";

class BannerApi {
    async getAllBanners(page = 0, limit = 10) {
        try {
            const url = `/banner?page=${page}&limit=${limit}`;
            const response = await apiClient.get(url);
            if (response.status === 200 || response.status === 201) return { status: true, response: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to get banners.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async createBanner(data) {
        try {
            const response = await apiClient.post(`/banner`, data);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Banner added successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add banner.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async updateBanner(id, data) {
        try {
            const response = await apiClient.put(`/banner/${id}`, data);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Banner updated successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to update banner.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }

    async toggleStatus(id) {
        try {
            const response = await apiClient.patch(`/banner/status/${id}`);
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

    async deleteBanner(id) {
        try {
            const response = await apiClient.delete(`/banner/${id}`);
            if (response.status === 200 || response.status === 201) {
                ShowNotifications.showAlertNotification(response.data.message || "Banner deleted successfully!", true);
                return { status: true, response: response.data };
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete banner.";
            ShowNotifications.showAlertNotification(errorMessage, false);
            return { status: false, response: error?.response?.data || error };
        }
    }
}

export default new BannerApi();
