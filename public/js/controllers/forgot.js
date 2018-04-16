app.controller('forgot', function($scope, $http, $window) {
    // Warning in case of error
    $scope.error;

    // ng-models from the signin form
    $scope.email;

    $scope.signinProgress = false;

    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

    $scope.signin = () => {

        if ($scope.signinProgress) return;

        $scope.signinProgress = true;

        if (!$scope.emailFormat.test($scope.email)) {
            $scope.signinProgress = false;
            return $scope.error = "L'email entré est incorrect.";
        }
        $scope.error = '';

        $http.post('/forgot', {
            email: $scope.email
        }).then(response => {
            if (!response.data.success) {
                $scope.signinProgress = false;
                return $scope.error = response.data.error
            }
            $window.location.href = '/';
        }).catch(err => console.log(err));

    }
});