// Shared data for the MIS Scavenger Hunt Portal
// University of Alabama MIS Program Assignments
const ASSIGNMENTS = [
  {
    id: 'A1',
    title: 'Selfie at Culverhouse College of Business',
    description: 'Take a team photo in front of the Culverhouse College of Business building. Show your Bama spirit!',
    points: 10,
    due: '2024-12-10',
    location: 'Culverhouse College, 361 Stadium Dr'
  },
  {
    id: 'A2',
    title: 'Meet with MIS Career Advisor',
    description: 'Schedule and complete a meeting with an MIS career advisor. Get advice on internships or career paths. Submit a photo with the advisor or screenshot of meeting confirmation.',
    points: 25,
    due: '2024-12-12',
    location: 'Alston Hall, MIS Advising Office'
  },
  {
    id: 'A3',
    title: 'Find Dr. Randy Bradley',
    description: 'Locate Dr. Randy Bradley (Department Chair) and take a photo with him. Ask him about his research in supply chain analytics!',
    points: 20,
    due: '2024-12-11',
    location: 'Office in Alston Hall or Culverhouse'
  },
  {
    id: 'A4',
    title: 'Attend a MIS Club Meeting',
    description: 'Attend an MIS Club or AIS (Association for Information Systems) student chapter meeting. Submit proof of attendance (photo or sign-in sheet).',
    points: 30,
    due: '2024-12-15',
    location: 'Check MIS Club GroupMe for meeting times'
  },
  {
    id: 'A5',
    title: 'Visit the Ferguson Center',
    description: 'Take a team photo at the Ferguson Student Center. Bonus points if you\'re holding Bama gear or showing school spirit!',
    points: 10,
    due: '2024-12-10',
    location: 'Ferguson Center, University Blvd'
  },
  {
    id: 'A6',
    title: 'Visit the Paul W. Bryant Museum',
    description: 'Take a photo at the Paul W. Bryant Museum and find an interesting fact about Alabama football history. Share what you learned!',
    points: 15,
    due: '2024-12-14',
    location: 'Paul W. Bryant Museum, 300 Bryant Dr'
  },
  {
    id: 'A7',
    title: 'Explore the STEM Path to the MBA Program',
    description: 'Visit the STEM Path to the MBA office and speak with a representative about the program. Summarize what you learned and how it might fit your goals.',
    points: 20,
    due: '2024-12-13',
    location: 'Alston Hall, STEM to MBA Office'
  },
  {
    id: 'A8',
    title: 'Find the Business Analytics Lab',
    description: 'Locate the Business Analytics Lab and take a photo. Ask a student assistant about the projects they support.',
    points: 25,
    due: '2024-12-12',
    location: 'Culverhouse Analytics Lab'
  },
  {
    id: 'A9',
    title: 'Meet a MIS TA',
    description: 'Introduce yourself to a MIS teaching assistant and ask for study tips. Share one tip you learned and submit a photo together.',
    points: 15,
    due: '2024-12-09',
    location: 'MIS Department Offices'
  },
  {
    id: 'A10',
    title: 'Snap a photo at Denny Chimes',
    description: 'Take a creative team photo at Denny Chimes. Include the chimes in the background and show your school spirit!',
    points: 10,
    due: '2024-12-08',
    location: 'Denny Chimes, University of Alabama Quad'
  }
];

const state = {
  role: 'student',
  currentUser: { team: null },
  teams: [
    { id: 'T1', name: 'Crimson Coders', members: 4, memberNames: ['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'James Wilson'], score: 145 },
    { id: 'T2', name: 'Data Dynamos', members: 3, memberNames: ['Alex Rodriguez', 'Taylor Smith', 'Jordan Brown'], score: 180 },
    { id: 'T3', name: 'Analytics Avengers', members: 5, memberNames: ['Chris Lee', 'Morgan Taylor', 'Casey Martinez', 'Riley Anderson', 'Sam Parker'], score: 120 }
  ],
  faculty: [
    { id: 'F1', name: 'Dr. Randy Bradley', role: 'Department Chair & Professor', location: 'Alston Hall 340', bio: 'Expert in supply chain analytics and business intelligence. Published researcher in analytics and sustainability.' },
    { id: 'F2', name: 'Dr. Sarah Mitchell', role: 'MIS Academic Advisor', location: 'Culverhouse 225', bio: 'Specializes in student career development and internship placement. Former IT consultant at Deloitte.' },
    { id: 'F3', name: 'Prof. James Chen', role: 'MIS Lecturer', location: 'Alston Hall 210', bio: 'Teaches database management and systems analysis. 15 years of industry experience in enterprise systems.' },
    { id: 'F4', name: 'Dr. Emily Rodriguez', role: 'Associate Professor', location: 'Culverhouse 318', bio: 'Research focus on cybersecurity and data privacy. Regular speaker at security conferences.' }
  ],
  submissions: [],
  currentAssignment: null,
  currentReview: null,
  currentTeamDetail: null,
  currentFaculty: null,
  currentTaskEdit: null
};

state.submissions = [
  { id: 'S1', assignmentId: 'A2', teamId: 'T1', status: 'pending', comments: 'Met with advisor today!', fileName: 'advisor_meeting.jpg', submittedAt: new Date() },
  { id: 'S2', assignmentId: 'A1', teamId: 'T2', status: 'approved', comments: 'Great photo!', fileName: 'culverhouse.jpg', submittedAt: new Date() },
  { id: 'S3', assignmentId: 'A3', teamId: 'T1', status: 'rejected', comments: 'Found him in his office', fileName: 'bradley.jpg', rejectionReason: 'Photo is too blurry, please retake with better lighting', submittedAt: new Date() }
];
