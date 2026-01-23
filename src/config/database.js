// Database schema structure for Firebase Realtime Database
// This defines how data is organized in the database

export const DATABASE_STRUCTURE = {
  // Laundry machines state
  laundry: {
    washingMachine: {
      status: 'idle', // idle, running, done
      program: null, // Program name
      startTime: null,
      endTime: null,
      currentUser: null, // Room ID
      queue: [] // Array of { roomId, program, timestamp }
    },
    dryer: {
      status: 'idle',
      program: null,
      startTime: null,
      endTime: null,
      currentUser: null,
      queue: []
    }
  },

  // Task management
  tasks: {
    kitchens: {
      lower: {
        trash: { currentRoom: '1C', lastCompleted: null, nextDue: null },
        cupboard: { currentRoom: '1C', lastCompleted: null, nextDue: null },
        stove: { currentRoom: '1C', lastCompleted: null, nextDue: null }
      },
      upper: {
        trash: { currentRoom: '8C', lastCompleted: null, nextDue: null },
        cupboard: { currentRoom: '8C', lastCompleted: null, nextDue: null },
        stove: { currentRoom: '8C', lastCompleted: null, nextDue: null }
      }
    },
    showers: {
      lower: { currentRoom: '1C', lastCleaned: null, nextDue: null },
      upper: { currentRoom: '8C', lastCleaned: null, nextDue: null }
    },
    toilets: {
      floor0: { paperStatus: 'full', lastChecked: null, currentRoom: null }, // full, low, empty
      floor1: { paperStatus: 'full', lastChecked: null, currentRoom: '1C' },
      floor2: { paperStatus: 'full', lastChecked: null, currentRoom: '3C' },
      floor3: { paperStatus: 'full', lastChecked: null, currentRoom: '8C' },
      floor4: { paperStatus: 'full', lastChecked: null, currentRoom: '13C' }
    }
  },

  // Who's home tracking (optional feature)
  presence: {
    // Room IDs as keys, boolean or timestamp as values
    // e.g., '1C': 1674567890, '2C': false, etc.
  },

  // History/logs
  history: {
    laundry: [],
    tasks: []
  }
};

// Washing machine programs
export const WASHING_PROGRAMS = [
  { id: 'quick', name: 'Quick Wash', duration: 30 },
  { id: 'normal', name: 'Normal', duration: 60 },
  { id: 'heavy', name: 'Heavy Duty', duration: 90 },
  { id: 'delicate', name: 'Delicate', duration: 45 },
  { id: 'eco', name: 'Eco Mode', duration: 120 }
];

// Dryer programs
export const DRYER_PROGRAMS = [
  { id: 'quick', name: 'Quick Dry', duration: 30 },
  { id: 'normal', name: 'Normal', duration: 60 },
  { id: 'heavy', name: 'Heavy Load', duration: 90 },
  { id: 'delicate', name: 'Delicate', duration: 40 },
  { id: 'air', name: 'Air Dry', duration: 20 }
];

// Helper function to get next room in rotation
export const getNextRoom = (currentRoomId, assignedRooms) => {
  const currentIndex = assignedRooms.indexOf(currentRoomId);
  const nextIndex = (currentIndex + 1) % assignedRooms.length;
  return assignedRooms[nextIndex];
};
