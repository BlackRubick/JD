// Modelo simple de almacenamiento local de solicitudes de cita (mock)
// En producción, esto sería una API real
export function getAppointmentRequests() {
  const data = localStorage.getItem('appointmentRequests');
  return data ? JSON.parse(data) : [];
}

export function addAppointmentRequest(request) {
  const current = getAppointmentRequests();
  current.push(request);
  localStorage.setItem('appointmentRequests', JSON.stringify(current));
}

export function updateAppointmentRequest(index, update) {
  const current = getAppointmentRequests();
  if (current[index]) {
    current[index] = { ...current[index], ...update };
    localStorage.setItem('appointmentRequests', JSON.stringify(current));
  }
}

export function removeAppointmentRequest(index) {
  const current = getAppointmentRequests();
  current.splice(index, 1);
  localStorage.setItem('appointmentRequests', JSON.stringify(current));
}

export function getAppointmentHistory() {
  const data = localStorage.getItem('appointmentHistory');
  return data ? JSON.parse(data) : [];
}

export function addAppointmentToHistory(entry) {
  const current = getAppointmentHistory();
  current.push(entry);
  localStorage.setItem('appointmentHistory', JSON.stringify(current));
}
