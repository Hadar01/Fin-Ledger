// src/api/userService.js

import axiosInstance from "./axiosInstance";
import uploadImage from "./uploadImage";
import { API_PATHS } from "../utlis/apiPaths";

/**
 * Upload image and register user
 * @param {File} profilePic - Profile image
 * @param {Object} userData - { fullName, email, password }
 */
export const uploadAndRegisterUser = async (imageFile, userData) => {
    try {
        const { imageUrl } = await uploadImage(profilePic);

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            ...userData,
            profileUrl: imageUrl, // Pass the image URL to backend
        });

        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};
