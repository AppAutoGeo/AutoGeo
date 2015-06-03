var app = angular.module('AutoGeoAPP', ["leaflet-directive", "ngResource"]);

app.controller('MainCtrl', [ '$scope', '$http', '$filter', '$rootScope', 'ServicoAnuncios', '$resource', function($scope, $http, $filter, $rootScope, ServicoAnuncios, $resource) {
    
    var icon = {  
        iconUrl:'build/img/marker-icon.png',
        iconSize:[25, 41],
        iconAnchor:[12, 0]  
    }; 

    $scope.enableMenu = false;
    $scope.search = '';
    $scope.anunciosMarkers = [];
    $scope.anunciosMarkers2 = [];
    
    var promiseAnuncios = ServicoAnuncios.getAnuncios();
    promiseAnuncios.then(function(data) {
        $rootScope.anuncios = data.anuncios;
        angular.forEach(data.anuncios, function(anuncio, i) {
            $scope.anunciosMarkers.push({
                lat: anuncio.geometry.coordinates[1], 
                lng: anuncio.geometry.coordinates[0], 
                message: "<popup anuncio='anuncios[" + i + "]'></popup>",
                popupOptions: {minWidth: 300, maxWidth: 300},
                props: anuncio.properties
            });
        });
        $scope.anunciosMarkers2 = $scope.anunciosMarkers;
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

    //Filtro por modelo
    $scope.$watch('search', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal !== '') {
            $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2, 'modelo', newVal, 'modelo');
        } else {
            if($scope.anunciosMarkers.length < $scope.anunciosMarkers2.length){
                var promiseAnuncios = ServicoAnuncios.getAnuncios();
                promiseAnuncios.then(function(data) {
                    $rootScope.anuncios = data.anuncios;
                    angular.forEach(data.anuncios, function(anuncio, i) {
                        $scope.anunciosMarkers.push({
                            lat: anuncio.geometry.coordinates[1], 
                            lng: anuncio.geometry.coordinates[0], 
                            message: "<popup anuncio='anuncios[" + i + "]'></popup>",
                            popupOptions: {minWidth: 300, maxWidth: 300},
                            props: anuncio.properties
                        });
                    });
                });
            }
        }
    });

    $scope.filtrarAnuncio = function(type){
        switch(type){
            case "preco":
                $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2, 'valor', $scope.filtro.minVal, "precoMin");
                break;
            default:
                alert("Filtro Invalido");
        }
    };

    $scope.limparFiltros = function(){
        console.log($scope.anunciosMarkers.length);
        console.log($scope.anunciosMarkers2.length);
        var promiseAnuncios = ServicoAnuncios.getAnuncios();
        promiseAnuncios.then(function(data) {
            $rootScope.anuncios = data.anuncios;
            angular.forEach(data.anuncios, function(anuncio, i) {
                $scope.anunciosMarkers.push({
                    lat: anuncio.geometry.coordinates[1], 
                    lng: anuncio.geometry.coordinates[0], 
                    message: "<popup anuncio='anuncios[" + i + "]'></popup>",
                    popupOptions: {minWidth: 300, maxWidth: 300},
                    props: anuncio.properties
                });
            });
        });
    };
    

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
  return function(markers, searchProperty, searchValue, type) {
    var matches = [];
    angular.forEach(markers, function(marker, featureKey) {
      if (marker.props.hasOwnProperty(searchProperty)) {
        
         switch(type){
            case "precoMin":
                if (marker.props[searchProperty] >= searchValue) {
                  matches.push(marker);
                }
                break;
            case "precoMax":
                if (marker.props[searchProperty] <= searchValue) {
                  matches.push(marker);
                }
                break;
            case "modelo":
                var property = marker.props[searchProperty].toLowerCase();
                var search = searchValue.toLowerCase();
                if (property.indexOf(search) > -1) {
                  matches.push(marker);
                }
                break;
            default:
                console.log("Filtro Invalido");
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
        templateUrl: 'popup.html',
        link: function (scope, elem, attrs) {
            console.log(elem);
            elem.on('click', function () {
                alert();
            })
        }
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
