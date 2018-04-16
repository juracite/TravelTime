app.controller('signin', function($scope, $http, $window, $timeout) {
    // Warning in case of error
    $scope.error = false;
    // Warning in case of success
    $scope.success = false;

    // ng-models from the signin form
    $scope.email;
    $scope.password;

    $scope.forgotInProgress = false;

    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

    $scope.signin = () => {

        if ($scope.forgotInProgress) return;

        $scope.success = false;

        $scope.forgotInProgress = true;

        if (!$scope.emailFormat.test($scope.email)) {
            $scope.forgotInProgress = false;
            return $scope.error = "L'email entré est incorrect.";
        }
        $scope.error = false;

        $http.post('/signin', {
            email: $scope.email,
            password: $scope.password
        }).then(response => {
            if (!response.data.success) {
                $scope.forgotInProgress = false;
                return $scope.error = response.data.error
            }
            $scope.success = 'Vous êtes bien authentifié !';

            $timeout(() => {
                $window.location.href = '/';
            }, 1000)
        }).catch(err => console.log(err));

    }
});