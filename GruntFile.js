module.exports = function (grunt)
{
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: "\n\n"
			},
			dist: {
				src: ['src/js/**/*.js'],
				dest: 'build/js/<%= pkg.name %>.js'
			},
			deps: {
				src: [
					'bower_components/jquery/dist/jquery.min.js',
					'bower_components/bootstrap/dist/js/bootstrap.min.js',
					'bower_components/leaflet/dist/leaflet.js',
					'bower_components/angularjs/angular.min.js',
					'bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.min.js',
					'bower_components/angular-resource/angular-resource.min.js',
					'bower_components/angular-input-masks/angular-input-masks.min.js'
				],
				dest: 'build/js/<%= pkg.name %>-deps.js'
			},
			css: {
				src: [
					'bower_components/bootstrap/dist/css/bootstrap.min.css',
					'bower_components/leaflet/dist/leaflet.css',
					'src/css/custom-styles.css'
				],
				dest: 'build/css/<%= pkg.name %>.css'
			},
			move: {
				src: ['bower_components/angularjs/angular.min.js.map'],
				dest: 'build/js/angular.min.js.map'
			}
		},

		watch: {
			scripts: {
				files: ['src/js/**/*.js'],
				tasks: ['concat:dist']
			},
			styles: {
				files: ['src/css/**/*.css'],
				tasks: ['concat:css']
			}
		}
	});

	//npm tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	//tasks
	grunt.registerTask('default', 'Default Task', ['concat']);
}