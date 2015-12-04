app.controller('formsubmission.controller',function($scope,Azureservice){

	$scope.form = {};
	$scope.formSubmitSuccessful = false;
	$scope.companies = [];
	$scope.processing = {
		companylist : false,
		post: false
	};
	$scope.studentlevels = [
		'Associate',
		'Bachelor',
		'Master'
	];

	$scope.workAuthorization = [
		'US Citizen',
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


	$scope.processing.companylist = true;
	Azureservice.read('Company')
		.then(function(items) {

			$scope.companies = items;
			console.log($scope.companies);
			$scope.processing.companylist = false;
		}).catch(function(error) {
		$scope.processing.companylist = false;
		console.log(error)
	});

	$scope.getLength = function(obj){
			return _.size(_.keys(_.pick(obj, _.identity)));
	};

	$scope.parseList = function(list){

		return angular.fromJson(list);
	}

	$scope.submitForm = function(type){

		console.log(type);
		console.log($scope.userForm.$valid);
		console.log($scope.form);

		if($scope.userForm.$valid){


			$scope.form.areas = angular.toJson($scope.form.areas);

			if(type == 'Company'){

				$scope.form.studentlevels = angular.toJson($scope.form.studentlevels);

			};


			if(type == 'Student'){

				$scope.processing.post = true;
				if(!$scope.form.Resume){
					alert('A resume is required');
					$scope.processing.post = false;
					return;
				};
				$scope.form.studentlevels = angular.toJson($scope.form.studentlevels);
				$scope.form.CompanyPreference = angular.toJson($scope.form.CompanyPreference);
				$scope.form.ResumeData = $scope.form.Resume.base64;
				$scope.form.ResumeFilename = $scope.form.Resume.filename;
				$scope.form.ResumeSize = $scope.form.Resume.filesize;
				$scope.form.ResumeType = $scope.form.Resume.filetype;
				$scope.form.Resume = '';
				console.log($scope.form);

			};

			Azureservice.insert(type, $scope.form)
				.then(function(response) {
					$scope.processing.post = false;
					console.log(response);
					$scope.form = response;
					$scope.form.posted = true;

				}, function(err) {
					$scope.processing.post = false;
					console.error('Azure Error: ' + err);
				});


		};


	}
});