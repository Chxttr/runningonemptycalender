document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const form = document.getElementById('event-form');
    const availabilityForm = document.getElementById('availability-form');
    const monthYearDisplay = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const startTimeSelect = document.getElementById('start-time');
    const endTimeSelect = document.getElementById('end-time');
    const statusSelect = document.getElementById('status');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const calendarContainer = document.getElementById('calendar-container');
    const logoutButton = document.getElementById('logout-button');
    const showRegisterFormButton = document.getElementById('show-register-form');
    const showLoginFormButton = document.getElementById('show-login-form');
    const authContainer = document.getElementById('auth-container');

    let currentDate = new Date();
    let currentSelectedDate = null;

    function populateTimeSelect(select) {
        for (let hour = 0; hour < 24; hour++) {
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = `${hour}:00`;
            select.appendChild(option);
        }
    }

    populateTimeSelect(startTimeSelect);
    populateTimeSelect(endTimeSelect);

    function renderCalendar() {
        calendar.innerHTML = '';
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startDay = firstDayOfMonth.getDay();
        
        monthYearDisplay.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            calendar.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');

            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const today = new Date();

            dayElement.textContent = day;
            if (cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                dayElement.classList.add('disabled-day');
            } else {
                dayElement.addEventListener('click', (event) => {
                    if (event.target.tagName !== 'BUTTON') {
                        currentSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        showForm();
                    }
                });
            }

            calendar.appendChild(dayElement);
        }

        loadAvailabilities();
    }

    function loadAvailabilities() {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const currentDate = new Date().getDate();
        fetch(`get_availabilities.php?month=${month}&year=${year}`)
            .then(response => response.json())
            .then(data => {
                const availabilityMap = {};

                data.forEach(availability => {
                    const day = new Date(availability.date).getDate();
                    if (day < currentDate) {
                        deleteAvailability(availability.id);
                    } else {
                        if (!availabilityMap[day]) {
                            availabilityMap[day] = [];
                        }
                        availabilityMap[day].push(availability);
                    }
                });

                for (const day in availabilityMap) {
                    const dayElements = document.querySelectorAll('.calendar-day');
                    const dayElement = Array.from(dayElements).find(el => el.textContent == day);
                    if (dayElement) {
                        availabilityMap[day].forEach(availability => {
                            const infoElement = document.createElement('div');
                            infoElement.textContent = `${availability.name}: ${availability.start_time}:00 - ${availability.end_time}:00 (${availability.status})`;
                            infoElement.classList.add('info');

                            if (availability.status === 'Vrij') {
                                infoElement.classList.add('vrij');
                            } else if (availability.status === 'Niet vrij') {
                                infoElement.classList.add('niet-vrij');
                            } else if (availability.status === 'Nog niet zeker') {
                                infoElement.classList.add('niet-zeker');
                            }

                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = 'Delete';
                            deleteButton.addEventListener('click', (event) => {
                                event.stopPropagation();
                                console.log(`Deleting availability ID: ${availability.id}`);
                                deleteAvailability(availability.id);
                            });

                            infoElement.appendChild(deleteButton);
                            dayElement.appendChild(infoElement);
                        });
                    }
                }
            })
            .catch(error => console.error('Error loading availabilities:', error));
    }

    function deleteAvailability(id) {
        fetch('delete_availability.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${id}`,
        })
        .then(response => response.text())
        .then(data => {
            console.log('Delete response:', data);
            if (data.includes('Record deleted successfully')) {
                renderCalendar();
            } else {
                console.error('Error deleting availability:', data);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function showForm() {
        form.classList.remove('hidden');
    }

    function closeForm() {
        form.classList.add('hidden');
    }

    availabilityForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        const status = document.getElementById('status').value;
        const date = `${currentSelectedDate.getFullYear()}-${currentSelectedDate.getMonth() + 1}-${currentSelectedDate.getDate()}`;

        fetch('save_availability.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `date=${date}&start_time=${startTime}&end_time=${endTime}&status=${status}`,
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            renderCalendar();
            closeForm();
            availabilityForm.reset();
        })
        .catch(error => console.error('Error saving availability:', error));
    });

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        fetch('register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${username}&password=${password}`,
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data === 'Registration successful') {
                loginUser(username, password);
            }
        })
        .catch(error => console.error('Error registering:', error));
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        loginUser(username, password);
    });

    function loginUser(username, password) {
        fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${username}&password=${password}`,
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data === 'Login successful' || data === 'Registration successful') {
                authContainer.classList.add('hidden');
                calendarContainer.classList.remove('hidden');
                renderCalendar();
            }
        })
        .catch(error => console.error('Error logging in:', error));
    }

    logoutButton.addEventListener('click', () => {
        fetch('logout.php')
        .then(response => {
            authContainer.classList.remove('hidden');
            calendarContainer.classList.add('hidden');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        })
        .catch(error => console.error('Error logging out:', error));
    });

    showRegisterFormButton.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLoginFormButton.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Check session state on page load
    fetch('check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                authContainer.classList.add('hidden');
                calendarContainer.classList.remove('hidden');
                renderCalendar();
            } else {
                authContainer.classList.remove('hidden');
                calendarContainer.classList.add('hidden');
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            }
        })
        .catch(error => console.error('Error checking session:', error));

    renderCalendar();
});

function closeForm() {
    document.getElementById('event-form').classList.add('hidden');
}
