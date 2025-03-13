import axios from 'axios';
import api from '../api';

const bearerToken = "MAFqnWK5zOgnupcxw6kHqwI9kRrsIhzQ"; 

export const addUser = async (data) => {
    try {
        const response = await axios.post(api.users(), data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getUsers = async () => {
    try {
        const response = await axios.get(api.users());
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const uploadFile = async (data) => {
    const formData = new FormData();
    formData.append("file", data);

    try {
        const response = await axios.post(api.uploadFile(), formData, {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "multipart/form-data",
            },
          });
      
          return response.data;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
}


export const updateUser = async (id, data) => {
    try {
        const response = await axios.put(api.userModify(id), data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}