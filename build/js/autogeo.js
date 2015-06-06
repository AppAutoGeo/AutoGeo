var app = angular.module('AutoGeoAPP', ["leaflet-directive", "ngResource", "ui.utils.masks"]);

app.controller('MainCtrl', [ '$scope', '$http', '$filter', '$rootScope', 'ServicoAnuncios', '$resource', function($scope, $http, $filter, $rootScope, ServicoAnuncios, $resource) {
    
    var icon = {  
        iconUrl:'build/img/marker-icon.png',
        iconSize:[25, 41],
        iconAnchor:[12, 0]  
    }; 

    $scope.enableMenu = false;
    $scope.marcas   = [{nome: "Selecione uma marca"},{nome: "Chevrolet"},{nome: "Ford"},{nome: "Fiat"},{nome: "Wolkswagen"},{nome: "Renault"},{nome: "Pegeout"},{nome: "Toyota"}]
    $scope.filtro = {
        minVal  :   "",
        maxVal  :   "",
        minKm  :   "",
        maxKm  :   "", 
        marca  :   "",
        modelo  :   ""
    };
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

    //Filtro por modelo - busca rapida
    $scope.$watch('filtro.modelo', function (newVal, oldVal) {
        $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2,  $scope.filtro);
    });

    //Filtro geral
    $scope.filtrarAnuncio = function(){
        $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2, $scope.filtro);
    };

    $scope.limparFiltro = function(type){
        switch(type){
            case "preco":
                $scope.filtro.minVal = "";
                $scope.filtro.maxVal = "";
                break; 
            case "km":
                $scope.filtro.minKm = "";
                $scope.filtro.maxKm = "";
                break;
            case "marca":
                $scope.filtro.marca = $scope.marcas[0];
                break;
            default:
                $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2, $scope.filtro); 
        }
        $scope.anunciosMarkers = $filter('filter')($scope.anunciosMarkers2, $scope.filtro); 
        
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
  return function(markers, obj) {
    var matches = [];
    angular.forEach(markers, function(marker, featureKey) {
            marker.match = true;
            if(obj.minVal != "" && marker.match == true){
                (marker.props["valor"] >= obj.minVal) ? marker.match=true : marker.match=false;
            }
            if(obj.maxVal != "" && marker.match == true){
                (marker.props["valor"] <= obj.maxVal) ? marker.match=true : marker.match=false;
            }
            if(obj.minKm != "" && marker.match == true){
                (marker.props["km"] >= obj.minKm) ? marker.match=true : marker.match=false;
            }
            if(obj.maxKm != "" && marker.match == true){
                (marker.props["km"] <= obj.maxKm) ? marker.match=true : marker.match=false;
            }
            if(obj.modelo != "" && marker.match == true){
                (marker.props["modelo"].toUpperCase().indexOf(obj.modelo.toUpperCase()) > -1) ? marker.match=true : marker.match=false;
            }
            if(obj.marca.nome != 'Selecione uma marca' && marker.match == true){
                (marker.props["marca"].toUpperCase().indexOf(obj.marca.nome.toUpperCase()) > -1) ? marker.match=true : marker.match=false;
            }

            //todos os filtros true
            if(marker.match==true){
                matches.push(marker);
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
