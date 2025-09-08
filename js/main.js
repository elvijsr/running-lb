import { trainingPlan, exercises } from './data.js';

document.addEventListener('DOMContentLoaded', function() {
    const storageKey = 'trainingPlanProgress_v2'; // Versioned key
    let completionState = {};

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
    
    function updateCompletionState() {
        // This function can be expanded if other UI elements need to be updated
        // For now, it just saves the state.
        saveState();
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

    function handleTaskItemClick(e) {
        const taskItem = e.target.closest('li[data-task-id]');
        if (taskItem) {
            const taskId = taskItem.dataset.taskId;
            const checkbox = taskItem.querySelector('.task-checkbox');

            // Toggle the checkbox state
            checkbox.checked = !checkbox.checked;

            // Update and save the state
            completionState[taskId] = checkbox.checked;
            updateCompletionState();
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

            // Update button active state
            tabButtons.forEach(button => button.classList.remove('active-tab'));
            clickedTab.classList.add('active-tab');

            // Update content visibility
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            const tabName = clickedTab.dataset.tab;
            const activeContent = document.getElementById(`tab-content-${tabName}`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }
        });
    }

    // --- INITIALIZATION ---
    loadState();
    renderSchedule();
    renderExerciseList();
    setupTabs();
    scrollToFirstUnchecked(); // Scroll to the first incomplete item

    // Add single event listener to the container for efficiency
    document.getElementById('schedule-container').addEventListener('click', handleTaskItemClick);
});
