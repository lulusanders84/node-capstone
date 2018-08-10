
"use strict";

const getUnitListData = new Promise((resolve, reject) => {
	const patientsSortedByRoom =
		MOCK_PATIENT_DATA.patientData.sort(function (a, b) {
  		return a.room - b.room;
		});
	resolve(patientsSortedByRoom)
	});

function getAndDisplayUnitList() {
	getUnitListData.then(patients => {
		console.log("first then is running", patients);
		return generateUnitListHtml(patients);
	})
	.then(patientsHtml => {
		console.log("second then is running", patientsHtml);
		displayUnitList(patientsHtml);
	});
}

function generateUnitListHtml(patients) {
	return patients.map(patient => {
		return `
			<div class="patient">
				<div class="js-name name">
					<input name="patients" id="${patient._id}" type="checkbox">
					<label for="${patient._id}">
						${patient.name}
					</label>
				</div>
				<div class="age">
					${patient.age}
				</div>
				<div class="room">
					${patient.room}
				</div>
				<div class="admit">
					${formatAdmitDate(patient.admitDate)}
				</div>
			</div>`
	})
}

function formatAdmitDate(admit) {
	const d = new Date(admit);
	return `${d.getUTCMonth()}/${d.getUTCDate()}/${d.getUTCFullYear()}`
}

function displayUnitList(patientsHtml) {
	$('.js-patients-unit-list').html(patientsHtml);
}

function handleAddToAssignmentButton() {
	$('.js-add-assignment').click(function() {
		addPatientsToUsersAssignmentList();
	})
}

function getPatientsForAssignmentList() {
	let patientIds = [];
	$('.js-name input').each(function() {
		if(this.checked) {
			patientIds.push(this.id);
		}
	})
	return patientIds;
}

function addPatientsToUsersAssignmentList() {
	const username = $('.js-username').html();
	const patientIds = getPatientsForAssignmentList();
	MOCK_USER_DATA.userData.forEach(user => {
		if(user.userName === username) {
			user.assignmentList = patientIds;
			alert(`${user.assignmentList.length} patients added to assignment list`);
		}
	});
}

function handleAddToUnitButton() {}

function addPatientToUnitList() {}


function handleRemoveFromUnitButton() {}

function removePatientFromUnitList() {}


function handleGoToAssignmentListButton() {}

function displayAssignmentList() {}


function handleRemovePatientButton() {}

function removePatientFromAssignmentList() {}


function displayPatientReport() {}


function handleUpdatePatientDataButton() {}

function updatePatientData() {}

$(function() {
    getAndDisplayUnitList();
		handleAddToAssignmentButton();
})
