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
  // Crimson Coders (145 points)
  { id: 'S1', assignmentId: 'A2', teamId: 'T1', status: 'approved', comments: 'Met with advisor today!', fileName: 'advisor_meeting.jpg', submittedAt: new Date('2024-12-02') },
  { id: 'S2', assignmentId: 'A3', teamId: 'T1', status: 'approved', comments: 'Spoke with Dr. Bradley about supply chain analytics', fileName: 'bradley.jpg', submittedAt: new Date('2024-12-03') },
  { id: 'S3', assignmentId: 'A4', teamId: 'T1', status: 'approved', comments: 'AIS meeting was great', fileName: 'ais_meeting.jpg', submittedAt: new Date('2024-12-04') },
  { id: 'S4', assignmentId: 'A5', teamId: 'T1', status: 'approved', comments: 'Ferg photo with the squad', fileName: 'ferg_photo.jpg', submittedAt: new Date('2024-12-01') },
  { id: 'S5', assignmentId: 'A6', teamId: 'T1', status: 'approved', comments: 'Loved the museum', fileName: 'bryant_museum.jpg', submittedAt: new Date('2024-12-02') },
  { id: 'S6', assignmentId: 'A7', teamId: 'T1', status: 'approved', comments: 'STEM to MBA chat was helpful', fileName: 'stem_mba.jpg', submittedAt: new Date('2024-12-03') },
  { id: 'S7', assignmentId: 'A8', teamId: 'T1', status: 'approved', comments: 'Business Analytics Lab tour', fileName: 'analytics_lab.jpg', submittedAt: new Date('2024-12-04') },

  // Data Dynamos (180 points – all assignments)
  { id: 'S8', assignmentId: 'A1', teamId: 'T2', status: 'approved', comments: 'Great photo!', fileName: 'culverhouse.jpg', submittedAt: new Date('2024-12-01') },
  { id: 'S9', assignmentId: 'A2', teamId: 'T2', status: 'approved', comments: 'Career advisor meeting summary attached', fileName: 'advisor_notes.pdf', submittedAt: new Date('2024-12-02') },
  { id: 'S10', assignmentId: 'A3', teamId: 'T2', status: 'approved', comments: 'Chatted with Dr. Bradley', fileName: 'bradley_visit.jpg', submittedAt: new Date('2024-12-02') },
  { id: 'S11', assignmentId: 'A4', teamId: 'T2', status: 'approved', comments: 'AIS meeting attendance', fileName: 'ais_attendance.png', submittedAt: new Date('2024-12-03') },
  { id: 'S12', assignmentId: 'A5', teamId: 'T2', status: 'approved', comments: 'Ferguson Center selfie', fileName: 'ferg_selfie.jpg', submittedAt: new Date('2024-12-01') },
  { id: 'S13', assignmentId: 'A6', teamId: 'T2', status: 'approved', comments: 'Favorite fact from the museum included', fileName: 'bryant_fact.txt', submittedAt: new Date('2024-12-03') },
  { id: 'S14', assignmentId: 'A7', teamId: 'T2', status: 'approved', comments: 'STEM to MBA takeaways', fileName: 'stem_to_mba.pdf', submittedAt: new Date('2024-12-04') },
  { id: 'S15', assignmentId: 'A8', teamId: 'T2', status: 'approved', comments: 'Business Analytics Lab questions', fileName: 'lab_questions.docx', submittedAt: new Date('2024-12-04') },
  { id: 'S16', assignmentId: 'A9', teamId: 'T2', status: 'approved', comments: 'TA study tips summarized', fileName: 'ta_tips.pdf', submittedAt: new Date('2024-12-05') },
  { id: 'S17', assignmentId: 'A10', teamId: 'T2', status: 'approved', comments: 'Denny Chimes photo', fileName: 'denny_chimes.jpg', submittedAt: new Date('2024-12-05') },

  // Analytics Avengers (120 points)
  { id: 'S18', assignmentId: 'A2', teamId: 'T3', status: 'approved', comments: 'Career advisor insights', fileName: 'advisor_insights.pdf', submittedAt: new Date('2024-12-01') },
  { id: 'S19', assignmentId: 'A3', teamId: 'T3', status: 'approved', comments: 'Picture with Dr. Bradley', fileName: 'bradley_picture.jpg', submittedAt: new Date('2024-12-02') },
  { id: 'S20', assignmentId: 'A4', teamId: 'T3', status: 'approved', comments: 'Club meeting notes', fileName: 'club_notes.docx', submittedAt: new Date('2024-12-03') },
  { id: 'S21', assignmentId: 'A7', teamId: 'T3', status: 'approved', comments: 'STEM to MBA summary', fileName: 'stem_mba_summary.pdf', submittedAt: new Date('2024-12-04') },
  { id: 'S22', assignmentId: 'A9', teamId: 'T3', status: 'approved', comments: 'TA tips document', fileName: 'ta_tips.docx', submittedAt: new Date('2024-12-04') },
  { id: 'S23', assignmentId: 'A10', teamId: 'T3', status: 'approved', comments: 'Denny Chimes group photo', fileName: 'denny_group.jpg', submittedAt: new Date('2024-12-05') }
];
