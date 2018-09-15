
"use strict";

function handleSignUpButton() {
	$('#sign-up-button').click(function() {
		$('#auth-h3').html('Register');
		$('.js-auth').removeClass('closed');
		$('.js-user-first-name, .js-user-last-name', '.js-passkey').removeClass('inactive');
		$('.modal-overlay').removeClass('inactive');
	})
}

function handleSignUpSubmitButton(event) {
	event.preventDefault();
	registerNewUser();
}

function registerNewUser() {
	const newUser = {
		userName: $('#username').val(),
		password: $('#password').val(),
		firstName: $('#user-first-name').val(),
		lastName: $('#user-last-name').val()
	}
	$.ajax({
		method: "POST",
		url: 'http://localhost:3000/api/users',
		data: JSON.stringify(newUser),
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		}
	}).done(function(data) {
		renderConfirmModal(data.userName);
	})
}

function renderConfirmModal(username) {
	username = (username === undefined ? "" : username);
	$('#auth-form').attr('onsubmit', 'handleLoginSubmitButton(event)');
	$('.js-user-first-name').addClass('inactive');
	$('.js-user-last-name').addClass('inactive');
	$('#auth-h3').html('Registration completed, please enter password to continue to unit list');
	$('.js-user-username').val(username);
}

function handleLoginButton() {
	$('#login-button').click(function() {
		renderLogin();
	})
}

function renderLogin() {
	$('#auth-form').attr('onsubmit', 'handleLoginSubmitButton(event)');
	$('#auth-h3').html('Login');
	$('.js-auth').removeClass('closed');
	$('.js-user-first-name, .js-user-last-name').addClass('inactive');
	$('.modal-overlay').removeClass('inactive');
}

function handleLoginSubmitButton(event) {
		event.preventDefault();
		const username = $('#username').val();
		const password = $('#password').val();
		sendLoginPostRequest(username, password);
	}

function sendLoginPostRequest(username, password) {
	const user = {
		username: username,
		password: password
	};
	$.ajax({
		method: "POST",
		url: 'http://localhost:3000/api/auth/login',
		data: JSON.stringify(user),
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json"
		}
	}).done(function(data) {
		const authTokenStr = JSON.stringify(data.authToken);
		localStorage.setItem('authToken', authTokenStr);
		closeModal();
		getAndDisplayUnitList();
		$('.js-dropdown').removeClass('inactive');
		$('.js-username').attr('id', `${data.user._id}`);
		$('.js-username').html(data.user.firstName);
		$('.js-assignment-count').html(data.user.assignmentLength);
		$('#landing-page').addClass('inactive');
	}).fail(function( jqXHR, textStatus ) {
		invalidPassword();
	})
}

function invalidPassword() {
	$('.js-invalid').removeClass('inactive')
	.html('Invalid password, try login again');
}

function getAndDisplayUnitList() {
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/api/patients",
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
	}).done(function(data) {
		data = sortPatientsByRoom(data);
		data.listType = "unit";
		const html = generateListHtml(data);
		displayUnitList(html);
	}).fail(error => {
		console.log("Server not responding");
	});
}



function sortPatientsByRoom(data) {
	if(data.listType == "assignment") {
		return data.sort(function (a, b) {
			return a.room - b.room;
		});
	} else {
		return data.sort(function (a, b) {
			return a.report.room - b.report.room;
		});
	}
}

function generateListHtml(patients) {
	return patients.map(patient => {
		return `
			<ul class="js-patient patient">
				<li class="report">
					<button name="${generateHtmlData(patients.listType, "_id", patient)}" class="js-view-button">View</button>
				</li>
				<li class="js-name name">
					<label for="${patient._id}">
					<input class="js-input" name="patients" id="${patient._id}" type="checkbox">
							<span class="${patient._id}">${generateHtmlData(patients.listType, "name", patient)}</span>
					</label>
				</li>
				<li class="age">
					${generateHtmlData(patients.listType, "age", patient)}
				</li>
				<li class="room">
					${generateHtmlData(patients.listType, "room", patient)}
				</li>
				<li class="js-discharge discharge">
					${formatDate(generateHtmlData(patients.listType, "dischargeDate", patient))}
				</li>
			</ul>`
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
		return '--';
	} else {
		const d = new Date(date);
		return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`
	}
}

function displayUnitList(patientsHtml) {
	$('.js-list').removeClass('inactive');
	$('.intro-nav').removeClass('inactive');
	$('h1').addClass('inactive');
	$('html').removeClass('landing-page');
	$('html').addClass('main-page');
	$('.js-unit-title').html('Cardiovascular Medical Unit');
	$('.js-header-text').html('From the unit list select patients to add to your assignment list.<br> Patients are removed from the unit list the day after discharge.');
	$('.js-patient-list').html(patientsHtml);
}

function handleAddToUnitButton() {
	$('.js-add-to-unit').click(function() {
		$('.js-add-new-patient').removeClass('closed');
		$('.modal-overlay').removeClass('inactive');
	})
}

function handleSubmitToUnitButton(event) {
	event.preventDefault();
	addPatientToUnitList();
	getAndDisplayUnitList();
	closeModal();
}

function addPatientToUnitList() {
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
		getAndDisplayUnitList();
	})
}

function closeModal() {
	$('.js-add-new-patient, .js-update-report, .js-auth').addClass('closed');
	$('.modal-overlay').addClass('inactive');
	resetInputType();
}

function handleSelectedPatient() {
	$('.js-patient-list').on('change', 'input[type=checkbox]', function() {
		$(event.target).closest('ul.js-patient').toggleClass('selected');
	})
}

function handleAddToAssignmentButton() {
	$('.js-add-assignment').click(function() {
		addPatientsToUsersAssignmentList();
	})
}

function addPatientsToUsersAssignmentList() {
	const userId = $('.js-username').attr('id');
	const user = getUserData(userId);

	user.done(function(data) {
			const patientIds = getSelectedPatients();
			$.ajax({
				method: "PUT",
				url: `http://localhost:3000/api/users/${userId}`,
				data: JSON.stringify(patientIds),
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${getAuthToken()}`
				}
			}).done(function(data) {
					updateAssignmentListCount(data.assignmentList);
					$('.js-message').html(data.message);
					setTimeout(function(){ $('.js-message').html(''); }, 5000);
			})
		})
}

function getUserData(userId) {
	return $.ajax({
			method: "GET",
			url: `http://localhost:3000/api/users/${userId}`,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Authorization": `Bearer ${getAuthToken()}`
			}
	});
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

function getAuthToken() {
	return JSON.parse(localStorage.getItem('authToken'));
}

function updateAssignmentListCount(data) {
		$('.js-assignment-count').html(data.length);
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
	$('h2').html(`${userName}'s Assignment`);
	$('header p').html('Click view to see patient\'s nursing report');
	$('.js-add-assignment').addClass('inactive');
	$('.js-add-to-unit').addClass('inactive');
	$('.js-go-to-assignment').addClass('inactive');
	$('.js-go-to-unit').removeClass('inactive');
	$('.js-list-container').removeClass('inactive');
	$('.js-report-container').addClass('inactive');
	$('.js-remove-assignment').removeClass('inactive');
	$('.js-remove-unit').addClass('inactive');
	$('.js-show-report, .js-hide-report').addClass('inactive');

}

function getAndDisplayAssignmentList() {
	const userId = $('.js-username').attr('id');
	$.ajax({
		type: "GET",
		url: `http://localhost:3000/api/users/assignment/${userId}`,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Authorization": `Bearer ${getAuthToken()}`
		}
	}).done(function(data) {
		data.listType = "assignment";
		data = sortPatientsByRoom(data);
		const html = generateListHtml(data);
		displayAssignmentList(html);
	})
}

function displayAssignmentList(patientsHtml) {
	$('.js-patient-list').html(patientsHtml);
}

function handleRemovePatientFromAssignmentButton() {
	$('.js-remove-assignment').click(function() {
		removePatientFromAssignmentList();
		$(`.js-name input`).prop('checked', false);
	})
}

function removePatientFromAssignmentList() {
	const userId = $('.js-username').attr('id');
	const patientIds = getSelectedPatients();
		$.ajax({
			url: `http://localhost:3000/api/users/assignment/${userId}`,
			method: "PUT",
			data: JSON.stringify(patientIds),
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getAuthToken()}`
			}
		}).done(function(data) {
			getAndDisplayAssignmentList();
			updateAssignmentListCount(data);
		})
}

function handleGoToUnitListButton() {
	$('.js-go-to-unit').click(function() {
		$('.js-auth').addClass('closed');
		closeModal();
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
		$('.js-show-report, .js-hide-report').addClass('inactive');
    getAndDisplayUnitList();
	})
}

function handleViewReportButton() {
	$('.js-patient-list').on('click', '.js-view-button', function() {
		$('.js-add-assignment').addClass('inactive');
		$('.js-add-to-unit').addClass('inactive');
		$('.js-go-to-unit').removeClass('inactive');
		$('.js-go-to-assignment').removeClass('inactive');
		$('.js-show-report').removeClass('inactive');
		$('.js-hide-report').removeClass('inactive');
		getAndDisplayPatientReport(this.name);
	});
}

function getAndDisplayPatientReport(patientId) {
	$.ajax({
		type: "GET",
		url: `http://localhost:3000/api/reports/${patientId}`,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Authorization": `Bearer ${getAuthToken()}`
		}
	}).done(function(data) {
	renderPatientReport(data);
	displayPatientReport(data);
}).fail(error => {
	console.log("Server not responding");
});
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
	$('.js-report-diet').html(`${patient.diet}`);
	$('.js-report-input').html(`${patient.input}`);
	$('.js-report-output').html(`${patient.output}`);
	$('.js-report-pain').html(`${patient.pain}`);
	$('.js-report-O2').html(`${patient.O2}`);
	$('.js-report-telemetry').html(`${patient.telemetry}`);
	setSliderInputsCheckedProperty(patient.SCDs, 'SCDs');
	setSliderInputsCheckedProperty(patient.TED, 'TED');
	$('.js-report-assist').html(`${patient.assist}`);
	$('.js-report-skinWounds').html(`${patient.skinWounds}`);
	$('.js-report-hemo').html(`${patient.hemo}`);
	$('.js-report-wbc').html(`${patient.wbc}`);
	$('.js-report-plt').html(`${patient.plt}`);
	$('.js-report-k').html(`${patient.K}`);
	$('.js-report-na').html(`${patient.Na}`);
	$('.js-report-cr').html(`${patient.Cr}`);
}

function displayPatientReport(patient) {
	$('.js-remove-assignment').addClass('inactive');
	$('.js-report-container').removeClass('inactive');
	$('h2').html(`Nursing Report for ${patient.name}`);
	$('header p').html('');
	$('.js-list-container').addClass('inactive');

}

function setSliderInputsCheckedProperty(reportItem, dataType) {
	reportItem = reportItem.toLowerCase();
	if (reportItem === "true") {
		$(`#${dataType}-checkbox`).prop("checked", true);
	} else {
		$(`#${dataType}-checkbox`).prop("checked", false);
	}
}

function handleSliderChange() {
	$('.js-slider').change(function() {
		updateReportIdAndDataType(this);
		const data = $(this).prop('checked');
		populateUpdateObjData(update.dataType, data);
		$.ajax({
			method: "PUT",
			url: `http://localhost:3000/api/reports/`,
			data: JSON.stringify(update),
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getAuthToken()}`
			}
		}).done(function(data) {
		})
	})
}

function handleShowFullReportButton() {
	$('.js-show-report').click(function() {
		$('.js-report-content').removeClass('inactive');
		$('.js-report-menu-item').addClass('open');
	})
}

function handleHideFullReportButton() {
	$('.js-hide-report').click(function() {
		$('.js-report-content').addClass('inactive');
		$('.js-report-menu-item').removeClass('open');
	})
}

function handleOpenReportMenuItemButton() {
	$('.js-report-menu').click(function() {
		$(this).closest('div').find('.js-report-content').toggleClass('inactive', 'open');
	})
}

function handleUpdatePatientData() {
	$('.data').click(function() {
		updateReportIdAndDataType(this);
		const data = $(this).find('span').html();
		renderUpdateModal(update.dataType, data);
	})
}

let update = {
	reportId: null,
	dataType: null,
	data: {}
};

function updateReportIdAndDataType(dataItem) {
	const dataType = $(dataItem).closest('div').attr('id');
	const reportId = $('.js-report-id').attr('id');
	populateUpdateObjReportIdAndDataType(reportId, dataType);
}

function populateUpdateObjReportIdAndDataType(reportId, dataType) {
	update.reportId = reportId;
	update.dataType = dataType;
}

function renderUpdateModal(dataType, data) {
	renderInputType(dataType);
	$('.js-update-report').removeClass('closed');
	$('.modal-overlay').removeClass('inactive');
	$('#data-label').html(`${formatDataLabel(dataType)}:`);
	$('#data').val(data);
}

function renderInputType(dataType) {
	if(dataType === "admitDate" || dataType === "dischargeDate") {
		$('#data').attr('type', 'date');
	} else if(dataType === "GU") {
		$('.js-data-inputs').html(
			`<input type="radio" name="gu" id="hat" value="hat">
			<label for="hat">Hat</label>
			<input type="radio" name="gu" id="foley" value="foley">
			<label for="foley">Foley</label>
			<input type="radio" name="gu" id="urinal" value="urinal">
			<label for="urinal">Urinal</label>
		`);
	} else {
		$('#data').attr('type', 'text');
	}
}

function formatDataLabel(dataType) {
	const dataTypeArr = dataType.split('');
	dataTypeArr[0] = dataTypeArr[0].toUpperCase();
	return dataTypeArr.join('');
}

function handleUpdateReportSubmit(event) {
	event.preventDefault();
	function data() {
		if(update.dataType === "GU") {
			return $('input[name=gu]:checked').val();
		} else {
			return $('#data').val();
		}
	}
	populateUpdateObjData(update.dataType, data());
	$.ajax({
		method: "PUT",
		url: `http://localhost:3000/api/reports/`,
		data: JSON.stringify(update),
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
			"Authorization": `Bearer ${getAuthToken()}`
		}
	}).done(function(data) {
			resetInputType();
			closeModal();
			renderPatientReport(data);
			displayPatientReport(data);
	})
}

function populateUpdateObjData(key, data) {
	update.data[key] = data;
}

function resetInputType() {
	$('.js-data-inputs').html(`<input type="text" id="data">`);
}

function handleCloseModalButton() {
	$('.js-close-modal').click(function() {
		closeModal();
	})
}

$(function() {
		handleLoginButton();
		handleSignUpButton();
		handleSelectedPatient();
		handleAddToAssignmentButton();
		handleGoToAssignmentButton();
		handleGoToAssignmentNavButton();
		handleAddToUnitButton();
		handleRemovePatientFromAssignmentButton();
		handleGoToUnitListButton();
		handleViewReportButton();
		handleUpdatePatientData();
		handleCloseModalButton();
		handleOpenReportMenuItemButton();
		handleShowFullReportButton();
		handleHideFullReportButton();
		handleSliderChange();
});
