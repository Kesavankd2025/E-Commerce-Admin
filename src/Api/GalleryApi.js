import apiClient from "../Config/Index";

class GalleryApi {
  async getGallery(params = {}) {
    try {
      const response = await apiClient.get("/banner", { params });
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }

  async createGallery(data) {
    try {
      const response = await apiClient.post("/banner", data);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }

  async updateGallery(data) {
    try {
      const response = await apiClient.put(`/banner/${data.id}`, data);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }

  async deleteGallery(id) {
    try {
      const response = await apiClient.delete(`/banner/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: true, response: response.data };
      }
    } catch (error) {
      return { status: false, response: error?.response?.data || error };
    }
  }
}

export default new GalleryApi();
