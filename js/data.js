export const trainingPlan = [
    {
        phase: "Phase 1: Foundation & Form (Weeks 1-4)",
        weeks: [
            { week: 1, sessions: [ { id: "w1s1", type: "Run/Walk", task: "15 min: 1 min run (Green), 3 min walk. Repeat 3x." }, { id: "w1s2", type: "Active Recovery or Strength", task: "20 min walk or Strength Session" } ] },
            { week: 2, sessions: [ { id: "w2s1", type: "Run/Walk", task: "16 min: 1 min run (Green), 3 min walk. Repeat 4x." }, { id: "w2s2", type: "Active Recovery or Strength", task: "20 min walk or Strength Session" } ] },
            { week: 3, sessions: [ { id: "w3s1", type: "Run/Walk", task: "20 min: 2 min run (Green), 3 min walk. Repeat 4x." }, { id: "w3s2", type: "Active Recovery or Strength", task: "25 min walk or Strength Session" } ] },
            { week: 4, sessions: [ { id: "w4s1", type: "Run/Walk", task: "21 min: 2 min run (Green), 2 min walk. Repeat 5x." }, { id: "w4s2", type: "Active Recovery or Strength", task: "25 min walk or Strength Session" } ] },
        ]
    },
    {
        phase: "Phase 2: Building Endurance (Weeks 5-8)",
        weeks: [
            { week: 5, sessions: [ { id: "w5s1", type: "Run/Walk", task: "24 min: 3 min run (Green), 2 min walk. Repeat 5x." }, { id: "w5s2", type: "Active Recovery or Strength", task: "30 min walk or Strength Session" } ] },
            { week: 6, sessions: [ { id: "w6s1", type: "Run/Walk", task: "28 min: 4 min run (Green), 2 min walk. Repeat 4x." }, { id: "w6s2", type: "Active Recovery or Strength", task: "30 min walk or Strength Session" } ] },
            { week: 7, sessions: [ { id: "w7s1", type: "Run/Walk", task: "30 min: 5 min run (Green), 2 min walk. Repeat 4x." }, { id: "w7s2", type: "Active Recovery or Strength", task: "30 min walk or Strength Session" } ] },
            { week: 8, sessions: [ { id: "w8s1", type: "Run/Walk", task: "32 min: 6 min run (Green), 2 min walk. Repeat 4x." }, { id: "w8s2", type: "Active Recovery or Strength", task: "30 min walk or Strength Session" } ] },
        ]
    },
    {
        phase: "Phase 3: Consistent Running (Weeks 9-12)",
        weeks: [
            { week: 9, sessions: [ { id: "w9s1", type: "Run/Walk", task: "20 min: 8 min run (Green), 2 min walk. Repeat 2x." }, { id: "w9s2", type: "Optional Run", task: "15-20 min easy run (Green)" } ] },
            { week: 10, sessions: [ { id: "w10s1", type: "Run/Walk", task: "24 min: 10 min run (Green), 2 min walk. Repeat 2x." }, { id: "w10s2", type: "Optional Run", task: "20 min easy run (Green)" } ] },
            { week: 11, sessions: [ { id: "w11s1", type: "Continuous Run", task: "20 min continuous easy run (Green)." }, { id: "w11s2", type: "Optional Run", task: "20-25 min easy run (Green)" } ] },
            { week: 12, sessions: [ { id: "w12s1", type: "Continuous Run", task: "25 min continuous easy run (Green)." }, { id: "w12s2", type: "Optional Run", task: "Celebrate with a 5k walk or run/walk!" } ] },
        ]
    }
];

export const exercises = [
    // Core
    { group: "Core", exercise: "Pelvic Tilt", howTo: "Lie on your back with knees bent. Gently flatten your back against the floor by tightening your stomach muscles." },
    { group: "Core", exercise: "Glute Bridge", howTo: "Lie on your back with knees bent. Lift your hips off the floor until your body forms a straight line from your shoulders to your knees." },
    { group: "Core", exercise: "Modified Plank", howTo: "Start on all fours, then walk your hands forward and lower your hips to form a straight line from your head to your knees. Hold this position." },
    { group: "Core", exercise: "Bird-Dog", howTo: "Start on all fours. Extend one arm straight forward and the opposite leg straight back, keeping your back flat. Return to the start and switch sides." },

    // Lower Body
    { group: "Lower Body", exercise: "Bodyweight Squat", howTo: "Stand with feet shoulder-width apart. Lower your hips as if sitting in a chair, keeping your chest up and back straight." },
    { group: "Lower Body", exercise: "Lunge", howTo: "Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle." },

    // Upper Body
    { group: "Upper Body", exercise: "Wall Push-up", howTo: "Stand facing a wall, a little farther than arm's length away. Place your hands on the wall and bend your elbows to bring your chest toward the wall." },
    { group: "Upper Body", exercise: "Inverted Row", howTo: "Lie under a sturdy table. Grab the edge with both hands and pull your chest up toward the table." },
];
