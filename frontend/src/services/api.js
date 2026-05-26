// WHY: axios is a library that makes HTTP request cleaner than raw fetch.
//  it automatically parses JSON, handles errors better, and lets us set base config.

import axios from "axios";


/*  WHY: we create an axios "instance" with a base url.
    Every API call made through this instance will autmatically prepend this URL/
    So instead of: axios.get("http://localhost:8080/menu") 
    we just write: api.get("/menu")
*/

const api = axios.create({
    baseURL: 'http://localhost:8081',


    headers: {
        'Content-Type': 'application/json',
    },
});




export const getAllMenuItems = (pageNo = 1, pageSize = 6, sortBy = 'id', sortDir = 'asc') => api.get('/menu', { params: { pageNo, pageSize, sortBy, sortDir } });


export const getMenuItemById = (id) => api.get(`/menu/id/${id}`);


export const createMenuItem = (data) => api.post(`/menu/create`, data)


export const updateMenuItem = (id, data) => api.put(`/menu/update/${id}`, data);

export const deleteMenuItem = (id) => api.delete(`/menu/delete/${id}`);


export const searchMenuItems = (keyword) => api.get(`/menu/search`, { params: { keyword } });