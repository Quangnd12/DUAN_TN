// src/services/mixService.js
import request from "config";
import { store } from "../redux/store";
import { addNotification } from "../redux/slice/notificationSlice";

const dispatchNotification = (message, type = "default") => {
    store.dispatch(addNotification({ message, type }));
};

const getMixes = async (page, limit, searchTitle) => {
    let path = "/api/mixes";
    let query = [];

    if (page && limit) {
        query.push(`page=${page}`);
        query.push(`limit=${limit}`);
    }

    if (searchTitle) {
        query.push(`searchTitle=${encodeURIComponent(searchTitle)}`);
    }

    if (query.length > 0) {
        path += `?${query.join("&")}`;
    }

    const res = await request({
        method: "GET",
        path: path,
    });

    return res;
};

const getMixById = async (id) => {
    const res = await request({
        method: "GET",
        path: `/api/mixes/${id}`,
    });
    return res;
};

const createMix = async (mixData) => {
    try {
        const res = await request({
            method: "POST",
            path: "/api/mixes",
            data: mixData,
        });
        dispatchNotification("Mix created successfully", "success");
        return res;
    } catch (error) {
        dispatchNotification("Failed to create mix", "error");
        throw error;
    }
};

const updateMixSettings = async (id, settings) => {
    try {
        const res = await request({
            method: "PUT",
            path: `/api/mixes/${id}`,
            data: settings,
        });
        dispatchNotification("Mix settings updated successfully", "success");
        return res;
    } catch (error) {
        dispatchNotification("Failed to update mix settings", "error");
        throw error;
    }
};

const deleteMix = async (id) => {
    try {
        const res = await request({
            method: "DELETE",
            path: `/api/mixes/${id}`,
        });
        dispatchNotification("Mix deleted successfully", "success");
        return res;
    } catch (error) {
        dispatchNotification("Failed to delete mix", "error");
        throw error;
    }

};

export { getMixes, getMixById, createMix, updateMixSettings, deleteMix};