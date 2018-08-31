
"use strict";

let patientToUpdate;

let update = {
	reportId: null,
	dataType: null,
	data: {}
};

function updatePatientToUpdate(patientId) {
	patientToUpdate = patientId;
}

function populateUpdateObjData(key, data) {
	update.data[key] = data;
}

function emptyUpdateObjData() {
	update.dataType = {};
	update.data = {};
}

function populateUpdateObjReportIdAndDataType(reportId, dataType) {
	update.reportId = reportId;
	update.dataType = dataType;
}


function getUserData(userName) {
	return $.ajax({
			method: "GET",
			url: `http://localhost:3000/api/users/${userName}`,
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
	});
}

function updateAssignmentListCount() {
	const userName = $('.js-username').html();
	const user = getUserData(userName);
	user.done(function(data) {
		$('.js-assignment-count').html(data.assignmentList.length);
	})
}



function getAndDisplayUnitList() {
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/api/patients",
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
	}).done(function(data) {
		console.log("get and display unit list running");
		data = sortPatientsByRoom(data);
		data.listType = "unit";
		const html = generateListHtml(data);
		displayUnitList(html);
	}).fail(error => {
		console.log("Server not responding");
	});
}

function addPatientToUnitList() {
	console.log($('#admit').val());
	$.ajax({
		method: "POST",
		url: 'http://localhost:3000/api/patients',
		data: JSON.stringify({
			"room": `${$('#new-room').val()}`,
			"admitDate": `${$('#new-admit').val()}`,
			"name": `${$('#first-name').val()} ${$('#last-name').val()}`,
			"age": `${$('#new-age').val()}`
		}),
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		}
	}).done(function(data, status) {
		console.log(data);
		alert(`${data.name} added to unit list`);
		getAndDisplayUnitList();
	})
}

function sortPatientsByRoom(data) {
	return data.sort(function (a, b) {
		return a.report.room - b.report.room;
	});
}

function generateListHtml(patients) {
	return patients.map(patient => {
		return `
			<div class="js-patient patient">
				<div class="report">
					<button id="${generateHtmlData(patients.listType, "_id", patient)}" class="js-view-button">View</button>
				</div>
				<div class="js-name name">
					<label for="${patient._id}">
					<input class="js-input" name="patients" id="${patient._id}" type="checkbox">
							<span class="${patient._id}">${generateHtmlData(patients.listType, "name", patient)}</span>
					</label>
				</div>
				<div class="age">
					${generateHtmlData(patients.listType, "age", patient)}
				</div>
				<div class="room">
					${generateHtmlData(patients.listType, "room", patient)}
				</div>
				<div class="admit">
					${formatDate(generateHtmlData(patients.listType, "admitDate", patient))}
				</div>
				<div class="js-discharge discharge">
					${formatDate(generateHtmlData(patients.listType, "dischargeDate", patient))}
				</div>
			</div>`
	})
}

function generateHtmlData(listType, dataType, patient) {
	if (listType === 'unit') {
		return `${patient.report[dataType]}`;
	} else {
		return `${patient[dataType]}`;
	}
}

function formatDate(date) {
	if(date === "") {
		return date;
	} else {
		const d = new Date(date);
		return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`
	}
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
		let patientIds = [];
		$('.js-name input').each(function() {
			if(this.checked) {
				patientIds.push(this.id);
			}
		})
		return patientIds;
}

function addPatientsToUsersAssignmentList() {
	const userName = $('.js-username').html();
	const user = getUserData(userName);
	const patientIds = getSelectedPatients();
	user.done(function(data) {
			const newIds = detectDuplicatePatients(patientIds, data);
			$.ajax({
				method: "PUT",
				url: `http://localhost:3000/api/users/${userName}`,
				data: JSON.stringify(newIds),
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json"
				}
			}).done(function(data) {
					console.log(data, "length", data.length);

					alert(`patients added to assignment list`);
					updateAssignmentListCount();
			})
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

function handleDischargeDateUpdate() {
	$('.js-patient-list').on('click', '.js-discharge', function() {
	const patientId = $(this).closest('.js-patient').find('.js-input').attr('id');
	updatePatientToUpdate(patientId);
	renderUpdateDischargeDate();
	})
}

function renderUpdateDischargeDate() {
	$('.js-update-dc').removeClass('closed');
	$('.modal-overlay').removeClass('inactive');
}

function updateDischargeDate(event) {
	event.preventDefault();
	const dischargeDate = {
		date: $('#dc-date').val()
	};
	$.ajax({
		method: "PUT",
		url: `http://localhost:3000/api/reports/${patientToUpdate}`,
		data: JSON.stringify(dischargeDate),
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		}
	}).done(function(data) {
			closeModal();
			getAndDisplayUnitList();
	})
}

function handleUpdatePatientData() {
	$('.data').click(function() {
		const dataType = $(this).closest('div').attr('id');
		const data = $(this).html();
		const reportId = $('.js-report-id').attr('id');
		console.log("dataType:", dataType, "data:", data, "reportId:", reportId);
		populateUpdateObjReportIdAndDataType(reportId, dataType);
		console.log(update);
		renderUpdateModal(dataType, data);
	})
}

function formatDataLabel(dataType) {
	const dataTypeArr = dataType.split('');
	dataTypeArr[0] = dataTypeArr[0].toUpperCase();
	return dataTypeArr.join('');
}
function renderUpdateModal(dataType, data) {
	$('.js-update-report').removeClass('closed');
	$('.modal-overlay').removeClass('inactive');
	$('#data-label').html(formatDataLabel(dataType));
	$('#data').val(data);
}

function handleUpdateReportSubmit(event) {
	event.preventDefault();
	const data = $('#data').val();
	populateUpdateObjData(update.dataType, data);
	console.log(update);
	$.ajax({
		method: "PUT",
		url: `http://localhost:3000/api/reports/`,
		data: JSON.stringify(update),
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		}
	}).done(function(data) {
		emptyUpdateObjData
			closeModal();
			renderPatientReport(data);
			displayPatientReport();
	})
}

function closeModal() {
	$('.js-update-dc, .js-update-report').addClass('closed');
	$('.modal-overlay').addClass('inactive');
}
function handleCloseModalButton() {
	$('.js-close-modal').click(function() {
		closeModal();
	})
}

function handleGoToAssignmentButton() {
	$('.js-go-to-assignment').click(function() {
		goToAssignmentList();
	})
}

function handleGoToAssignmentNavButton() {
	$('.js-go-to-assignment-nav').click(function() {
		goToAssignmentList();
		this.disabled = true;
	})
}

function goToAssignmentList() {
	getAndDisplayAssignmentList();
	const userName = $('.js-username').html();
	$(`.js-name input`).prop('checked', false);
	$('h1').html(`${userName}'s Assignment`);
	$('header p').html('Click view to see patient\'s nursing report');
	$('.js-add-assignment').addClass('inactive');
	$('.js-add-to-unit').addClass('inactive');
	$('.js-go-to-assignment').addClass('inactive');
	$('.js-go-to-unit').removeClass('inactive');
	$('.js-list-container').removeClass('inactive');
	$('.js-report-container').addClass('inactive');
	$('.js-remove-assignment').removeClass('inactive');
	$('.js-remove-unit').addClass('inactive');
}

function getAndDisplayAssignmentList() {
	const userName = $('.js-username').html();
	$.ajax({
		type: "GET",
		url: `http://localhost:3000/api/users/assignment/${userName}`,
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
	}).done(function(data) {
		data.listType = "assignment";
		const html = generateListHtml(data);
		displayAssignmentList(html);
	})
}

function displayAssignmentList(patientsHtml) {
	$('.js-patient-list').html(patientsHtml);
}

function handleRemovePatientFromAssignmentButton() {
	$('.js-remove-assignment').click(function() {
		console.log("remove assignment running");
		removePatientFromAssignmentList();
		$(`.js-name input`).prop('checked', false);
	})
}

function removePatientFromAssignmentList() {
	const userName = $('.js-username').html();
	const patientIds = getSelectedPatients();
		$.ajax({
			url: `http://localhost:3000/api/users/assignment/${userName}`,
			method: "PUT",
			data: JSON.stringify(patientIds),
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json"
			}
		}).done(function(data) {
			getAndDisplayAssignmentList();
			updateAssignmentListCount();
		})
}

function getAndDisplayPatientReport(patientId) {
	console.log(`http://localhost:3000/api/reports/${patientId}`);
	$.ajax({
		type: "GET",
		url: `http://localhost:3000/api/reports/${patientId}`,
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
	}).done(function(data) {
		console.log(data);
	renderPatientReport(data);
	displayPatientReport();
}).fail(error => {
	console.log("Server not responding");
});
}

function displayPatientReport() {
	$('.js-report-container').removeClass('inactive');
	$('.js-report-button').removeClass('inactive');
	$('h1').html('Nursing Report');
	$('header p').html('');
	$('.js-list-container').addClass('inactive');
}

function renderPatientReport(patient) {
	Object.keys(patient).forEach(key => {
		if(patient[key] === null) {
			patient[key] = '';
		}
	});
	$('.js-report-id').attr({id: `${patient._id}`});
	$('.js-report-room').html(`${patient.room}`);
	$('.js-report-age').html(`${patient.age}`);
	$('.js-report-name').html(`${patient.name}`);
	$('.js-report-admit').html(`${formatDate(patient.admitDate)}`);
	$('.js-report-dx').html(`${patient.diagnosis}`);
	$('.js-report-history').html(`${patient.history}`);
	$('.js-report-allergies').html(`${patient.allergies}`);
	$('.js-report-discharge').html(`${formatDate(patient.dischargeDate)}`);
	$('.js-report-gu').html(`${patient.GU}`);
	$('.js-report-gi').html(`${patient.GI}`);
	$('.js-report-diet').html(` `);
	$('.js-report-input').html(`${patient.input}`);
	$('.js-report-output').html(`${patient.output}`);
	$('.js-report-pain').html(`${patient.pain}`);
	$('.js-report-O2').html(`${patient.O2}`);
	$('.js-report-telemetry').html(`${patient.telemetry}`);
	$('.js-report-SCDs').html(`${patient.SCDs}`);
	$('.js-report-TED').html(`${patient.TED}`);
	$('.js-report-assist').html(`${patient.assist}`);
	$('.js-report-skinWounds').html(`${patient.skinWounds}`);
	$('.js-report-hemo').html(`${patient.hemo}`);
	$('.js-report-wbc').html(`${patient.wbc}`);
	$('.js-report-plt').html(`${patient.plt}`);
	$('.js-report-k').html(`${patient.K}`);
	$('.js-report-na').html(`${patient.Na}`);
	$('.js-report-cr').html(`${patient.Cr}`);
}

function handleViewReportButton() {
	$('.js-patient-list').on('click', '.js-view-button', function() {
		getAndDisplayPatientReport(this.id);
	});
}

function openUpdateData() {
	$('.data').click(function() {
		console.log(($(this).closest('div').html()));
	})
}

function handleGoToUnitListButton() {
	$('.js-go-to-unit').click(function() {
		$(`.js-name input`).prop('checked', false);
		$('h1').html(`Cardiovascular Medical Unit`);
		$('header p').html('Select which patients to add to your assignment list or manage unit list');
		$('.js-list-container').removeClass('inactive');
		$('.js-report-container').addClass('inactive');
		$('.js-add-assignment').removeClass('inactive');
		$('.js-add-to-unit').removeClass('inactive');
		$('.js-go-to-assignment').removeClass('inactive');
		$('.js-go-to-unit').addClass('inactive');
		$('.js-remove-assignment').addClass('inactive');
		$('.js-remove-unit').removeClass('inactive');
		$('.js-go-to-assignment-nav').prop('disabled', false);
    getAndDisplayUnitList();
	})
}

function handleUpdatePatientDataButton() {}

function updatePatientData() {}

$(function() {
		openUpdateData();
    getAndDisplayUnitList();
		updateAssignmentListCount();
		handleAddToAssignmentButton();
		handleGoToAssignmentButton();
		handleGoToAssignmentNavButton();
		handleAddToUnitButton();
		handleRemovePatientFromAssignmentButton();
		handleGoToUnitListButton();
		handleViewReportButton();
		handleUpdatePatientData();
		handleDischargeDateUpdate();
		handleCloseModalButton();
});
