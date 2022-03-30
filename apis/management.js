import api from './api';

const getSalesmen = async () => {
  try {
    const response = await api.post('/Lookup/GetSalesmanList');

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getSalesVolumeAsQuantity = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetSalesVolumeAsQuantity', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getSalesVolumeAsDollar = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetSalesVolumeAsDollar', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getSalesInProgress = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetSalesInProgress', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getFAndIProductSalesAsDollar = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetFAndIProductSalesAsDollar', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getProfitAnalysis = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetProfitAnalysis', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

module.exports = { getSalesmen, getSalesVolumeAsQuantity, getSalesVolumeAsDollar, getSalesInProgress, getFAndIProductSalesAsDollar, getProfitAnalysis };