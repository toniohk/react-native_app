import api from './api';

const getRecalls = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetRecallDetails', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const createCustomer = async (customerData) => {
  try {
    const response = await api.post('/Lookup/CreateNewCustomer', customerData);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getCustomers = async () => {
  try {
    const response = await api.post('/Lookup/GetCustomerList');

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getServiceMenus = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetServiceMenuItems', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const createNewService = async (serviceData) => {
  try {
    const response = await api.post('/Lookup/CreateNewServiceRecord', serviceData);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

module.exports = { getRecalls, createCustomer, getCustomers, getServiceMenus, createNewService };