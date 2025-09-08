import { trainingPlan, exercises } from './data.js';

document.addEventListener('DOMContentLoaded', function() {
    const storageKey = 'trainingPlanProgress_v2'; // Versioned key
    let completionState = {};
    let consistencyChart, adherenceChart, trendChart;

    // --- FUNCTIONS ---

    function loadState() {
        try {
            const savedState = localStorage.getItem(storageKey);
            if (savedState) {
                completionState = JSON.parse(savedState);
            }
        } catch (e) {
            console.error("Failed to load state from localStorage:", e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(completionState));
        } catch (e) {
            console.error("Failed to save state to localStorage:", e);
        }
    }

    function updateProgressAndCharts() {
        // --- PROGRESS BARS ---
        const allSessions = trainingPlan.flatMap(phase => phase.weeks.flatMap(week => week.sessions));
        const totalSessions = allSessions.length;
        const completedSessionCount = Object.values(completionState).filter(Boolean).length;
        const overallPercentage = totalSessions > 0 ? Math.round((completedSessionCount / totalSessions) * 100) : 0;

        const overallProgressBar = document.getElementById('overall-progress-bar');
        overallProgressBar.style.width = `${overallPercentage}%`;
        overallProgressBar.textContent = `${overallPercentage}%`;

        // Find the current week (first week with an incomplete session)
        let currentWeekData = null;
        for (const phase of trainingPlan) {
            for (const week of phase.weeks) {
                if (week.sessions.some(session => !completionState[session.id])) {
                    currentWeekData = week;
                    break;
                }
            }
            if (currentWeekData) break;
        }

        // If all sessions are done, default to the last week
        if (!currentWeekData && trainingPlan.length > 0) {
            const lastPhase = trainingPlan[trainingPlan.length - 1];
            currentWeekData = lastPhase.weeks[lastPhase.weeks.length - 1];
        }

        if (currentWeekData) {
            const weeklySessions = currentWeekData.sessions;
            const totalWeeklySessions = weeklySessions.length;
            const completedWeeklySessions = weeklySessions.filter(session => completionState[session.id]).length;
            const weeklyPercentage = totalWeeklySessions > 0 ? Math.round((completedWeeklySessions / totalWeeklySessions) * 100) : 0;

            const weeklyProgressBar = document.getElementById('weekly-progress-bar');
            weeklyProgressBar.style.width = `${weeklyPercentage}%`;
            weeklyProgressBar.textContent = `${weeklyPercentage}%`;

            const weeklyProgressTitle = document.querySelector('#progress-dashboard div:last-child > h3');
            if (weeklyProgressTitle) {
                weeklyProgressTitle.textContent = `Week ${currentWeekData.week} Progress`;
            }
        }

        // --- CHARTS ---
        const weekLabels = trainingPlan.flatMap(phase => phase.weeks).map(week => `W${week.week}`);

        // Data for charts
        const weeklyCompletionData = trainingPlan.flatMap(phase => phase.weeks).map(week => {
            return week.sessions.filter(session => completionState[session.id]).length;
        });

        const adherenceData = { key: 0, other: 0 };
        allSessions.forEach(session => {
            if (completionState[session.id]) {
                if (session.type.startsWith('Key')) {
                    adherenceData.key++;
                } else {
                    adherenceData.other++;
                }
            }
        });

        // Destroy existing charts before re-rendering
        if (consistencyChart) consistencyChart.destroy();
        if (adherenceChart) adherenceChart.destroy();
        if (trendChart) trendChart.destroy();

        // 1. Workout Consistency (Bar Chart)
        const consistencyCtx = document.getElementById('consistency-chart').getContext('2d');
        consistencyChart = new Chart(consistencyCtx, {
            type: 'bar',
            data: {
                labels: weekLabels,
                datasets: [{
                    label: 'Completed Sessions',
                    data: weeklyCompletionData,
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });

        // 2. Session Adherence (Doughnut Chart)
        const adherenceCtx = document.getElementById('adherence-chart').getContext('2d');
        adherenceChart = new Chart(adherenceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Key Sessions', 'Other Sessions'],
                datasets: [{
                    data: [adherenceData.key, adherenceData.other],
                    backgroundColor: ['#6366f1', '#a5b4fc'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });

        // 3. Weekly Trend (Line Chart)
        const trendCtx = document.getElementById('trend-chart').getContext('2d');
        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: weekLabels,
                datasets: [{
                    label: 'Completed per Week',
                    data: weeklyCompletionData,
                    borderColor: 'rgba(239, 68, 68, 0.8)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    }

    function scrollToFirstUnchecked() {
        // Find the first unchecked session ID
        let firstUncheckedId = null;
        for (const phase of trainingPlan) {
            for (const week of phase.weeks) {
                for (const session of week.sessions) {
                    if (!completionState[session.id]) {
                        firstUncheckedId = session.id;
                        break;
                    }
                }
                if (firstUncheckedId) break;
            }
            if (firstUncheckedId) break;
        }

        // If an unchecked session is found, scroll to it
        if (firstUncheckedId) {
            // Use a slight delay to ensure the element is fully rendered
            setTimeout(() => {
                const targetElement = document.querySelector(`li[data-task-id="${firstUncheckedId}"]`);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                    // Optional: Add a visual cue
                    targetElement.classList.add('bg-yellow-100');
                    setTimeout(() => targetElement.classList.remove('bg-yellow-100'), 2000);
                }
            }, 100); // 100ms delay
        }
    }

    function renderSchedule() {
        const container = document.getElementById('schedule-container');
        container.innerHTML = ''; // Clear previous content

        trainingPlan.forEach(phase => {
            const phaseDiv = document.createElement('div');
            phaseDiv.innerHTML = `<h3 class="text-xl font-semibold mb-4 text-indigo-700">${phase.phase}</h3>`;

            const weeksGrid = document.createElement('div');
            weeksGrid.className = 'grid grid-cols-1 lg:grid-cols-2 gap-6';

            phase.weeks.forEach(weekData => {
                const weekCard = document.createElement('div');
                weekCard.className = 'bg-gray-50 p-4 rounded-lg border border-gray-200';

                let sessionsHTML = `<h4 class="font-bold text-lg mb-3">Week ${weekData.week}</h4><ul class="space-y-3">`;
                weekData.sessions.forEach(session => {
                    const isChecked = completionState[session.id] ? 'checked' : '';
                    // No longer need the 'completedClass' here, CSS handles it
                    sessionsHTML += `
                                <li class="flex items-start p-2 rounded-md hover:bg-gray-100 cursor-pointer" data-task-id="${session.id}">
                                    <input type="checkbox" id="${session.id}" class="task-checkbox h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 pointer-events-none" ${isChecked}>
                                    <div class="ml-3 text-sm text-gray-700">
                                <span class="font-semibold">${session.type}:</span> ${session.task}
                                    </div>
                        </li>
                    `;
                });
                sessionsHTML += `</ul>`;
                weekCard.innerHTML = sessionsHTML;
                weeksGrid.appendChild(weekCard);
            });
            phaseDiv.appendChild(weeksGrid);
            container.appendChild(phaseDiv);
        });
    }

    function renderExerciseList() {
        const container = document.getElementById('exercise-list');
        container.innerHTML = ''; // Clear previous content

        // Create a header for larger screens
        const header = document.createElement('div');
        header.className = 'hidden md:grid md:grid-cols-3 gap-4 font-semibold text-gray-600 px-4 py-2 border-b';
        header.innerHTML = `
            <div>Muscle Group</div>
            <div>Exercise</div>
            <div>How to Perform Safely</div>
        `;
        container.appendChild(header);

        // Create a card for each exercise
        exercises.forEach(ex => {
            const exerciseCard = document.createElement('div');
            exerciseCard.className = 'exercise-card'; // This class will be used for styling
            exerciseCard.innerHTML = `
                <div class="md:hidden font-bold text-sm text-gray-500">Muscle Group</div>
                <div class="mb-2 md:mb-0">${ex.group}</div>
                <div class="md:hidden font-bold text-sm text-gray-500">Exercise</div>
                <div class="mb-2 md:mb-0">${ex.exercise}</div>
                <div class="md:hidden font-bold text-sm text-gray-500">How to Perform Safely</div>
                <div>${ex.howTo}</div>
            `;
            container.appendChild(exerciseCard);
        });
    }

    // --- IMPROVED JS ---
    // This function handles clicks on the entire list item for better mobile UX.
    function handleTaskItemClick(e) {
        const taskItem = e.target.closest('li[data-task-id]');
        if (taskItem) {
            const taskId = taskItem.dataset.taskId;
            const checkbox = taskItem.querySelector('.task-checkbox');

            // Toggle the checkbox state
            checkbox.checked = !checkbox.checked;

            // Update and save the state
            completionState[taskId] = checkbox.checked;
            saveState();
            updateProgressAndCharts(); // Update visuals
        }
    }

    function setupTabs() {
        const tabContainer = document.querySelector('nav[aria-label="Tabs"]');
        if (!tabContainer) return; // Guard clause

        const tabButtons = tabContainer.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabContainer.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.tab-btn');
            if (!clickedTab || clickedTab.classList.contains('active-tab')) {
                return; // Do nothing if not a button or already active
            }
            e.preventDefault();
            console.log("Tab clicked:", clickedTab.dataset.tab);


            // Update button active state
            tabButtons.forEach(button => button.classList.remove('active-tab'));
            clickedTab.classList.add('active-tab');

            // Update content visibility
            tabContents.forEach(content => {
                console.log("Hiding content:", content.id);
                content.classList.add('hidden');
            });
            const tabName = clickedTab.dataset.tab;
            const activeContent = document.getElementById(`tab-content-${tabName}`);
            if (activeContent) {
                console.log("Showing content:", activeContent.id);
                activeContent.classList.remove('hidden');
            }

            // Re-render charts if the progress tab is activated to ensure they draw correctly
            if (tabName === 'progress') {
                updateProgressAndCharts();
            }
        });
    }

    // --- INITIALIZATION ---
    loadState();
    renderSchedule();
    renderExerciseList();
    setupTabs();
    updateProgressAndCharts(); // Initial visual render
    scrollToFirstUnchecked(); // Scroll to the first incomplete item

    // Add single event listener to the container for efficiency
    document.getElementById('schedule-container').addEventListener('click', handleTaskItemClick);
});
