// ========================
// ALL-IN-ONE APP
// ========================

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        document.getElementById('themeToggle').addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

// Tab Navigation
class TabManager {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn').dataset.tab));
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }
}

// ========================
// 1. WEATHER APP
// ========================
class WeatherApp {
    constructor() {
        this.apiKey = '7d829e2a9bb26195fa64e64fcd9e16dc'; // Free API key
        this.init();
    }

    init() {
        document.getElementById('searchBtn').addEventListener('click', () => this.searchCity());
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });
        document.getElementById('geoBtn').addEventListener('click', () => this.getLocation());
        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    this.fetchWeather(pos.coords.latitude, pos.coords.longitude);
                },
                () => this.fetchWeather(40.7128, -74.0060) // Default to NYC
            );
        }
    }

    searchCity() {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`)
                .then(r => r.json())
                .then(data => {
                    if (data.length) {
                        this.fetchWeather(data[0].lat, data[0].lon);
                    }
                });
        }
    }

    fetchWeather(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`)
            .then(r => r.json())
            .then(data => this.displayWeather(data));
        
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`)
            .then(r => r.json())
            .then(data => this.displayForecast(data));
    }

    displayWeather(data) {
        const icons = {
            '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️', '10d': '🌧️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };

        document.getElementById('weatherDisplay').innerHTML = `
            <div class="weather-card">
                <div class="weather-icon" style="font-size: 4rem;">${icons[data.weather[0].icon]}</div>
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="weather-main">${Math.round(data.main.temp)}°C</div>
                <div class="weather-description">${data.weather[0].description}</div>
                <div class="weather-details">
                    <div class="detail-item">
                        <span class="detail-label">💧 Humidity</span>
                        <span class="detail-value">${data.main.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">💨 Wind</span>
                        <span class="detail-value">${data.wind.speed} m/s</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">🔽 Pressure</span>
                        <span class="detail-value">${data.main.pressure} hPa</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">👁️ Visibility</span>
                        <span class="detail-value">${(data.visibility / 1000).toFixed(1)} km</span>
                    </div>
                </div>
            </div>
        `;
    }

    displayForecast(data) {
        const days = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!days[date]) days[date] = item;
        });

        const icons = {
            '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️', '10d': '🌧️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };

        let html = '';
        Object.entries(days).slice(0, 5).forEach(([date, item]) => {
            html += `
                <div class="forecast-card">
                    <div class="forecast-date">${new Date(item.dt * 1000).toLocaleDateString('en-US', {weekday: 'short'})}</div>
                    <div class="forecast-icon">${icons[item.weather[0].icon]}</div>
                    <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
                    <small>${item.weather[0].main}</small>
                </div>
            `;
        });
        document.getElementById('forecastDisplay').innerHTML = html;
    }
}

// ========================
// 2. TODO APP
// ========================
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';
        this.init();
    }

    init() {
        document.getElementById('addTodoBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
        this.render();
    }

    addTodo() {
        const text = document.getElementById('todoInput').value.trim();
        const deadline = document.getElementById('todoDeadline').value;
        const priority = document.getElementById('todoPriority').value;

        if (text) {
            this.todos.push({
                id: Date.now(),
                text,
                deadline,
                priority,
                completed: false,
                created: new Date().toLocaleString()
            });
            this.save();
            document.getElementById('todoInput').value = '';
            document.getElementById('todoDeadline').value = '';
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    }

    setFilter(filter) {
        this.filter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.render();
    }

    getFilteredTodos() {
        switch (this.filter) {
            case 'completed':
                return this.todos.filter(t => t.completed);
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'high':
                return this.todos.filter(t => t.priority === 'high' && !t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filtered = this.getFilteredTodos();
        
        // Update stats
        document.getElementById('totalTasks').textContent = this.todos.length;
        document.getElementById('completedTasks').textContent = this.todos.filter(t => t.completed).length;
        document.getElementById('highPriorityTasks').textContent = this.todos.filter(t => t.priority === 'high').length;

        let html = '';
        filtered.forEach(todo => {
            const deadlineText = todo.deadline ? new Date(todo.deadline).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'No deadline';

            html += `
                <div class="todo-item ${todo.priority} ${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                        onchange="todoApp.toggleTodo(${todo.id})">
                    <div class="todo-content">
                        <div class="todo-text">${this.escape(todo.text)}</div>
                        <div class="todo-meta">
                            <span class="todo-priority-badge priority-${todo.priority}">${todo.priority}</span>
                            <span>📅 ${deadlineText}</span>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button onclick="todoApp.deleteTodo(${todo.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        document.getElementById('todosList').innerHTML = html || '<div class="empty-state"><i class="fas fa-check"></i><p>No tasks yet!</p></div>';
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    escape(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========================
// 3. QUIZ APP
// ========================
class QuizApp {
    constructor() {
        this.questions = {
            general: [
                { q: 'What is the capital of France?', a: ['Paris', 'London', 'Berlin', 'Madrid'], correct: 0 },
                { q: 'Which planet is known as the Red Planet?', a: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
                { q: 'Who painted the Mona Lisa?', a: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correct: 1 },
                { q: 'What is the largest ocean?', a: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correct: 2 },
                { q: 'In which year did the Titanic sink?', a: ['1912', '1905', '1920', '1898'], correct: 0 },
                { q: 'What is the smallest country in the world?', a: ['Monaco', 'Liechtenstein', 'Vatican City', 'San Marino'], correct: 2 },
                { q: 'Which element has the atomic number 1?', a: ['Helium', 'Hydrogen', 'Lithium', 'Boron'], correct: 1 },
                { q: 'What is the currency of Japan?', a: ['Won', 'Yuan', 'Yen', 'Rupee'], correct: 2 },
                { q: 'How many sides does a hexagon have?', a: ['5', '6', '7', '8'], correct: 1 },
                { q: 'What is the largest mammal in the world?', a: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], correct: 1 }
            ],
            science: [
                { q: 'What is the chemical symbol for Gold?', a: ['Gd', 'Au', 'Ag', 'Al'], correct: 1 },
                { q: 'What is the speed of light?', a: ['150,000 km/s', '300,000 km/s', '500,000 km/s', '100,000 km/s'], correct: 1 },
                { q: 'What is the powerhouse of the cell?', a: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], correct: 1 },
                { q: 'How many bones are in the adult human body?', a: ['186', '206', '226', '246'], correct: 1 },
                { q: 'What does DNA stand for?', a: ['Deoxyribonucleic Acid', 'Deoxyribose Nucleic Acid', 'Diribonucleic Acid', 'Deoxyribon Nucleic Acid'], correct: 0 },
                { q: 'What is the most abundant gas in Earth\'s atmosphere?', a: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'], correct: 2 },
                { q: 'What is the process by which plants make their food?', a: ['Respiration', 'Photosynthesis', 'Fermentation', 'Digestion'], correct: 1 },
                { q: 'What is the boiling point of water?', a: ['50°C', '75°C', '100°C', '125°C'], correct: 2 },
                { q: 'What is the SI unit of force?', a: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1 },
                { q: 'Which scientist developed the theory of evolution?', a: ['Isaac Newton', 'Charles Darwin', 'Albert Einstein', 'Stephen Hawking'], correct: 1 }
            ],
            history: [
                { q: 'In what year did World War II end?', a: ['1943', '1944', '1945', '1946'], correct: 2 },
                { q: 'Who was the first President of the United States?', a: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'], correct: 1 },
                { q: 'When did the French Revolution begin?', a: ['1789', '1799', '1779', '1809'], correct: 0 },
                { q: 'Who invented the printing press?', a: ['Benjamin Franklin', 'Johann Gutenberg', 'Nicola Tesla', 'Thomas Edison'], correct: 1 },
                { q: 'In which year did the Berlin Wall fall?', a: ['1987', '1988', '1989', '1990'], correct: 2 },
                { q: 'Who was the first Roman Emperor?', a: ['Julius Caesar', 'Augustus', 'Nero', 'Marcus Aurelius'], correct: 1 },
                { q: 'When did the Industrial Revolution begin?', a: ['1600s', '1700s', '1800s', '1900s'], correct: 1 },
                { q: 'Who wrote the Declaration of Independence?', a: ['George Washington', 'Benjamin Franklin', 'Thomas Jefferson', 'John Adams'], correct: 2 },
                { q: 'What year did the Titanic sink?', a: ['1910', '1911', '1912', '1913'], correct: 2 },
                { q: 'Who led the American Civil Rights Movement?', a: ['Rosa Parks', 'Malcolm X', 'Martin Luther King Jr.', 'John Lewis'], correct: 2 }
            ],
            geography: [
                { q: 'What is the capital of Australia?', a: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correct: 2 },
                { q: 'Which is the longest river in the world?', a: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1 },
                { q: 'How many continents are there?', a: ['5', '6', '7', '8'], correct: 2 },
                { q: 'What is the capital of Brazil?', a: ['Rio de Janeiro', 'Brasília', 'São Paulo', 'Salvador'], correct: 1 },
                { q: 'Which is the largest desert in the world?', a: ['Gobi', 'Sahara', 'Kalahari', 'Arabian'], correct: 1 },
                { q: 'What is the capital of Egypt?', a: ['Alexandria', 'Cairo', 'Giza', 'Luxor'], correct: 1 },
                { q: 'How many countries are in the European Union?', a: ['25', '27', '29', '31'], correct: 1 },
                { q: 'Which mountain range contains Mount Everest?', a: ['Alps', 'Andes', 'Himalayas', 'Rockies'], correct: 2 },
                { q: 'What is the capital of Canada?', a: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], correct: 2 },
                { q: 'Which is the smallest continent?', a: ['Antarctica', 'Australia', 'Europe', 'South America'], correct: 1 }
            ],
            technology: [
                { q: 'Who is credited with inventing the World Wide Web?', a: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Larry Page'], correct: 2 },
                { q: 'In what year was the first iPhone released?', a: ['2005', '2006', '2007', '2008'], correct: 2 },
                { q: 'What does HTML stand for?', a: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], correct: 0 },
                { q: 'Who founded Microsoft?', a: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Larry Ellison'], correct: 1 },
                { q: 'What does CPU stand for?', a: ['Central Processing Unit', 'Central Program Utility', 'Computer Personal Unit', 'Central Processor Unit'], correct: 0 },
                { q: 'In what year was the first computer bug found?', a: ['1945', '1955', '1965', '1975'], correct: 0 },
                { q: 'What programming language was created by Guido van Rossum?', a: ['Java', 'Python', 'C++', 'Ruby'], correct: 1 },
                { q: 'What does GPU stand for?', a: ['Graphics Processing Unit', 'General Purpose Unit', 'Global Program Utility', 'Graphics Program Unit'], correct: 0 },
                { q: 'In what year was YouTube founded?', a: ['2003', '2004', '2005', '2006'], correct: 2 },
                { q: 'What does API stand for?', a: ['Application Programming Interface', 'Application Process Instruction', 'Advanced Programming Interface', 'Application Programming Integration'], correct: 0 }
            ]
        };
        
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.timeLeft = 60;
        this.timerInterval = null;
        this.init();
    }

    init() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.startQuiz(e.target.closest('.category-btn').dataset.category));
        });
        document.getElementById('quizNextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('quizPrevBtn').addEventListener('click', () => this.prevQuestion());
        document.getElementById('retakeBtn').addEventListener('click', () => this.showStart());
    }

    startQuiz(category) {
        this.currentQuiz = [...this.questions[category]].sort(() => Math.random() - 0.5).slice(0, 10);
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = new Array(this.currentQuiz.length).fill(null);
        this.timeLeft = 60;
        
        document.getElementById('quizStart').style.display = 'none';
        document.getElementById('quizContent').style.display = 'block';
        document.getElementById('quizResults').style.display = 'none';
        
        this.displayQuestion();
        this.startTimer();
    }

    displayQuestion() {
        const q = this.currentQuiz[this.currentQuestion];
        document.getElementById('questionNumber').textContent = `Question ${this.currentQuestion + 1} of ${this.currentQuiz.length}`;
        document.getElementById('questionText').textContent = q.q;
        document.getElementById('progressFill').style.width = `${((this.currentQuestion + 1) / this.currentQuiz.length) * 100}%`;
        
        let html = '';
        q.a.forEach((option, i) => {
            const isSelected = this.answers[this.currentQuestion] === i;
            html += `
                <button class="option-btn ${isSelected ? 'selected' : ''}" onclick="quizApp.selectOption(${i})">
                    ${option}
                </button>
            `;
        });
        document.getElementById('optionsContainer').innerHTML = html;
        
        document.getElementById('quizPrevBtn').disabled = this.currentQuestion === 0;
        document.getElementById('quizNextBtn').textContent = this.currentQuestion === this.currentQuiz.length - 1 ? 'Submit' : 'Next';
    }

    selectOption(index) {
        this.answers[this.currentQuestion] = index;
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.option-btn')[index].classList.add('selected');
    }

    nextQuestion() {
        if (this.currentQuestion < this.currentQuiz.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.submitQuiz();
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    submitQuiz() {
        clearInterval(this.timerInterval);
        this.score = this.answers.reduce((sum, answer, i) => {
            return sum + (answer === this.currentQuiz[i].correct ? 1 : 0);
        }, 0);
        
        const percentage = Math.round((this.score / this.currentQuiz.length) * 100);
        const correct = this.score;
        const wrong = this.currentQuiz.length - this.score;
        const accuracy = percentage;
        
        let message = '';
        if (percentage >= 80) message = '🎉 Excellent! You\'re a true expert!';
        else if (percentage >= 60) message = '👍 Good job! Keep practicing!';
        else if (percentage >= 40) message = '📚 Not bad! Study and try again!';
        else message = '💪 Keep learning! You\'ll do better!';
        
        document.getElementById('finalScore').textContent = percentage;
        document.getElementById('resultMessage').textContent = message;
        document.getElementById('correctAnswers').textContent = correct;
        document.getElementById('wrongAnswers').textContent = wrong;
        document.getElementById('accuracy').textContent = accuracy + '%';
        
        document.getElementById('quizContent').style.display = 'none';
        document.getElementById('quizResults').style.display = 'block';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            const timerElement = document.querySelector('.quiz-timer');
            if (this.timeLeft <= 10) {
                timerElement.classList.add('warning');
            }
            if (this.timeLeft <= 0) {
                this.submitQuiz();
            }
        }, 1000);
    }

    showStart() {
        document.getElementById('quizStart').style.display = 'block';
        document.getElementById('quizContent').style.display = 'none';
        document.getElementById('quizResults').style.display = 'none';
        clearInterval(this.timerInterval);
    }
}

// ========================
// 4. EXPENSE TRACKER
// ========================
class ExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.chart = null;
        this.init();
    }

    init() {
        document.getElementById('addExpenseBtn').addEventListener('click', () => this.addExpense());
        document.getElementById('expenseDate').valueAsDate = new Date();
        document.getElementById('expenseMonth').value = new Date().toISOString().slice(0, 7);
        document.getElementById('expenseMonth').addEventListener('change', () => this.render());
        document.getElementById('clearExpensesBtn').addEventListener('click', () => this.clearAll());
        this.render();
    }

    addExpense() {
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        const date = document.getElementById('expenseDate').value;
        const description = document.getElementById('expenseDescription').value.trim();

        if (amount && date) {
            this.expenses.push({
                id: Date.now(),
                amount,
                category,
                date,
                description,
                type: category === 'income' ? 'income' : 'expense'
            });
            this.save();
            document.getElementById('expenseAmount').value = '';
            document.getElementById('expenseDescription').value = '';
            this.render();
        }
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.save();
        this.render();
    }

    clearAll() {
        if (confirm('Are you sure? This will delete all expenses!')) {
            this.expenses = [];
            this.save();
            this.render();
        }
    }

    getFilteredExpenses() {
        const month = document.getElementById('expenseMonth').value;
        return this.expenses.filter(e => e.date.startsWith(month));
    }

    render() {
        const filtered = this.getFilteredExpenses();
        const income = filtered.reduce((sum, e) => sum + (e.type === 'income' ? e.amount : 0), 0);
        const expenses = filtered.reduce((sum, e) => sum + (e.type === 'expense' ? e.amount : 0), 0);
        const balance = income - expenses;

        document.getElementById('balanceAmount').textContent = `$${balance.toFixed(2)}`;
        document.getElementById('incomeAmount').textContent = `$${income.toFixed(2)}`;
        document.getElementById('expenseAmount2').textContent = `$${expenses.toFixed(2)}`;

        // Render chart
        this.renderChart(filtered);

        // Render list
        let html = '';
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(expense => {
            const icons = {
                income: '💰', food: '🍔', transport: '🚗', utilities: '💡',
                entertainment: '🎬', shopping: '🛍️', health: '🏥', other: '📌'
            };
            html += `
                <div class="expense-item">
                    <div class="expense-icon">${icons[expense.category]}</div>
                    <div class="expense-info">
                        <div class="expense-category-name">${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}</div>
                        <div class="expense-date-info">${new Date(expense.date).toLocaleDateString()}</div>
                        ${expense.description ? `<div class="expense-description">${this.escape(expense.description)}</div>` : ''}
                    </div>
                    <div class="expense-amount ${expense.type}">${expense.type === 'income' ? '+' : '-'}$${expense.amount.toFixed(2)}</div>
                    <button class="expense-delete" onclick="expenseTracker.deleteExpense(${expense.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        document.getElementById('expensesList').innerHTML = html || '<div class="empty-state"><i class="fas fa-receipt"></i><p>No expenses yet!</p></div>';
    }

    renderChart(filtered) {
        const categories = {};
        const icons = {
            income: '💰', food: '🍔', transport: '🚗', utilities: '💡',
            entertainment: '🎬', shopping: '🛍️', health: '🏥', other: '📌'
        };
        
        filtered.forEach(expense => {
            if (expense.type === 'expense') {
                categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
            }
        });

        const ctx = document.getElementById('expenseChart');
        if (this.chart) this.chart.destroy();
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories).map(cat => icons[cat] + ' ' + cat.charAt(0).toUpperCase() + cat.slice(1)),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    save() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    escape(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========================
// 5. NOTES APP
// ========================
class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.editingId = null;
        this.searchTerm = '';
        this.selectedColor = 'yellow';
        this.init();
    }

    init() {
        document.getElementById('addNoteBtn').addEventListener('click', () => this.newNote());
        document.getElementById('notesSearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.render();
        });
        this.render();
    }

    newNote() {
        this.editingId = null;
        this.selectedColor = 'yellow';
        this.showEditModal();
    }

    addNote(title, text, color) {
        if (title.trim() || text.trim()) {
            this.notes.push({
                id: Date.now(),
                title: title.trim(),
                text: text.trim(),
                color,
                created: new Date().toLocaleString()
            });
            this.save();
            this.render();
        }
    }

    editNote(id) {
        this.editingId = id;
        const note = this.notes.find(n => n.id === id);
        document.getElementById('editTitle').value = note.title;
        document.getElementById('editText').value = note.text;
        this.selectedColor = note.color;
        this.updateColorSelection();
        this.showEditModal();
    }

    saveEditedNote() {
        const title = document.getElementById('editTitle').value;
        const text = document.getElementById('editText').value;
        
        if (title.trim() || text.trim()) {
            if (this.editingId) {
                const note = this.notes.find(n => n.id === this.editingId);
                note.title = title.trim();
                note.text = text.trim();
                note.color = this.selectedColor;
            } else {
                this.addNote(title, text, this.selectedColor);
            }
            this.save();
            this.render();
            this.closeEditModal();
        }
    }

    deleteNote(id) {
        if (confirm('Delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.save();
            this.render();
        }
    }

    showEditModal() {
        if (!document.getElementById('editModal')) {
            const modal = document.createElement('div');
            modal.id = 'editModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>${this.editingId ? 'Edit Note' : 'New Note'}</h3>
                    <input type="text" id="editTitle" placeholder="Note title...">
                    <textarea id="editText" placeholder="Start typing..."></textarea>
                    <div class="modal-colors">
                        <div class="color-option yellow selected" onclick="notesApp.selectColor('yellow')"></div>
                        <div class="color-option pink" onclick="notesApp.selectColor('pink')"></div>
                        <div class="color-option blue" onclick="notesApp.selectColor('blue')"></div>
                        <div class="color-option green" onclick="notesApp.selectColor('green')"></div>
                        <div class="color-option white" onclick="notesApp.selectColor('white')"></div>
                    </div>
                    <div class="modal-buttons">
                        <button class="btn btn-secondary" onclick="notesApp.closeEditModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="notesApp.saveEditedNote()">Save Note</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        document.getElementById('editModal').classList.add('show');
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) modal.classList.remove('show');
    }

    selectColor(color) {
        this.selectedColor = color;
        this.updateColorSelection();
    }

    updateColorSelection() {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector(`.color-option.${this.selectedColor}`).classList.add('selected');
    }

    getFilteredNotes() {
        return this.notes.filter(n => 
            n.title.toLowerCase().includes(this.searchTerm) ||
            n.text.toLowerCase().includes(this.searchTerm)
        );
    }

    render() {
        const filtered = this.getFilteredNotes();
        
        document.getElementById('totalNotes').textContent = this.notes.length;
        document.getElementById('totalCharacters').textContent = this.notes.reduce((sum, n) => sum + n.title.length + n.text.length, 0);

        let html = '';
        filtered.sort((a, b) => new Date(b.created) - new Date(a.created)).forEach(note => {
            html += `
                <div class="note-card note-color-${note.color}">
                    <div class="note-title">${this.escape(note.title) || 'Untitled'}</div>
                    <div class="note-text">${this.escape(note.text)}</div>
                    <div class="note-date">${new Date(note.created).toLocaleDateString()}</div>
                    <div class="note-actions">
                        <button onclick="notesApp.editNote(${note.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="notesApp.deleteNote(${note.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });
        document.getElementById('notesList').innerHTML = html || '<div class="empty-state"><i class="fas fa-sticky-note"></i><p>No notes yet!</p></div>';
    }

    save() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    escape(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========================
// Initialize All Apps
// ========================
const themeManager = new ThemeManager();
const tabManager = new TabManager();
const weatherApp = new WeatherApp();
const todoApp = new TodoApp();
const quizApp = new QuizApp();
const expenseTracker = new ExpenseTracker();
const notesApp = new NotesApp();
