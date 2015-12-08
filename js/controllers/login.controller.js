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
		resume: false
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


	$scope.setAssignment = function(student){

		var studentToSave = {
			id : student.id,
			AssignedCompany: student.AssignedCompany,
			AssignedDay : student.AssignedDay
		};


		Azureservice.update('Student', studentToSave)
			.then(function(response) {
				$scope.processing.assign = false;

			}, function(err) {
				$scope.processing.assign = false;
				alert('There was an error updating the record. Please report the following error to your sys admin ['  + err + ']')
				console.error('Azure Error: ' + err);
			});




	}

	$scope.init();

});