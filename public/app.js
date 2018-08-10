
"use strict";

const MOCK_PATIENT_DATA = 	{
	"patientData": [
	  {
	    "_id": "5b69d3863938d90de747e4d7",
	    "room": 3507,
	    "admitDate": "Tue Aug 07 2018 09:15:08 GMT+0000 (UTC)",
	    "name": "Sparks Simmons",
	    "age": 81,
	    "service": "ullamco",
	    "allergies": "mollit",
	    "code": "voluptate",
	    "isolation": "cillum",
	    "diagnosis": "exercitation eiusmod",
	    "history": "occaecat sint excepteur proident",
	    "GU": "et",
	    "GI": "velit",
	    "fluids": "et",
	    "input": 1794,
	    "output": 1510,
	    "O2": "aute",
	    "telemetry": "dolore",
	    "pain": 4,
	    "SCDs": true,
	    "TED": false,
	    "assist": "elit",
	    "skinWounds": "culpa",
	    "labs": {
	      "hemo": 25,
	      "wbc": 6332,
	      "plt": 385804,
	      "K": 3,
	      "Na": 136,
	      "Cr": 1
	    }
	  },
	  {
	    "_id": "5b69d3862497f75961cba4eb",
	    "room": 3508,
	    "admitDate": "Sun Aug 05 2018 09:56:00 GMT+0000 (UTC)",
	    "name": "Mildred Mccray",
	    "age": 70,
	    "service": "laborum",
	    "allergies": "ipsum",
	    "code": "aliqua",
	    "isolation": "non",
	    "diagnosis": "fugiat dolore",
	    "history": "ullamco dolore elit elit",
	    "GU": "tempor",
	    "GI": "velit",
	    "fluids": "dolor",
	    "input": 1808,
	    "output": 1802,
	    "O2": "laborum",
	    "telemetry": "ipsum",
	    "pain": 9,
	    "SCDs": true,
	    "TED": true,
	    "assist": "proident",
	    "skinWounds": "consectetur",
	    "labs": {
	      "hemo": 12,
	      "wbc": 19762,
	      "plt": 401036,
	      "K": 4,
	      "Na": 137,
	      "Cr": 0
	    }
	  },
	  {
	    "_id": "5b69d386858f5daf71a79af7",
	    "room": 3501,
	    "admitDate": "Fri Aug 03 2018 22:56:21 GMT+0000 (UTC)",
	    "name": "Rosetta Hebert",
	    "age": 64,
	    "service": "ullamco",
	    "allergies": "Lorem",
	    "code": "reprehenderit",
	    "isolation": "anim",
	    "diagnosis": "est et",
	    "history": "veniam dolor ea exercitation",
	    "GU": "aute",
	    "GI": "deserunt",
	    "fluids": "ipsum",
	    "input": 1101,
	    "output": 905,
	    "O2": "laborum",
	    "telemetry": "voluptate",
	    "pain": 8,
	    "SCDs": false,
	    "TED": false,
	    "assist": "aliqua",
	    "skinWounds": "eu",
	    "labs": {
	      "hemo": 28,
	      "wbc": 9367,
	      "plt": 335312,
	      "K": 5,
	      "Na": 143,
	      "Cr": 1
	    }
	  },
	  {
	    "_id": "5b69d38647cc3f7092afa510",
	    "room": 3523,
	    "admitDate": "Wed Aug 01 2018 16:36:29 GMT+0000 (UTC)",
	    "name": "Letha Gallagher",
	    "age": 69,
	    "service": "officia",
	    "allergies": "esse",
	    "code": "incididunt",
	    "isolation": "ex",
	    "diagnosis": "ad tempor",
	    "history": "incididunt consectetur et ad",
	    "GU": "anim",
	    "GI": "aliqua",
	    "fluids": "ex",
	    "input": 580,
	    "output": 1635,
	    "O2": "aliquip",
	    "telemetry": "ullamco",
	    "pain": 9,
	    "SCDs": false,
	    "TED": false,
	    "assist": "commodo",
	    "skinWounds": "magna",
	    "labs": {
	      "hemo": 9,
	      "wbc": 7857,
	      "plt": 237699,
	      "K": 5,
	      "Na": 137,
	      "Cr": 2
	    }
	  },
	  {
	    "_id": "5b69d3869cf74d64a14df3af",
	    "room": 3530,
	    "admitDate": "Mon Aug 06 2018 22:11:54 GMT+0000 (UTC)",
	    "name": "Neva Robles",
	    "age": 60,
	    "service": "et",
	    "allergies": "veniam",
	    "code": "nisi",
	    "isolation": "officia",
	    "diagnosis": "occaecat adipisicing",
	    "history": "tempor cupidatat est eu",
	    "GU": "cupidatat",
	    "GI": "incididunt",
	    "fluids": "magna",
	    "input": 1824,
	    "output": 607,
	    "O2": "mollit",
	    "telemetry": "officia",
	    "pain": 4,
	    "SCDs": true,
	    "TED": true,
	    "assist": "amet",
	    "skinWounds": "excepteur",
	    "labs": {
	      "hemo": 11,
	      "wbc": 5625,
	      "plt": 447875,
	      "K": 5,
	      "Na": 144,
	      "Cr": 0
	    }
	  },
	  {
	    "_id": "5b69d38696b2bd4099343a8d",
	    "room": 3515,
	    "admitDate": "Fri Aug 03 2018 11:15:00 GMT+0000 (UTC)",
	    "name": "Forbes Pope",
	    "age": 71,
	    "service": "tempor",
	    "allergies": "anim",
	    "code": "officia",
	    "isolation": "consequat",
	    "diagnosis": "ut est",
	    "history": "incididunt occaecat nisi id",
	    "GU": "cupidatat",
	    "GI": "deserunt",
	    "fluids": "ea",
	    "input": 1405,
	    "output": 966,
	    "O2": "aliqua",
	    "telemetry": "cillum",
	    "pain": 3,
	    "SCDs": false,
	    "TED": false,
	    "assist": "excepteur",
	    "skinWounds": "duis",
	    "labs": {
	      "hemo": 30,
	      "wbc": 11473,
	      "plt": 298010,
	      "K": 5,
	      "Na": 145,
	      "Cr": 1
	    }
	  },
	  {
	    "_id": "5b69d386bf98e04860fe9263",
	    "room": 3512,
	    "admitDate": "Tue Aug 07 2018 00:28:56 GMT+0000 (UTC)",
	    "name": "Bishop Snow",
	    "age": 74,
	    "service": "nostrud",
	    "allergies": "Lorem",
	    "code": "pariatur",
	    "isolation": "pariatur",
	    "diagnosis": "cillum aliqua",
	    "history": "ad mollit labore enim",
	    "GU": "ipsum",
	    "GI": "irure",
	    "fluids": "proident",
	    "input": 1603,
	    "output": 760,
	    "O2": "consectetur",
	    "telemetry": "laboris",
	    "pain": 1,
	    "SCDs": false,
	    "TED": false,
	    "assist": "minim",
	    "skinWounds": "consectetur",
	    "labs": {
	      "hemo": 26,
	      "wbc": 2889,
	      "plt": 300299,
	      "K": 5,
	      "Na": 142,
	      "Cr": 2
	    }
	  },
	  {
	    "_id": "5b69d386931ee18a96b8e6ed",
	    "room": 3522,
	    "admitDate": "Thu Aug 02 2018 20:06:10 GMT+0000 (UTC)",
	    "name": "Joyner Goodwin",
	    "age": 72,
	    "service": "labore",
	    "allergies": "velit",
	    "code": "incididunt",
	    "isolation": "proident",
	    "diagnosis": "aute veniam",
	    "history": "Lorem nisi officia consequat",
	    "GU": "tempor",
	    "GI": "deserunt",
	    "fluids": "qui",
	    "input": 591,
	    "output": 840,
	    "O2": "amet",
	    "telemetry": "excepteur",
	    "pain": 2,
	    "SCDs": true,
	    "TED": false,
	    "assist": "cupidatat",
	    "skinWounds": "id",
	    "labs": {
	      "hemo": 28,
	      "wbc": 13573,
	      "plt": 176383,
	      "K": 3,
	      "Na": 143,
	      "Cr": 1
	    }
	  },
	  {
	    "_id": "5b69d3862ddcb8214b75ac11",
	    "room": 3518,
	    "admitDate": "Thu Aug 02 2018 17:08:30 GMT+0000 (UTC)",
	    "name": "Olivia Roth",
	    "age": 73,
	    "service": "eu",
	    "allergies": "commodo",
	    "code": "commodo",
	    "isolation": "qui",
	    "diagnosis": "do mollit",
	    "history": "ea sit laborum id",
	    "GU": "labore",
	    "GI": "consequat",
	    "fluids": "dolore",
	    "input": 884,
	    "output": 1373,
	    "O2": "nisi",
	    "telemetry": "aute",
	    "pain": 3,
	    "SCDs": false,
	    "TED": false,
	    "assist": "ad",
	    "skinWounds": "tempor",
	    "labs": {
	      "hemo": 12,
	      "wbc": 8407,
	      "plt": 419268,
	      "K": 4,
	      "Na": 144,
	      "Cr": 1
	    }
	  },
	  {
	    "_id": "5b69d386b2ba385ff3062d32",
	    "room": 3525,
	    "admitDate": "Thu Aug 02 2018 15:55:55 GMT+0000 (UTC)",
	    "name": "Tasha Mason",
	    "age": 75,
	    "service": "ad",
	    "allergies": "do",
	    "code": "ut",
	    "isolation": "nisi",
	    "diagnosis": "incididunt aute",
	    "history": "amet do ex eu",
	    "GU": "in",
	    "GI": "ut",
	    "fluids": "ad",
	    "input": 1522,
	    "output": 767,
	    "O2": "pariatur",
	    "telemetry": "mollit",
	    "pain": 4,
	    "SCDs": false,
	    "TED": true,
	    "assist": "occaecat",
	    "skinWounds": "culpa",
	    "labs": {
	      "hemo": 8,
	      "wbc": 7347,
	      "plt": 340554,
	      "K": 5,
	      "Na": 142,
	      "Cr": 0
	    }
	  }
	]
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
				<div class="name">
					<input id="${patient.name}" type="checkbox">
					<label for="${patient.name}">
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

function handleAddToAssignmentButton() {}

function addPatientsToAssignmentList() {}


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
})
