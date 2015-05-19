var app = angular.module('AutoGeoAPP', ["leaflet-directive"]);

app.controller('MainCtrl', [ '$scope', '$http', '$filter', function($scope, $http, $filter) {
	
    var icon = {  
        iconUrl:'build/img/marker-icon.png',
        iconSize:[25, 41],
        iconAnchor:[12, 0]  
    }; 

	$scope.enableMenu = false;
    $scope.search = '';
    $scope.carros = {};

	//leaflet
	angular.extend($scope, {
        poa: {
            lat: -30.0257548,
            lng: -51.1833013,
            zoom: 12
        },
        defaults: {
            scrollWheelZoom: true
        }
    });

    // Get the countries geojson data from a JSON
    $http.get("data/json/carros.json").success(function(data, status) {
        angular.extend($scope, {
          data: data,
          carros: {
            data:data,
            style:
                function (feature) {
                    return {};
                },
                pointToLayer: function(feature, latlng) {
                    return new L.marker(latlng, {icon: L.icon(icon)});
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup("<h1>" +feature.properties.modelo+" / "+feature.properties.ano+"</h1>");
                } 
          } //geojson
        });         
    });

    $scope.$watch('search', function (newVal, oldVal) {
      if (newVal !== oldVal && newVal !== '') {
        $scope.carros.data = $filter('filter')($scope.data, 'modelo', newVal);
      } else {
        $scope.carros.data = $scope.data;
      }
    });

    $scope.$on("leafletDirectiveMap.geojsonClick", function (ev, featureSelected, leafletEvent) {
        console.log(featureSelected);
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

app.filter('filter', [function() {
  return function(geojson, searchProperty, searchValue) {
    console.log('Matches:');
    var matches = {'type': 'FeatureCollection', 'features': []};
    angular.forEach(geojson.features, function(featureObject, featureKey) {
      if (featureObject.properties.hasOwnProperty(searchProperty)) {
        var property = featureObject.properties[searchProperty].toLowerCase();
        var search = searchValue.toLowerCase();
        if (property.indexOf(search) > -1) {
          matches.features.push(featureObject);
          console.log(featureObject.properties.NAME);
        }
      }
    });
    return matches;
  };
}]);