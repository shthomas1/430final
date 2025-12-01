// DOM Elements
    const loginSection = document.getElementById('loginSection');
    const portal = document.getElementById('portal');
    const studentTab = document.getElementById('studentTab');
    const taTab = document.getElementById('taTab');

    // Initialize
    document.querySelectorAll('[data-demo]').forEach(btn => {
      btn.addEventListener('click', () => showPortal(btn.dataset.demo));
    });
    document.getElementById('loginBtn').addEventListener('click', () => showPortal('student'));
    studentTab.addEventListener('click', () => switchRole('student'));
    taTab.addEventListener('click', () => switchRole('ta'));

    // Team Management
    document.getElementById('createTeamBtn').addEventListener('click', createTeam);
    document.getElementById('leaveTeamBtn').addEventListener('click', leaveTeam);

    // Modal handlers
    document.getElementById('submitAssignmentBtn').addEventListener('click', submitAssignment);
    document.getElementById('approveSubmissionBtn').addEventListener('click', () => reviewSubmission('approved'));
    document.getElementById('rejectSubmissionBtn').addEventListener('click', showRejectReason);
    document.getElementById('saveTeamBtn').addEventListener('click', saveTeamDetails);
    document.getElementById('deleteTeamBtn').addEventListener('click', deleteTeamFromModal);
    document.getElementById('saveFacultyBtn').addEventListener('click', saveFaculty);
    document.getElementById('deleteFacultyBtn').addEventListener('click', deleteFacultyFromModal);
    document.getElementById('createFacultyBtn').addEventListener('click', () => openFacultyModal());
    document.getElementById('createAssignmentBtn').addEventListener('click', () => openAssignmentEditModal());
    document.getElementById('saveAssignmentBtn').addEventListener('click', saveAssignment);
    document.getElementById('deleteAssignmentBtn').addEventListener('click', deleteAssignmentFromModal);

    function showPortal(role) {
      state.role = role;
      loginSection.classList.add('hidden');
      portal.classList.remove('hidden');
      // For student demo, don't auto-assign to team so they can see the team selection view
      if (role === 'student') {
        state.currentUser.team = null;
      }
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function switchRole(role) {
      state.role = role;
      render();
    }

    function render() {
      const studentArea = document.getElementById('studentArea');
      const taArea = document.getElementById('taArea');

      if (state.role === 'student') {
        document.getElementById('activeRoleTitle').textContent = 'Student workspace';
        studentTab.setAttribute('aria-pressed', 'true');
        taTab.setAttribute('aria-pressed', 'false');
        studentArea.classList.remove('hidden');
        taArea.classList.add('hidden');
        renderStudentView();
      } else {
        document.getElementById('activeRoleTitle').textContent = 'TA administration';
        studentTab.setAttribute('aria-pressed', 'false');
        taTab.setAttribute('aria-pressed', 'true');
        studentArea.classList.add('hidden');
        taArea.classList.remove('hidden');
        renderTAView();
      }
    }

    function renderStudentView() {
      const hasTeam = state.currentUser.team !== null;
      const noTeamSection = document.getElementById('noTeamSection');
      const hasTeamSection = document.getElementById('hasTeamSection');
      const teamBadge = document.getElementById('studentTeamBadge');

      if (hasTeam) {
        const team = state.teams.find(t => t.id === state.currentUser.team);
        noTeamSection.classList.add('hidden');
        hasTeamSection.classList.remove('hidden');
        teamBadge.textContent = team.name;
        teamBadge.style.background = '#d1fae5';
        teamBadge.style.color = '#065f46';
        document.getElementById('currentTeamName').textContent = team.name;
        document.getElementById('currentTeamMembers').textContent = `${team.members} members · ${team.score} points`;
      } else {
        noTeamSection.classList.remove('hidden');
        hasTeamSection.classList.add('hidden');
        teamBadge.textContent = 'No team';
        teamBadge.style.background = '#fee2e2';
        teamBadge.style.color = '#7f1d1d';
        renderAvailableTeams();
      }

      renderStudentLeaderboard();
      renderStudentFaculty();
      renderAssignmentLists();
    }

    function renderStudentLeaderboard() {
      const sorted = [...state.teams].sort((a, b) => b.score - a.score);
      const container = document.getElementById('studentLeaderboard');
      
      container.innerHTML = sorted.map((team, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : '';
        const maxScore = Math.max(...state.teams.map(t => t.score));
        const percentage = maxScore > 0 ? (team.score / maxScore) * 100 : 0;
        
        return `
          <div class="leaderboard-item">
            <div class="rank-badge ${rankClass}">${rank}</div>
            <div style="flex: 1;">
              <strong>${team.name}</strong>
              <div class="progress-bar" style="margin-top: 6px;">
                <div class="progress-fill" style="width: ${percentage}%"></div>
              </div>
              <span class="muted" style="font-size: 0.85rem;">${team.score} points · ${team.members} members</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderStudentFaculty() {
      const container = document.getElementById('studentFacultyList');
      document.getElementById('facultyCount').textContent = state.faculty.length;
      
      container.innerHTML = state.faculty.map(faculty => `
        <div class="faculty-card">
          <div class="avatar">${faculty.name.charAt(0)}</div>
          <div>
            <strong>${faculty.name}</strong><br>
            <span class="muted">${faculty.role}</span><br>
            <span class="muted" style="font-size: 0.85rem;">📍 ${faculty.location}</span>
          </div>
          <button class="ghost" onclick="viewFacultyBio('${faculty.id}')">View bio</button>
        </div>
      `).join('');
    }

    function viewFacultyBio(facultyId) {
      const faculty = state.faculty.find(f => f.id === facultyId);
      if (!faculty) return;
      
      alert(`${faculty.name}\n${faculty.role}\n\n${faculty.bio}\n\nLocation: ${faculty.location}`);
    }

    function renderAvailableTeams() {
      const container = document.getElementById('availableTeamsList');
      container.innerHTML = state.teams.map(team => `
        <div class="team-card" onclick="joinTeam('${team.id}')">
          <div>
            <strong>${team.name}</strong><br>
            <span class="muted">${team.members} members · ${team.score} points</span>
          </div>
          <button class="primary" onclick="event.stopPropagation(); joinTeam('${team.id}')">Join</button>
        </div>
      `).join('');
    }

    function renderAssignmentLists() {
      const userTeam = state.currentUser.team;
      const teamSubmissions = state.submissions.filter(s => s.teamId === userTeam);
      
      // Categorize assignments
      const todoAssignments = [];
      const pendingAssignments = [];
      const completeAssignments = [];

      ASSIGNMENTS.forEach(assignment => {
        const submission = teamSubmissions.find(s => s.assignmentId === assignment.id);
        
        if (!submission || submission.status === 'rejected') {
          todoAssignments.push({ ...assignment, submission });
        } else if (submission.status === 'pending') {
          pendingAssignments.push({ ...assignment, submission });
        } else if (submission.status === 'approved') {
          completeAssignments.push({ ...assignment, submission });
        }
      });

      // Render To-Do
      document.getElementById('todoCount').textContent = todoAssignments.length;
      document.getElementById('todoList').innerHTML = todoAssignments.map(a => `
        <div class="list-item">
          <div style="flex: 1;">
            <strong>${a.title}</strong>
            ${a.submission?.status === 'rejected' ? '<span class="status-pill rejected" style="margin-left: 10px;" onclick="showRejectionDetails(\'' + a.submission.id + '\')">Rejected ⚠️</span>' : ''}
            <br>
            <span class="muted">${a.points} pts · Due ${a.due}</span>
          </div>
          <button class="primary" onclick="openAssignmentModal('${a.id}')">View</button>
        </div>
      `).join('');

      // Render Pending
      document.getElementById('pendingCount').textContent = pendingAssignments.length;
      document.getElementById('pendingList').innerHTML = pendingAssignments.map(a => `
        <div class="list-item">
          <div style="flex: 1;">
            <strong>${a.title}</strong><br>
            <span class="muted">${a.points} pts · Submitted ${a.submission.submittedAt.toLocaleDateString()}</span>
          </div>
          <span class="status-pill pending">Under review</span>
        </div>
      `).join('');

      // Render Complete
      document.getElementById('completeCount').textContent = completeAssignments.length;
      document.getElementById('completeList').innerHTML = completeAssignments.map(a => `
        <div class="list-item">
          <div style="flex: 1;">
            <strong>${a.title}</strong><br>
            <span class="muted">${a.points} pts · Approved</span>
          </div>
          <span class="status-pill approved">✓ Complete</span>
        </div>
      `).join('');
    }

    function createTeam() {
      const name = document.getElementById('newTeamName').value.trim();
      if (!name) return alert('Enter a team name');
      
      const newTeam = {
        id: 'T' + Date.now(),
        name,
        members: 1,
        memberNames: ['You'],
        score: 0
      };
      state.teams.push(newTeam);
      state.currentUser.team = newTeam.id;
      document.getElementById('newTeamName').value = '';
      render();
    }

    function joinTeam(teamId) {
      state.currentUser.team = teamId;
      const team = state.teams.find(t => t.id === teamId);
      team.members++;
      render();
    }

    function leaveTeam() {
      if (confirm('Are you sure you want to leave your team?')) {
        const team = state.teams.find(t => t.id === state.currentUser.team);
        if (team) team.members--;
        state.currentUser.team = null;
        render();
      }
    }

    function openAssignmentModal(assignmentId) {
      const assignment = ASSIGNMENTS.find(a => a.id === assignmentId);
      if (!assignment) return;

      state.currentAssignment = assignment;
      const modal = document.getElementById('assignmentModal');
      
      document.getElementById('modalTitle').textContent = assignment.title;
      document.getElementById('modalDescription').textContent = assignment.description;
      document.getElementById('modalPoints').textContent = `${assignment.points} points`;
      document.getElementById('modalDue').textContent = assignment.due;
      document.getElementById('modalLocation').textContent = assignment.location;

      // Check if there's a rejection
      const submission = state.submissions.find(s => 
        s.assignmentId === assignmentId && 
        s.teamId === state.currentUser.team &&
        s.status === 'rejected'
      );

      if (submission) {
        document.getElementById('rejectionSection').classList.remove('hidden');
        document.getElementById('rejectionReason').textContent = submission.rejectionReason;
      } else {
        document.getElementById('rejectionSection').classList.add('hidden');
      }

      // Clear form
      document.getElementById('uploadFile').value = '';
      document.getElementById('submissionComments').value = '';

      modal.classList.remove('hidden');
    }

    function closeAssignmentModal() {
      document.getElementById('assignmentModal').classList.add('hidden');
    }

    function submitAssignment() {
      const fileInput = document.getElementById('uploadFile');
      const comments = document.getElementById('submissionComments').value.trim();
      
      if (!fileInput.files[0]) {
        return alert('Please upload a file');
      }

      const fileName = fileInput.files[0].name;
      const assignment = state.currentAssignment;

      // Remove any existing submissions for this assignment
      state.submissions = state.submissions.filter(s => 
        !(s.assignmentId === assignment.id && s.teamId === state.currentUser.team)
      );

      // Add new submission
      state.submissions.push({
        id: 'S' + Date.now(),
        assignmentId: assignment.id,
        teamId: state.currentUser.team,
        status: 'pending',
        comments: comments || 'No comments',
        fileName,
        submittedAt: new Date()
      });

      closeAssignmentModal();
      render();
      alert('Submission uploaded! Waiting for TA review.');
    }

    function showRejectionDetails(submissionId) {
      const submission = state.submissions.find(s => s.id === submissionId);
      if (!submission) return;

      document.getElementById('rejectionModalReason').textContent = submission.rejectionReason;
      document.getElementById('rejectionModal').classList.remove('hidden');
    }

    function closeRejectionModal() {
      document.getElementById('rejectionModal').classList.add('hidden');
    }

    function renderTAView() {
      // Render teams
      const teamList = document.getElementById('taTeamList');
      teamList.innerHTML = state.teams.map(team => `
        <div class="list-item">
          <div style="flex: 1;">
            <strong>${team.name}</strong><br>
            <span class="muted">${team.members} members · ${team.score} points</span>
          </div>
          <button class="ghost" onclick="openTeamDetailModal('${team.id}')">View</button>
        </div>
      `).join('');
      document.getElementById('teamTotal').textContent = `${state.teams.length} teams`;

      // Render TA leaderboard
      const sorted = [...state.teams].sort((a, b) => b.score - a.score);
      const leaderboardContainer = document.getElementById('taLeaderboard');
      
      leaderboardContainer.innerHTML = sorted.map((team, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : '';
        const maxScore = Math.max(...state.teams.map(t => t.score));
        const percentage = maxScore > 0 ? (team.score / maxScore) * 100 : 0;
        
        return `
          <div class="leaderboard-item">
            <div class="rank-badge ${rankClass}">${rank}</div>
            <div style="flex: 1;">
              <strong>${team.name}</strong>
              <div class="progress-bar" style="margin-top: 6px;">
                <div class="progress-fill" style="width: ${percentage}%"></div>
              </div>
              <span class="muted" style="font-size: 0.85rem;">${team.score} points · ${team.members} members</span>
            </div>
          </div>
        `;
      }).join('');

      // Render assignments
      const assignmentList = document.getElementById('taAssignmentList');
      document.getElementById('assignmentCount').textContent = ASSIGNMENTS.length;
      assignmentList.innerHTML = ASSIGNMENTS.map(assignment => `
        <div class="list-item">
          <div style="flex: 1;">
            <strong>${assignment.title}</strong><br>
            <span class="muted">${assignment.points} pts · Due ${assignment.due}</span>
          </div>
          <button class="ghost" onclick="openAssignmentEditModal('${assignment.id}')">Edit</button>
        </div>
      `).join('');

      // Render faculty
      const facultyList = document.getElementById('taFacultyList');
      document.getElementById('taFacultyCount').textContent = state.faculty.length;
      facultyList.innerHTML = state.faculty.map(faculty => `
        <div class="faculty-card">
          <div class="avatar">${faculty.name.charAt(0)}</div>
          <div style="flex: 1;">
            <strong>${faculty.name}</strong><br>
            <span class="muted">${faculty.role}</span><br>
            <span class="muted" style="font-size: 0.85rem;">📍 ${faculty.location}</span>
          </div>
          <div class="inline" style="gap: 6px;">
            <button class="ghost" onclick="openFacultyModal('${faculty.id}')">Edit</button>
            <button class="danger" onclick="deleteFaculty('${faculty.id}')">Delete</button>
          </div>
        </div>
      `).join('');

      // Render review queue
      const pendingSubmissions = state.submissions.filter(s => s.status === 'pending');
      const reviewList = document.getElementById('reviewList');
      reviewList.innerHTML = pendingSubmissions.map(sub => {
        const assignment = ASSIGNMENTS.find(a => a.id === sub.assignmentId);
        const team = state.teams.find(t => t.id === sub.teamId);
        return `
          <div class="list-item">
            <div style="flex: 1;">
              <strong>${assignment.title}</strong><br>
              <span class="muted">Team: ${team.name} · ${assignment.points} pts</span>
            </div>
            <button class="ghost" onclick="openReviewModal('${sub.id}')">Review</button>
          </div>
        `;
      }).join('');
      document.getElementById('reviewTotal').textContent = `${pendingSubmissions.length} pending`;
    }

    function addTeamAsTA() {
      const name = document.getElementById('taTeamName').value.trim();
      if (!name) return alert('Enter a team name');
      
      state.teams.push({
        id: 'T' + Date.now(),
        name,
        members: 0,
        memberNames: [],
        score: 0
      });
      document.getElementById('taTeamName').value = '';
      render();
    }

    function deleteTeam(teamId) {
      if (confirm('Delete this team?')) {
        state.teams = state.teams.filter(t => t.id !== teamId);
        render();
      }
    }

    function openTeamDetailModal(teamId) {
      const team = state.teams.find(t => t.id === teamId);
      if (!team) return;

      state.currentTeamDetail = team;
      document.getElementById('editTeamName').value = team.name;
      document.getElementById('teamScore').textContent = `${team.score} points`;
      
      const membersList = document.getElementById('teamMembersList');
      membersList.innerHTML = team.memberNames && team.memberNames.length > 0
        ? team.memberNames.map(name => `
            <div style="padding: 8px; background: #f8fafc; border-radius: 8px; margin-bottom: 6px;">
              ${name}
            </div>
          `).join('')
        : '<span class="muted">No members yet</span>';

      document.getElementById('teamDetailModal').classList.remove('hidden');
    }

    function closeTeamDetailModal() {
      document.getElementById('teamDetailModal').classList.add('hidden');
      state.currentTeamDetail = null;
    }

    function saveTeamDetails() {
      const team = state.currentTeamDetail;
      if (!team) return;

      const newName = document.getElementById('editTeamName').value.trim();
      if (!newName) return alert('Team name cannot be empty');

      team.name = newName;
      closeTeamDetailModal();
      render();
    }

    function deleteTeamFromModal() {
      const team = state.currentTeamDetail;
      if (!team) return;

      if (confirm(`Are you sure you want to delete ${team.name}? This cannot be undone.`)) {
        state.teams = state.teams.filter(t => t.id !== team.id);
        closeTeamDetailModal();
        render();
      }
    }

    // Faculty management
    function openFacultyModal(facultyId = null) {
      if (facultyId) {
        const faculty = state.faculty.find(f => f.id === facultyId);
        if (!faculty) return;
        
        state.currentFaculty = faculty;
        document.getElementById('facultyModalTitle').textContent = 'Edit Faculty/Staff Bio';
        document.getElementById('facultyName').value = faculty.name;
        document.getElementById('facultyRole').value = faculty.role;
        document.getElementById('facultyLocation').value = faculty.location;
        document.getElementById('facultyBio').value = faculty.bio;
        document.getElementById('deleteFacultyBtn').classList.remove('hidden');
      } else {
        state.currentFaculty = null;
        document.getElementById('facultyModalTitle').textContent = 'Add Faculty/Staff Bio';
        document.getElementById('facultyName').value = '';
        document.getElementById('facultyRole').value = '';
        document.getElementById('facultyLocation').value = '';
        document.getElementById('facultyBio').value = '';
        document.getElementById('deleteFacultyBtn').classList.add('hidden');
      }
      
      document.getElementById('facultyModal').classList.remove('hidden');
    }

    function closeFacultyModal() {
      document.getElementById('facultyModal').classList.add('hidden');
      state.currentFaculty = null;
      document.getElementById('facultyName').value = '';
      document.getElementById('facultyRole').value = '';
      document.getElementById('facultyLocation').value = '';
      document.getElementById('facultyBio').value = '';
    }

    function saveFaculty() {
      const name = document.getElementById('facultyName').value.trim();
      const role = document.getElementById('facultyRole').value.trim();
      const location = document.getElementById('facultyLocation').value.trim();
      const bio = document.getElementById('facultyBio').value.trim();

      if (!name) return alert('Please enter a name');

      if (state.currentFaculty) {
        // Edit existing
        state.currentFaculty.name = name;
        state.currentFaculty.role = role;
        state.currentFaculty.location = location;
        state.currentFaculty.bio = bio;
      } else {
        // Create new
        state.faculty.push({
          id: 'F' + Date.now(),
          name,
          role,
          location,
          bio
        });
      }

      closeFacultyModal();
      render();
    }

    function deleteFaculty(facultyId) {
      const faculty = state.faculty.find(f => f.id === facultyId);
      if (!faculty) return;

      if (confirm(`Delete ${faculty.name}?`)) {
        state.faculty = state.faculty.filter(f => f.id !== facultyId);
        if (state.currentFaculty?.id === facultyId) {
          closeFacultyModal();
        }
        render();
      }
    }

    function deleteFacultyFromModal() {
      if (!state.currentFaculty) return;
      
      if (confirm(`Delete ${state.currentFaculty.name}?`)) {
        state.faculty = state.faculty.filter(f => f.id !== state.currentFaculty.id);
        closeFacultyModal();
        render();
      }
    }

    // Assignment management
    function openAssignmentEditModal(assignmentId = null) {
      if (assignmentId) {
        const assignment = ASSIGNMENTS.find(a => a.id === assignmentId);
        if (!assignment) return;
        
        state.currentTaskEdit = assignment;
        document.getElementById('assignmentEditModalTitle').textContent = 'Edit Assignment';
        document.getElementById('assignmentTitle').value = assignment.title;
        document.getElementById('assignmentDescription').value = assignment.description;
        document.getElementById('assignmentPoints').value = assignment.points;
        document.getElementById('assignmentDue').value = assignment.due;
        document.getElementById('assignmentLocation').value = assignment.location;
        document.getElementById('deleteAssignmentBtn').classList.remove('hidden');
      } else {
        state.currentTaskEdit = null;
        document.getElementById('assignmentEditModalTitle').textContent = 'Create Assignment';
        document.getElementById('assignmentTitle').value = '';
        document.getElementById('assignmentDescription').value = '';
        document.getElementById('assignmentPoints').value = '';
        document.getElementById('assignmentDue').value = '';
        document.getElementById('assignmentLocation').value = '';
        document.getElementById('deleteAssignmentBtn').classList.add('hidden');
      }
      
      document.getElementById('assignmentEditModal').classList.remove('hidden');
    }

    function closeAssignmentEditModal() {
      document.getElementById('assignmentEditModal').classList.add('hidden');
      state.currentTaskEdit = null;
    }

    function saveAssignment() {
      const title = document.getElementById('assignmentTitle').value.trim();
      const description = document.getElementById('assignmentDescription').value.trim();
      const points = parseInt(document.getElementById('assignmentPoints').value) || 0;
      const due = document.getElementById('assignmentDue').value;
      const location = document.getElementById('assignmentLocation').value.trim();

      if (!title) return alert('Please enter a title');
      if (!description) return alert('Please enter a description');

      if (state.currentTaskEdit) {
        // Edit existing
        state.currentTaskEdit.title = title;
        state.currentTaskEdit.description = description;
        state.currentTaskEdit.points = points;
        state.currentTaskEdit.due = due;
        state.currentTaskEdit.location = location;
      } else {
        // Create new
        ASSIGNMENTS.push({
          id: 'A' + Date.now(),
          title,
          description,
          points,
          due,
          location
        });
      }

      closeAssignmentEditModal();
      render();
    }

    function deleteAssignmentFromModal() {
      if (!state.currentTaskEdit) return;
      
      if (confirm(`Delete "${state.currentTaskEdit.title}"?`)) {
        const index = ASSIGNMENTS.findIndex(a => a.id === state.currentTaskEdit.id);
        if (index > -1) {
          ASSIGNMENTS.splice(index, 1);
        }
        closeAssignmentEditModal();
        render();
      }
    }

    function openReviewModal(submissionId) {
      const submission = state.submissions.find(s => s.id === submissionId);
      if (!submission) return;

      state.currentReview = submission;
      const assignment = ASSIGNMENTS.find(a => a.id === submission.assignmentId);
      const team = state.teams.find(t => t.id === submission.teamId);

      document.getElementById('reviewTeamName').textContent = team.name;
      document.getElementById('reviewAssignmentTitle').textContent = assignment.title;
      document.getElementById('reviewComments').textContent = submission.comments;
      document.getElementById('reviewFile').textContent = submission.fileName;
      document.getElementById('rejectReasonSection').classList.add('hidden');
      document.getElementById('rejectReasonInput').value = '';

      document.getElementById('reviewModal').classList.remove('hidden');
    }

    function closeReviewModal() {
      document.getElementById('reviewModal').classList.add('hidden');
    }

    function showRejectReason() {
      const section = document.getElementById('rejectReasonSection');
      if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
      } else {
        const reason = document.getElementById('rejectReasonInput').value.trim();
        if (!reason) return alert('Please provide a rejection reason');
        reviewSubmission('rejected', reason);
      }
    }

    function reviewSubmission(status, rejectionReason = '') {
      const submission = state.currentReview;
      if (!submission) return;

      submission.status = status;
      if (status === 'rejected') {
        submission.rejectionReason = rejectionReason;
      } else if (status === 'approved') {
        // Add points to team
        const team = state.teams.find(t => t.id === submission.teamId);
        const assignment = ASSIGNMENTS.find(a => a.id === submission.assignmentId);
        if (team && assignment) {
          team.score += assignment.points;
        }
      }

      closeReviewModal();
      render();
    }

    // Initial render
    render();
