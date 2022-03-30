import api from './api';

const createInventory = async (inventoryData) => {
  try {
    const response = await api.post('/Lookup/CreateInventoryItem', inventoryData);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getInventories = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetAvailableInventory', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

module.exports = { createInventory, getInventories };