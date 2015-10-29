app.controller('formsubmission.controller',function($scope,Azureservice){

	$scope.form = {};

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

	$scope.submitForm = function(type){

		console.log(type);
		console.log($scope.userForm.$valid);


		if($scope.userForm.$valid){

			$scope.form.areas = angular.toJson($scope.form.areas);

			Azureservice.insert(type, $scope.form)
				.then(function(response) {
					console.log(response);
					$scope.form = response;
					$scope.form.posted = true;
				}, function(err) {
					console.error('Azure Error: ' + err);
				});


		};


	}
});