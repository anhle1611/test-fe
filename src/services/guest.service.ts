import axios from 'axios';
import { GuestRequest, UpdateGuestRequest } from "../dto/request/guest-request.dto";
import { API_URL } from "../utils/url";

export const list = async (guestRequest: GuestRequest, accessToken: string) =>{
    try {
        const response = await axios.get(`${API_URL}/guest/list`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            params: guestRequest
        });
    
        if (response.status !== 200) {
            throw new Error(response.data);
        }
    
        return response.data;
    } catch (error) {
        return {}
    }
};

export const update = async (id: number, updateGuestRequest: object, accessToken: string): Promise<any> =>{
    return await axios.put(`${API_URL}/guest/update/${id}`,updateGuestRequest, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    }).catch(error => error.response);

};

export const destroy = async (id: number, accessToken: string): Promise<any> => {
    return await axios.delete(`${API_URL}/guest/delete/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    }).catch(error => error.response);
};