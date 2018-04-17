app.controller('search', function($scope, $http, $window, $timeout) {
    $scope.origin;
    $scope.destination;
    $scope.searchFinished = true;
    $scope.offres = [];

    // Error message
    $scope.error = false;

    $scope.search = () => {
        if ($scope.origin === '' || $scope.destination == '') return $scope.error = 'Une information est manquante.';
        $scope.error = false;

        $http.post('/offers/search', { origin: $scope.origin, destination: $scope.destination }).then((result) => {

            if (!result.data.success) return $scope.error = result.error;

            if (result.data.empty) return $scope.error = "Il n'y a pas encore d'offres disponibles pour cet itinéraire.";
            console.log(result.data.offres)
            $scope.offres = result.data.offres;
        }).catch(err => console.log(err));
    }
});