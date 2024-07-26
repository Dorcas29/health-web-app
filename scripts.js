const API_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('patientSection').style.display = 'block';
        fetchPatients();
    }
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('registerError').textContent = data.error;
        } else {
            alert('Registration successful');
            document.getElementById('registerForm').reset();
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('loginError').textContent = data.error;
        } else {
            localStorage.setItem('token', data.token);
            document.getElementById('loginForm').reset();
            document.getElementById('patientSection').style.display = 'block';
            fetchPatients();
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('complianceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to add a patient.');

    const patientId = document.getElementById('patientId').value;
    const patientName = document.getElementById('patientName').value;
    const medication = document.getElementById('medication').value;
    const diet = document.getElementById('diet').value;
    const initialPills = parseInt(document.getElementById('initialPills').value);
    const pillsPerDay = parseInt(document.getElementById('pillsPerDay').value);

    const isValid = validateForm(patientName, medication, diet, initialPills, pillsPerDay);
    if (!isValid) return;

    const remainingPills = initialPills;
    const compliancePercentage = 100;

    const patientData = {
        patientName,
        medication,
        diet,
        initialPills,
        pillsPerDay,
        remainingPills,
        compliancePercentage
    };

    if (patientId) {
        updatePatient(patientId, patientData, token);
    } else {
        addPatient(patientData, token);
    }

    document.getElementById('complianceForm').reset();
    document.getElementById('patientId').value = '';
});

function fetchPatients() {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            const patientList = document.getElementById('patientList');
            patientList.innerHTML = '';
            data.forEach(patient => {
                addPatientToList(patient);
            });
        })
        .catch(error => console.error('Error:', error));
}

function addPatient(patientData, token) {
    fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            fetchPatients();
        }
    })
    .catch(error => console.error('Error:', error));
}

function updatePatient(patientId, patientData, token) {
    fetch(`${API_URL}/patients/${patientId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            fetchPatients();
        }
    })
    .catch(error => console.error('Error:', error));
}

function deletePatient(patientId, token) {
    fetch(`${API_URL}/patients/${patientId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            fetchPatients();
        }
    })
    .catch(error => console.error('Error:', error));
}

function validateForm(patientName, medication, diet, initialPills, pillsPerDay) {
    let isValid = true;

    if (patientName === '') {
        showError('patientNameError', 'Patient name is required');
        isValid = false;
    } else {
        hideError('patientNameError');
    }

    if (medication === '') {
        showError('medicationError', 'Medication is required');
        isValid = false;
    } else {
        hideError('medicationError');
    }

    if (diet === '') {
        showError('dietError', 'Diet is required');
        isValid = false;
    } else {
        hideError('dietError');
    }

    if (isNaN(initialPills) || initialPills <= 0) {
        showError('initialPillsError', 'Initial pill count must be a positive number');
        isValid = false;
    } else {
        hideError('initialPillsError');
    }

    if (isNaN(pillsPerDay) || pillsPerDay <= 0) {
        showError('pillsPerDayError', 'Pills per day must be a positive number');
        isValid = false;
    } else {
        hideError('pillsPerDayError');
    }

    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

function searchContent() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    if (searchInput) {
        fetchPatients(); // Assuming patients list includes diet information
        // Implement search logic based on diet or any other criteria
    }
}

function addPatientToList(patient) {
    const patientList = document.getElementById('patientList');
    const li = document.createElement('li');
    li.textContent = `Name: ${patient.patientName}, Medication: ${patient.medication}, Diet: ${patient.diet}, Initial Pills: ${patient.initialPills}, Pills Per Day: ${patient.pillsPerDay}`;
    patientList.appendChild(li);
}

