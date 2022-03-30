import api from './api';

const getParts = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetPartsList', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getPartDetails = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetPartDetails', filter);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

module.exports = { getParts, getPartDetails };