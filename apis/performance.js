import api from './api';

const getPersonalMetrics = async (filter) => {
  try {
    const response = await api.post('/Lookup/GetPersonalMonthlyMetrics', filter);

    return response;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

module.exports = { getPersonalMetrics };