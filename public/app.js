
"use strict";

function updateAssignmentListCount() {
	const userName = $('.js-username').html();
	const assignmentCount = MOCK_USER_DATA.userData.reduce((acc, user) => {
		if (user.userName === userName) {
			acc = user.assignmentList.length;
		}
		return acc;
	}, 0);
	$('.js-assignment-count').html(assignmentCount);
}

const getUnitListData = new Promise((resolve, reject) => {
	const patientsSortedByRoom =
		MOCK_PATIENT_DATA.patientData.sort(function (a, b) {
  		return a.room - b.room;
		});
	resolve(patientsSortedByRoom)
	});

function getAndDisplayUnitList() {
	getUnitListData.then(patients => {
		return generateListHtml(patients);
	})
	.then(patientsHtml => {
		displayUnitList(patientsHtml);
	});
}

function generateListHtml(patients) {
	return patients.map(patient => {
		return `
			<div class="patient">
				<div class="report">
					<button>View</button>
				</div>
				<div class="js-name name">
					<label for="${patient._id}">
					<input name="patients" id="${patient._id}" type="checkbox">
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
	return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`
}

function displayUnitList(patientsHtml) {
	$('.js-patient-list').html(patientsHtml);
}

function handleAddToAssignmentButton() {
	$('.js-add-assignment').click(function() {
		addPatientsToUsersAssignmentList();
		updateAssignmentListCount();
	})
}

function getSelectedPatients() {
	return new Promise((resolve, reject) => {
		let patientIds = [];
		$('.js-name input').each(function() {
			if(this.checked) {
				patientIds.push(this.id);
			}
		})
		resolve(patientIds);
	})
}

function addPatientsToUsersAssignmentList() {
	const userName = $('.js-username').html();
	const user = MOCK_USER_DATA.userData.find(user => {
		return user.userName === userName;
	});
	let patientIdCount;
	getSelectedPatients()
	.then(patientIds => {
		patientIdCount = patientIds.length;
		return detectDuplicatePatients(patientIds, user);
	}).then(newIds => {
		user.assignmentList = user.assignmentList.concat(newIds);

		alert(`${newIds.length} patients added to assignment list \n` +
			`${patientIdCount - newIds.length} not added as already on list`);
		updateAssignmentListCount();
	})
}

function detectDuplicatePatients(patientIds, user) {
	const uniqueIds = [];
	patientIds.forEach(id => {
		const dupes = user.assignmentList.find(listId => {
			return listId === id;
		})
		if (dupes === undefined) {
			uniqueIds.push(id);
		}
	})
	return uniqueIds;
}

function handleAddToUnitButton() {
	$('.js-add-to-unit').click(function() {
		$('.js-add-patient-form').removeClass('inactive');
	})
}

function handleSubmitToUnitButton(event) {
	event.preventDefault();
	addPatientToUnitList();
	getAndDisplayUnitList();
	$('.js-add-patient-form').addClass('inactive');
}

function addPatientToUnitList() {
	const newPatient = {
		"_id": "5b69d386bf98g4952860fe9263",
		"room": `${$('#room').val()}`,
		"admitDate": `${$('#admit').val()}`,
		"name": `${$('#first-name').val()} ${$('#last-name').val()}`,
		"age": `${$('#age').val()}`
	}
	MOCK_PATIENT_DATA.patientData.push(newPatient);
	alert(`${newPatient.name} added to unit list`);
}


function handleRemoveFromUnitButton() {
	$('.js-remove-unit').click(function() {
		removePatientFromUnitList();
	})
}

function removePatientFromUnitList() {
	const patientData = MOCK_PATIENT_DATA.patientData;
	const patientIds = getSelectedPatients();
	patientData.forEach((patient, index) => {
		patientIds.forEach(id => {
			if(patient._id === id) {
				if (window.confirm(`Delete ${patient.name} from unit list?`)) {
					patientData.splice(index, 1);
				}
			}
		})
	})
	getAndDisplayUnitList();
}

function handleGoToAssignmentButton() {
	$('.js-go-to-assignment').click(function() {
		goToAssignmentList();
	})
}

function handleGoToAssignmentNavButton() {
	$('.js-go-to-assignment-nav').click(function() {
		goToAssignmentList();
	})
}

function goToAssignmentList() {
	const userName = $('.js-username').html();
	$(`.js-name input`).prop('checked', false);
	$('h1').html(`${userName}'s Assignment`);
	$('header p').html('Click view to see patient\'s nursing report');
	$('.js-add-assignment').toggleClass('inactive');
	$('.js-add-to-unit').toggleClass('inactive');
	$('.js-go-to-assignment').toggleClass('inactive');
	$('.js-go-to-unit').toggleClass('inactive');
	getAndDisplayAssignmentList();
}

function getAssignmentListData() {
	return new Promise((resolve, reject) => {
	const patientIds = getAssignmentList();
	const patientData = getSelectedPatientData(patientIds);
	resolve(patientData);
})
}

function getAssignmentList() {
	const userName = $('.js-username').html();
	const user = MOCK_USER_DATA.userData.find(user => {
	return user.userName === userName;
	})
	return user.assignmentList;
}

function getSelectedPatientData(patientIds) {
	const patientData = MOCK_PATIENT_DATA.patientData;
	let selectedPatients = [];
	patientData.forEach(patient => {
		patientIds.forEach(id => {
			if(patient._id === id) {
				selectedPatients.push(patient);
			}
		});
	});
	return selectedPatients;
}

function displayAssignmentList(patientsHtml) {
	$('.js-patient-list').html(patientsHtml);
}

function getAndDisplayAssignmentList() {
	getAssignmentListData().then(patients => {
		return generateListHtml(patients);
	}).then(patientsHtml => {
		displayAssignmentList(patientsHtml);
	})
}

function handleRemovePatientFromAssignmentButton() {
	$('.js-remove-assignment').click(function() {

	})
}

function removePatientFromAssignmentList() {
	const userData = MOCK_USER_DATA.userData;
	const patientIds = getSelectedPatients();
	patientData.forEach((patient, index) => {
		patientIds.forEach(id => {
			if(patient._id === id) {
				patientData.splice(index, 1);
			}
		})
	})
	alert(`${patientIds.length} patients removed from unit list`);
	getAndDisplayUnitList();
}

function displayPatientReport() {

}

function handleGoToUnitListButton() {
	$('.js-go-to-unit').click(function() {
		$(`.js-name input`).prop('checked', false);
		$('h1').html(`Cardiovascular Medical Unit`);
		$('header p').html('Select which patients to add to your assignment list or manage unit list');
		$('.js-add-assignment').toggleClass('inactive');
		$('.js-add-to-unit').toggleClass('inactive');
		$('.js-go-to-assignment').toggleClass('inactive');
		$('.js-go-to-unit').toggleClass('inactive');
    getAndDisplayUnitList();
	})
}

function handleUpdatePatientDataButton() {}

function updatePatientData() {}

$(function() {
    getAndDisplayUnitList();
		updateAssignmentListCount();
		handleAddToAssignmentButton();
		handleGoToAssignmentButton();
		handleGoToAssignmentNavButton();
		handleAddToUnitButton();
		handleRemoveFromUnitButton();
		handleGoToUnitListButton();
})
