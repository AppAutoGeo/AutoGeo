var app = angular.module('AutoGeoAPP', []);

app.controller('MainCtrl', function ($scope){
	
	$scope.enableMenu = false;

});

app.directive('toggleMenuIcon', function (){
	return{
		restric		: 'A',
		scope		: false,
		link		: function (scope, elem, attrs){
			elem.on('click', function(){
				if(scope.enableMenu === true){
					elem[0].firstElementChild.className = "glyphicon glyphicon-menu-hamburger blue";
				}
				if(scope.enableMenu === false){
					elem[0].firstElementChild.className = "glyphicon glyphicon-remove blue";
				}
				scope.enableMenu = !scope.enableMenu
			});

		}	
	}
});
