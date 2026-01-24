// Room configuration with unique access codes
// Each room has a unique code for authentication
export const ROOMS = {
    // Floor 1 (2 rooms)
    "1C": { floor: 1, code: "ALPHA-1001", name: "Room 1C" },
    "2C": { floor: 1, code: "BETA-1002", name: "Room 2C" },

    // Floor 2 (5 rooms)
    "3C": { floor: 2, code: "GAMMA-2001", name: "Room 3C" },
    "4C": { floor: 2, code: "DELTA-2002", name: "Room 4C" },
    "5C": { floor: 2, code: "EPSILON-2003", name: "Room 5C" },
    "6C": { floor: 2, code: "ZETA-2004", name: "Room 6C" },
    "7C": { floor: 2, code: "ETA-2005", name: "Room 7C" },

    // Floor 3 (5 rooms)
    "8C": { floor: 3, code: "THETA-3001", name: "Room 8C" },
    "9C": { floor: 3, code: "IOTA-3002", name: "Room 9C" },
    "10C": { floor: 3, code: "KAPPA-3003", name: "Room 10C" },
    "11C": { floor: 3, code: "LAMBDA-3004", name: "Room 11C" },
    "12C": { floor: 3, code: "MU-3005", name: "Room 12C" },

    // Floor 4 (2 rooms)
    "13C": { floor: 4, code: "NU-4001", name: "Room 13C" },
    "14C": { floor: 4, code: "XI-4002", name: "Room 14C" },
};

// Helper function to validate room code
export const validateRoomCode = (code) => {
    return Object.entries(ROOMS).find(([roomId, room]) => room.code === code);
};

// Helper function to get room by ID
export const getRoomById = (roomId) => {
    return ROOMS[roomId];
};

// Get all room IDs sorted
export const getAllRoomIds = () => {
    return Object.keys(ROOMS).sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
    });
};

// Facility assignments
export const FACILITIES = {
    kitchens: {
        lower: {
            name: "Lower Kitchen (Floor 1)",
            assignedRooms: ["1C", "2C", "3C", "4C", "5C", "6C", "7C"], // Floors 1-2
            tasks: ["trash", "cupboard", "stove"],
        },
        upper: {
            name: "Upper Kitchen (Floor 3-4)",
            assignedRooms: ["8C", "9C", "10C", "11C", "12C", "13C", "14C"], // Floors 3-4
            tasks: ["trash", "cupboard", "stove"],
        },
    },
    showers: {
        lower: {
            name: "Lower Shower (Floors 1-2)",
            assignedRooms: ["1C", "2C", "3C", "4C", "5C", "6C", "7C"],
        },
        upper: {
            name: "Upper Shower (Floors 3-4)",
            assignedRooms: ["8C", "9C", "10C", "11C", "12C", "13C", "14C"],
        },
    },
    toilets: {
        floor0: { name: "Ground Floor Toilet", floor: 0, assignedRooms: [] }, // Shared for laundry area
        floor1: {
            name: "Floor 1 Toilet",
            floor: 1,
            assignedRooms: ["1C", "2C"],
        },
        floor2: {
            name: "Floor 2 Toilet",
            floor: 2,
            assignedRooms: ["3C", "4C", "5C", "6C", "7C"],
        },
        floor3: {
            name: "Floor 3 Toilet",
            floor: 3,
            assignedRooms: ["8C", "9C", "10C", "11C", "12C"],
        },
        floor4: {
            name: "Floor 4 Toilet",
            floor: 4,
            assignedRooms: ["13C", "14C"],
        },
    },
    laundry: {
        name: "Laundry Room (Ground Floor)",
        floor: 0,
        assignedRooms: getAllRoomIds(), // All rooms use laundry
    },
};
