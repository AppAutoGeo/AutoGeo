var app = angular.module('AutoGeoAPP', ["leaflet-directive"]);

app.controller('MainCtrl', [ '$scope', '$http', function($scope, $http) {
	
	$scope.enableMenu = false;



	//leaflet
	angular.extend($scope, {
        poa: {
            lat: -30.0257548,
            lng: -51.0733013,
            zoom: 11
        },
        defaults: {
            scrollWheelZoom: true
        }
    });


    // Get the countries geojson data from a JSON
    $http.get("data/json/macrozona.geojson.json").success(function(data, status) {
        angular.extend($scope, {
            poaBairros: {
                data: data,
                style: {
                    fillColor: "green",
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }
        });
    });

}]);

app.directive('toggleMenuIcon', function (){
	return{
		restric		: 'E',
		scope		: false,
		template	: '<div id="menuMobile" class="visible-xs-block" ng-click="toggleMenu()">'
						+'<span class="glyphicon glyphicon-menu-hamburger blue"></span>'
						+'<span class="txtBtnMenu">MENU</span>'
						+'</div>',
		link		: function(scope, elem, attrs){
			elem.on('click', function(){
				if(scope.enableMenu){
					elem[0].firstElementChild.firstElementChild.className = "glyphicon glyphicon-menu-hamburger blue";
				}else{
					elem[0].firstElementChild.firstElementChild.className = "glyphicon glyphicon-remove blue";
				}
				scope.$apply(scope.enableMenu = !scope.enableMenu); 
			});
		}
	}
});
