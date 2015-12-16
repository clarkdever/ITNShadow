app.controller('login.controller',function($scope,Azureservice) {


	$scope.companies = [];
	$scope.userMessage = '';
	$scope.currentCompanyId = null;
	$scope.studentTake = 300;
	$scope.studentsTotalCount = 0;
	$scope.studentsPagination = [];


	$scope.processing = {
		login : false,
		companylist : false,
		studentlist : false,
		resume: false,
		delete : false
	};

	$scope.studentlevels = [
		'Associate',
		'Bachelor',
		'Master'
	];

	$scope.areas = [
		'Information Security',
		'Database Administration',
		'Technical Support',
		'Enterprise Computing',
		'Enterprise Software Implementation & Consulting',
		'IT Project Management',
		'App/Application Development',
		'Network & Systems Administration',
		'System Architecture',
		'Web Development',
		'IT Systems Analysis',
		'UI/UX Design',
		'Usability/Information Architecture',
		'Telecommunications Administration/Management',
		'Startup Founder/Entrepreneur',
		'Other:'
	]

	$scope.b64toBlob = function b64toBlob(b64Data, contentType, sliceSize) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}

	$scope.download = function(studentId,fileName){

		$scope.processing.resume = true;

		Azureservice.invokeApi('downloadresume', {
				method: 'post',
				body: {
					studentid : studentId
				}
			})
			.then(function(response) {

					if(response.length == 1){
						data = response[0];
						console.log(data);


						var blob = $scope.b64toBlob(data.ResumeData, 'application/octet-stream');
						var blobUrl = URL.createObjectURL(blob);

						var a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						a.href = blobUrl;
						a.download = fileName;
						a.click();
						window.URL.revokeObjectURL(blobUrl);
						$scope.processing.resume = false;
					}else{
						alert('Could not download resume.')
						$scope.processing.resume = false;
					}


			}, function(err) {
				console.error('Azure Error: ' + err);
				$scope.processing.resume = false;

			});






	};



	$scope.init = function init(){


		$scope.readCompanies();
		$scope.readStudents();

	}

	$scope.loggedIn = function(){
		return Azureservice.isLoggedIn();
	}


	$scope.logout = function(){

		Azureservice.logout();

	};

	$scope.login = function(){

		$scope.userMessage = '';
		$scope.processing.login = true;
		Azureservice.invokeApi('login', {
			method: 'post',
				body: {
					email : $scope.login.email,
					password:$scope.login.password
			}
		})
		.then(function(response) {


			if(response.status == 'SUCCESS'){
				Azureservice.setCurrentUser(response);

				$scope.readCompanies();
				$scope.readStudents();

			}else{
				$scope.userMessage = 'Login Failed';
			}

			$scope.processing.login = false;

		}, function(err) {
			console.error('Azure Error: ' + err);
			$scope.processing.login = false;
		});



	}

	$scope.readCompanies = function(){

		if(Azureservice.isLoggedIn()){


			$scope.processing.companylist = true;
			Azureservice.read('Company')
				.then(function(items) {

					$scope.companies = items;
					console.log('Companies',$scope.companies);
					$scope.processing.companylist = false;
				}).catch(function(error) {
					$scope.processing.companylist = false;
				console.log(error)
			});
		};

	};

	$scope.parseList = function(list){

		return angular.fromJson(list);
	}

	$scope.readStudents = function(){
		if(Azureservice.isLoggedIn()){

			$scope.processing.studentlist = true;
			Azureservice.query('Student',{
				take: $scope.studentTake
			})
				.then(function(items) {


					console.log(items);

					_.forEach(items,function(item){
						var CompanyPreference = [];
						var companyPref = angular.fromJson(item.CompanyPreference);

						if(companyPref){
							//companyPref = _.keys(_.pick(companyPref, _.identity))


							_.forEach(companyPref,function(value,key){


								CompanyPreference.push( _.find($scope.companies, function(company) {

									if(company.id == key){


										return company;
									}

								}));

							});

							item.CompanyPreference = CompanyPreference;
						}







					});

					$scope.students = items;
					$scope.studentsTotalCount = items.totalCount;

					$scope.studentsPagination = Array.apply(null, {length: (items.totalCount % $scope.studentTake)-1}).map(Number.call , Number) ;

					$scope.processing.studentlist = false;
				}).catch(function(error) {
				$scope.processing.studentlist = false;
				console.log(error)
			});
		};

	};


	$scope.setCurrentCompany = function(company){

		$scope.currentCompany= company;
		$scope.currentCompany.areas = angular.fromJson(company.areas);
		$scope.currentCompany.studentlevels = angular.fromJson(company.studentlevels);
	};

	$scope.saveCurrentCompany = function(){

		var company = $scope.currentCompany;
		delete company.$$hashKey;
		console.log(company);

		company.areas = angular.toJson(company.areas);
		company.studentlevels = angular.toJson(company.studentlevels);

		console.log(company);
		$scope.processing.post = true;
		Azureservice.update('Company', company)
			.then(function(response) {
				console.log(response);

			}, function(err) {

				alert('There was an error updating the record. Please report the following error to your sys admin ['  + err + ']')
				console.error('Azure Error: ' + err);
			});


		$scope.currentCompany= null;
	};

	$scope.setCurrentStudent = function(student){

		$scope.currentStudent = student;

	};

	$scope.saveCurrentStudent = function(){

		var student = {
			id : $scope.currentStudent.id,
			Name : $scope.currentStudent.Name,
			Email : $scope.currentStudent.Email,
			Phone : $scope.currentStudent.Phone,
			School : $scope.currentStudent.School,
			Town : $scope.currentStudent.Town

		};


		console.log(student);


		$scope.processing.post = true;
		Azureservice.update('Student', student)
			.then(function(response) {
				console.log(response);
				$scope.processing.post = false;
			}, function(err) {
				$scope.processing.post = false;
				alert('There was an error updating the record. Please report the following error to your sys admin ['  + err + ']')
				console.error('Azure Error: ' + err);
			});


		$scope.currentStudent = null;
	};



	$scope.deleteStudent = function(student){

		var studentToSave = {
			id : student.id,
			Active: false
		};

		$scope.processing.delete = true;
		Azureservice.update('Student', studentToSave)
			.then(function(response) {
				$scope.processing.delete = false;

			}, function(err) {
				$scope.processing.delete = false;
				alert('There was an error updating the record. Please report the following error to your sys admin ['  + err + ']')
				console.error('Azure Error: ' + err);
			});


	};

	$scope.setAssignment = function(student){

		var studentToSave = {
			id : student.id,
			AssignedCompany: student.AssignedCompany,
			AssignedDay : student.AssignedDay
		};

		$scope.processing.assign = true;
		Azureservice.update('Student', studentToSave)
			.then(function(response) {
				$scope.processing.assign = false;

			}, function(err) {
				$scope.processing.assign = false;
				alert('There was an error updating the record. Please report the following error to your sys admin ['  + err + ']')
				console.error('Azure Error: ' + err);
			});




	}

	$scope.sendConfirmationEmail = function(company,student) {


		console.log(student, company);

		var AssignedDate = "January 7th, 2016";

		if (student.AssignedDate == 2) {
			AssignedDate = "January 8th, 2016";
		}


		var areas = [];
		_.forIn(JSON.parse(student.areas), function (value, key) {
			if (value == true) {
				areas.push(key);
			}
		});


		var htmlEmail = '';
		htmlEmail += '<p>';
		htmlEmail += 'Dear ' + company.PersonToBeShadowed + ' and ' + student.Name + ',';
		htmlEmail += '';
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += 'We are delighted that you are participating in the infoTech WNY Shadowing Program. ' + student.Name + ', you are shadowing  ' + company.PersonToBeShadowed + ' at ' + company.CompanyName + ', info below.  Please confirm with this contact via email and ask any additional questions this email does not address.';
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += '<strong>Student for ' + AssignedDate + ':</strong><br>';
		htmlEmail += student.Name + '<br>' + student.Email + '<br>' + student.Phone + '<br>';
		htmlEmail += 'Resume: <a download="' + student.ResumeFilename + '" href="https://studentshadow.azure-mobile.net/api/downloadresume?studentid=' + student.id + '">' + student.ResumeFilename + '</a><br>';
		htmlEmail += 'LinkedIn:' + student.LinkedInProfile + '<br>';
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += 'Interested in ' + areas.join(', ');
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += '<strong>Shadow Sponsor:</strong><br>' + company.PersonToBeShadowed + '<br>' + company.Title + '<br>' + company.Phone + '<br>' + company.Email + '<br>';

		if (company.LinkedInProfile != null) {
			htmlEmail += 'LinkedIn:' + company.LinkedInProfile + '<br>';
		}
		htmlEmail += '<br><strong>Location:</strong>   ' + company.CompanyName + '<br>' + company.Address + '<br>';
		if (company.Instructions != null && company.Instructions.length > 0) {
			htmlEmail += '<strong>Specifics:</strong> ' + company.Instructions + '';
		}
		htmlEmail += '<br><strong>URL:</strong>' + company.CompanyURL;
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += '<strong>Professional\'s job description: </strong><br>' + company.Description + '';
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += '<strong>Student:</strong> Confirm this shadow day via email to the company contact (and cc me) ASAP.  This email will also introduce yourself and give you a chance to ask any questions you may have about the logistics for that day. Please visit this <a href="http://itnshadow.shatterit.com/TipSheet.pdf">tip sheet</a> so you can prepare for the day. You are responsible for being on time and for your travel arrangements for that day. If your plans change, you need to contact me and your shadowing contact immediately.  Take another look at the info on the shadow website to see any info the company listed about the day (i.e. where to park, etc.). By the way, the contact may not be the actual person you are shadowing; Sometimes the contact sets up additional professionals in the place of business for you to shadow.';
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += 'Please make your reliable travel arrangements for that day soon if you do not have a car. The companies plan their day around this educational experience for you and when a student does not show, it can cause disruption in their day, not to mention make you look bad as an up-coming professional and disparages your school’s name.';
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += '<strong>Shadow Sponsor:</strong>  Your assigned student’s information is included.  If you require anything additional, please request that from the student. If the student does not contact you independently soon, you can reach out yourself. However, if the student does not reach out by three days before the visit, this is cause for concern. Maybe the student is not participating after all and we can assign a different student.';
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += 'Let me know if you have questions and we’ll follow up afterwards.';
		htmlEmail += '</p>';
		htmlEmail += '<p>';
		htmlEmail += 'Melissa Ruggiero, mrugg@buffalo.edu, 645-3232<br>';
		htmlEmail += 'Peter Ronca, Chair, infoTechWNY<br>';
		htmlEmail += 'Michelle Kavanaugh, Ed.D.President of WNY STEM<br>';
		htmlEmail += 'Kim Grant, UB Center of Excellence<br>';
		htmlEmail += '<strong>InfoTech WNY Shadow Program Committee</strong><br>';
		htmlEmail += '</p>';


		var message = {
			toCompany: company.Email,
			toStudent: student.Email,
			studentId: student.id,
			message: htmlEmail
		}

		// call the messaging api
		Azureservice.invokeApi('messaging', {
				method: 'post',
				body: message
			})
			.then(function (response) {

				// update the student to identify that we've sent n email
				$scope.processing.post = true;
				Azureservice.update('Student', {
						id: student.id,
						emailSent: true
					})
					.then(function (response) {
						console.log(response);
						$scope.processing.post = false;
					}, function (err) {
						$scope.processing.post = false;
						alert('There was an error updating the record. Please report the following error to your sys admin [' + err + ']')
						console.error('Azure Error: ' + err);
					});


			}, function (err) {
				console.error('Azure Error: ' + err);
				$scope.processing.resume = false;

			});
	};


	$scope.init();

});