import apiClient from "../Config/Index";

class DashboardApi {
  async getStats() {
    try {
      const response = await apiClient.get("/admin/dashboard/stats");
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }

  async getSalesOverview(filter = "Day") {
    try {
      const response = await apiClient.get(`/admin/dashboard/sales-overview?filter=${filter}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }

  async getTopSellingProducts() {
    try {
      const response = await apiClient.get("/admin/dashboard/top-selling-products");
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }

  async getTopCustomers() {
    try {
      const response = await apiClient.get("/admin/dashboard/top-customers");
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }

  async getTopVendors() {
    try {
      const response = await apiClient.get("/admin/dashboard/top-vendors");
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }
}

export default new DashboardApi();
