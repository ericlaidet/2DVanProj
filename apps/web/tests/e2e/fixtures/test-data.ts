export const accountScenarios = [
    {
        type: 'Free',
        username: 'user_free',
        password: 'password123',
        expectedMaxPlans: 1,
        canSave: true,
        canShare: false
    },
    {
        type: 'Pro',
        username: 'user_pro',
        password: 'password123',
        expectedMaxPlans: 100,
        canSave: true,
        canShare: true
    },
    {
        type: 'Enterprise',
        username: 'user_enterprise',
        password: 'password123',
        expectedMaxPlans: 9999,
        canSave: true,
        canShare: true
    }
];

export const furnitureScenarios = [
    { type: 'Volkswagen ID. Buzz', expectedBed: { width: 800, height: 1850 } },
    { type: 'Mercedes-Benz Sprinter L3H2', expectedBed: { width: 1600, height: 2000 } }
]
