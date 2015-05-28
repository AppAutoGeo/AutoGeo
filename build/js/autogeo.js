var app = angular.module('AutoGeoAPP', ["leaflet-directive", "ngResource"]);

app.controller('MainCtrl', [ '$scope', '$http', '$filter', '$rootScope', 'ServicoAnuncios', '$resource', function($scope, $http, $filter, $rootScope, ServicoAnuncios, $resource) {
    
    var icon = {  
        iconUrl:'build/img/marker-icon.png',
        iconSize:[25, 41],
        iconAnchor:[12, 0]  
    }; 

    $scope.enableMenu = false;
    $scope.search = '';
    $scope.markers = [];
    
    var promiseAnuncios = ServicoAnuncios.getAnuncios();
    promiseAnuncios.then(function(data) {
        $rootScope.anuncios = data.anuncios;
        angular.forEach(data.anuncios, function(anuncio, i) {
            
            $scope.markers.push({
                lat: anuncio.geometry.coordinates[1], 
                lng: anuncio.geometry.coordinates[0], 
                message: "<popup anuncio='anuncios[" + i + "]'></popup>",
                popupOptions: {minWidth: 300, maxWidth: 300}
            });
        });
    });

    var url = 'data/json/carros.json';
    $http.get(url).success(function(anuncios){
        angular.forEach(anuncios.features, function(anuncio, i) {
            $scope.markers.push({
                lat: anuncio.geometry.coordinates[0], 
                lng: anuncio.geometry.coordinates[1], 
                message: "<popup anuncio='anuncios[" + i + "]'></popup>"
            });
        });
    }).error(function(msg, code) {
        console.log(msg+code);
    });

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

    /*$scope.$watch('search', function (newVal, oldVal) {
      if (newVal !== oldVal && newVal !== '') {
        $scope.carros.data = $filter('filter')($scope.data, 'modelo', newVal);
      } else {
        $scope.carros.data = $scope.data;
      }
    });*/
    

}]);

app.directive('toggleMenuIcon', function (){
    return{
        restric     : 'E',
        scope       : false,
        template    : '<div id="menuMobile" class="visible-xs-block" ng-click="toggleMenu()">'
                        +'<span class="glyphicon glyphicon-menu-hamburger blue"></span>'
                        +'<span class="txtBtnMenu">MENU</span>'
                        +'</div>',
        link        : function(scope, elem, attrs){
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

app.directive('popup', ['$http', '$compile', function($http, $compile) {
    return {
        restrict: 'E',
        scope: {
            anuncio: "="
        },
        templateUrl: 'popup.html'
    };
}]);

app.factory('ServicoAnuncios', function($http, $q) {
    return {
        getAnuncios: function() {
            var d = $q.defer();
            var url = 'data/json/carros.json';
            var saida = { anuncios: [] };
            $http.get(url)
            .success(function(anuncios){
                angular.forEach(anuncios.features, function(anuncio) {
                    saida.anuncios.push(anuncio);
                });
                d.resolve(saida);
            })
            .error(function(msg, code) {
                d.reject(msg);
            });
            return d.promise;
        }
    };
});
