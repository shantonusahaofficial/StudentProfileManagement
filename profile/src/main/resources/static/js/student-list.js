$(document).ready(function() {

	$("#dob").datepicker({
		dateFormat: 'dd/mm/yy',
		changeMonth: true,
		changeYear: true
	});

	$("#btnSave").click(function() {
		if (validation()) {
			confirmEmpJoinDialog("Do you want to save this student information?");
		}

	});

	function validation() {

		var dateCheck = new RegExp("[0-9]{1,2}(/|-)[0-9]{1,2}(/|-)[0-9]{4}");



		var status = true;

		if ($("#name").val() == '') {
			$("#error_name").text('Name is required!!');
			$("#name").focus();
			status = false;
			return status;
		} else $("#error_name").text('');

		if ($("#dob").val() == '') {
			$("#error_dob").text('DOB is required!!');
			$("#dob").focus();
			status = false;
			return status;

		} else if (!dateCheck.test($("#dob").val())) {
			$("#error_dob").text('Invalid DOB format!!');
			$("#dob").focus();
			status = false;
			return status;

		} else if (validFutureDate($("#dob").val())) {
			$("#error_dob").text('DOB should be greater then current date!!');
			$("#dob").focus();
			status = false;
			return status;

		} else if (isValid_date($("#dob").val()) == false) {
			$("#error_dob").text('Invalid DOB format!!');
			$("#dob").focus();
			status = false;
			return status;
		} else $("#error_dob").text('');



		if ($("#gender").val() == '-1') {
			$("#error_gender").text('Gender is required!!');
			$("#gender").focus();
			status = false;
			return status;
		} else $("#error_gender").text('');


		return status;

	}



	loadStudentList();


	function loadStudentList() {

		var stdTable = $('#stdTable');

		$.ajax({
			type: "GET",
			url: "/api/v1/students",
			success: function(data) {

				stdTable.dataTable({
					paging: true,
					searching: true,
					destroy: true,
					data: data,
					columns: [{
						"data": "name",
						"className": "dt-btn-name",
					}, {
						"data": "dob",
						"render": function(nRow, aData) {
							return getDate(nRow);
						}

					}, {
						"data": "gender"
					}, {
						"data": "note"
					}, {
						"className": "dt-btn",
						"render": function() {
							return '<button type="button" class="btn btn-sm btn-info" id="btnEdit"><i class="glyphicon glyphicon-pencil"></i></button> <button type="button" class="btn btn-sm btn-danger" id="btnDelete"><i class="glyphicon glyphicon-trash"></i></button>';
						}
					}],
					"fnCreatedRow": function(nRow, aData, iDataIndex) {
						$('td:eq(1)', nRow).attr("data-id", aData.id);

					}
				});
			}
		});

	}

	$('#stdTable tbody').on('click', '#btnEdit', function() {

		$("#error_name").text('');
		$("#error_dob").text('');
		$("#error_gender").text('');
		$("#error_note").text('');
		
		$( "#name" ).prop( "disabled", true );

		var curRow = $(this).closest('tr');
		var id = curRow.find('td:eq(1)').attr("data-id");
		var name = curRow.find('td:eq(0)').text();
		var date = curRow.find('td:eq(1)').text();
		var gender = curRow.find('td:eq(2)').text();
		var comment = curRow.find('td:eq(3)').text();


		$("#name").val(name);
		$("#dob").val(date);
		$("#gender").val(gender);
		$("#note").val(comment);

		$("#updateId").val(id);



	});


	$('#stdTable tbody').on('click', '#btnDelete', function() {

		var curRow = $(this).closest('tr');
		var id = curRow.find('td:eq(1)').attr("data-id");

		$.confirm({
			type: 'orange',
			title: '<span class="glyphicon glyphicon-warning-sign" style="color:orange;"></span> ' + '<b style="font-size:18px;">Confirm!!</b>',
			content: 'Do you want to delete?',
			buttons: {
				Yes: {
					btnClass: 'btn-info',
					keys: ['enter'],
					action: function() {

						$.ajax({
							type: 'POST',
							contentType: 'application/json',
							url: "/api/v1/delete?id=" + id,
							data: JSON.stringify(''),
							dataType: 'json',
							success: function(data) {

								if (data.msgCode == '200') {
									showAlterMessage("D", data.msg);
									loadStudentList();
									clrFrm();
									$( "#name" ).prop( "disabled", false );
								} else {
									showAlterMessage("F", data.msg);
								}

							},
							error: function(e) {
								showAlterMessage("F", data.msg);
							}
						});



					}
				},
				No: function() {


				}
			}
		});

	});



	var confirmEmpJoinDialog = function(text) {

		$.confirm({
			type: 'orange',
			title: '<span class="glyphicon glyphicon-warning-sign" style="color:orange;"></span> ' + '<b style="font-size:18px;">Confirm!!</b>',
			content: text,
			buttons: {
				Yes: {
					btnClass: 'btn-info',
					keys: ['enter'],
					action: function() {



						var name = $('#name').val().trim();
						var dob = $('#dob').val();
						if (dob) {
							dob = dob.split("/").reverse().join("/");
							dob = getFormateDate(dob);
						}

						var gender = $('#gender').val().trim();
						var note = $('#note').val().trim();
						var updateId = $('#updateId').val().trim();


						var objList = {};
						objList.name = name;
						objList.dob = dob;
						objList.gender = gender;
						objList.note = note;
						objList.updateId = updateId;






						$.ajax({
							type: 'POST',
							contentType: 'application/json',
							url: "/api/v1/save",
							data: JSON.stringify(objList),
							dataType: 'json',
							success: function(data) {


								if (data.msgCode == '200') {

									showAlterMessage("S", data.msg);
									loadStudentList();
									clrFrm();
									$( "#name" ).prop( "disabled", false );

								} else if (data.msgCode == '300') {
									showAlterMessage("E", data.msg);

								} else {
									showAlterMessage("F", data.msg);
								}


							},
							error: function(e) {
								// showAlertByType("Sorry,Something Wrong!!", "F");
							}
						});
					}
				},
				No: function() {

				}
			}
		});
	};







	function showAlterMessage(alertType, msg) {

		if (alertType == 'S' || alertType == 'D' || alertType == 'U') {

			$.confirm({
				type: 'green',
				title: '<span class="glyphicon glyphicon-ok-sign" style="color:green;"></span> ' + '<b style="font-size:18px;">Success!!</b>',
				content: msg,
				buttons: {
					Ok: {
						btnClass: 'btn-info',
						keys: ['enter'],
						action: function() {




						}
					},
					cancel: function() {


					}
				}
			});


		} else if (alertType == 'E') {

			$.confirm({
				type: 'orange',
				title: '<span class="glyphicon glyphicon-warning-sign" style="color:orange;"></span> ' + '<b style="font-size:18px;">Success!!</b>',
				content: msg,
				buttons: {
					Ok: {
						btnClass: 'btn-info',
						keys: ['enter'],
						action: function() {




						}
					},
					cancel: function() {


					}
				}
			});





		} else {

			$.confirm({
				type: 'red',
				title: '<i class="fa fa-exclamation-triangle" aria-hidden="true" style="red;"></i> ' + '<b style="font-size:18px;">Confirm!!</b>',
				content: msg,
				buttons: {
					Ok: {
						btnClass: 'btn-info',
						keys: ['enter'],
						action: function() {




						}
					},
					cancel: function() {


					}
				}
			});

		}

	}


	function clrFrm() {
		$("#name").val('');
		$("#dob").val('');
		$("#gender").val('-1');
		$("#note").val('');
		$("#updateId").val('');

		$("#error_name").text('');
		$("#error_dob").text('');
		$("#error_gender").text('');
		$("#error_note").text('');


	}



	function isValid_date(s) {
		var bits = s.split('/');
		var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
		return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
	}

	function validFutureDate(enteredDate) {
		var status = false;
		var date = enteredDate.substring(0, 2);
		var month = enteredDate.substring(3, 5);
		var year = enteredDate.substring(6, 10);
		var myDate = new Date(year, month - 1, date);
		var today = new Date();
		if (myDate > today) {
			status = true;
		}
		return status;
	}


	function getFormateDate(date) {
		var d = new Date(date);
		return d;
	}

	function getDate(dateObject) {

		var d = new Date(dateObject);
		var day = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		if (day < 10) {
			day = "0" + day;
		}
		if (month < 10) {
			month = "0" + month;
		}
		var date = day + "/" + month + "/" + year;
		return date;
	};



});