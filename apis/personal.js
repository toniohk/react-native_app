import api from './api';

const getAppointments = async () => {
  try {
    const response = await api.post('/Lookup/GetAppointmentsList');

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const editAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/Lookup/GetEditAppointment', appointmentData);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const getTasks = async () => {
  try {
    const response = await api.post('/Lookup/GetTasksList');

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

const editTask = async (taskData) => {
  try {
    const response = await api.post('/Lookup/GetEditTask', taskData);

    return response.data;
  } catch (error) {
    console.log('error=', error);
    return error;
  }
};

module.exports = { getAppointments, editAppointment, getTasks, editTask };