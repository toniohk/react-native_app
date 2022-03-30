import api from './api';

const creditPull = async (creditData) => {
  try {
    const response = await api.post('/Lookup/AuthorizeCreditPull', creditData);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getInventories = async () => {
  try {
    const response = await api.post('/Lookup/GetAvailableInventory');

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const startSale = async (saleData) => {
  try {
    const response = await api.post('/Lookup/StartASale', saleData);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getTradeInTemplate = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetTradeInTemplate', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const createTradeInItem = async (tradeData) => {
  try {
    const response = await api.post('/Lookup/CreateTradeInItem', tradeData);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

module.exports = { creditPull, getInventories, startSale, getTradeInTemplate, createTradeInItem };