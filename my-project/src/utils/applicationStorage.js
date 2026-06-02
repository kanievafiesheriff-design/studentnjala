const STUDENT_KEY = "nunap_student";
const APPLICATIONS_KEY = "nunap_applications";

export function getStudent() {
  try {
    const data = localStorage.getItem(STUDENT_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveStudent(student) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
}

export function clearStudent() {
  localStorage.removeItem(STUDENT_KEY);
}

export function getApplications() {
  try {
    const data = localStorage.getItem(APPLICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveApplications(applications) {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

export function getStudentApplications(studentId) {
  return getApplications().filter((app) => app.studentId === studentId);
}

export function hasPendingApplication(studentId, hospitalId) {
  return getApplications().some(
    (app) =>
      app.studentId === studentId &&
      app.hospitalId === hospitalId &&
      app.status === "Pending"
  );
}

export function addApplication(application) {
  const applications = getApplications();
  applications.push(application);
  saveApplications(applications);
  return application;
}
