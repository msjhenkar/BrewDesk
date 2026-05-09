// WHY: axios is a library that makes HTTP request cleaner than raw fetch.
//  it automatically parses JSON, handles errors better, and lets us set base config.

import axios from "axios";


/*  WHY: we create an axios "instance" with a base url.
    Every API call made through this instance will autmatically prepend this URL/
    So instead of: axios.get("http://localhost:8080/menu") 
    we just write: api.get("/menu")
*/

const api = axios.create({
    baseURL:'http://localhost:8081',

// WHY: This header tells the Spring Boot server:
// "I am sending you JSON data, please interpret my request body as JSON"

    headers:{
        'Content-Type': 'appilcation/json',
    },
});

// ============================================================
// Each function below corresponds to one Spring Boot endpoint.
// They all return a Promise — meaning the data arrives LATER
// (because network requests take time). We use async/await to
// wait for that data before using it.
// ============================================================


// GET /menu — fetch all items
// FLOW: React calls this → axios sends GET request → Spring Boot
// returns JSON array → axios parses it → React receives the array
export const getAllMenuItems = () => api.get(`/menu`);

// GET /menu/id/:id — fetch one item by ID
// The template literal `${id}` inserts the actual number into the URL
// e.g. id=5 → GET /menu/id/5
export const getMenuItemById = (id) => api.get(`/menu/id/${id}`);

//  POST /menu/create - send new item data to create it
//  `data` is javascript object like {itemName:"Latte", price:150, category:"Coffee"}
//  axios automatically converts it to JSON string for request body 
export const createMenuItem = (data) => api.post(`/menu/create`,data)


//  PUT /menu/update/:id - update existing item
//  we send both the ID (in the URL) and the new data in the body
export const updateMenuItem = (id,data) => api.put(`/menu/update/${id}`,data);

//  DELETE /menu/delete/:id - delete by ID
//  we dont return anything
export const deleteMenuItem = (id) => api.delete(`/menu/delete/${id}`);


export const searchMenuItems = (keyword) => api.get(`/menu/search`,{ params: {keyword}});
