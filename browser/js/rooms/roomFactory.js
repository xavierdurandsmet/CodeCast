app.factory('roomFactory', function($http, socketFactory) {
	return {
		getAllRooms: function() {
			return $http.get('/api/rooms')
				.then(function(res) {
					return res.data
				})
		},

		getAllFutureLecturesOfOneInstructor: function(instructorId) {

			return $http.get('/api/rooms/instructor/' + instructorId)
				.then(function(res) {
					return res.data
				})
		},

		getAllLecturesOfOneInstructor: function(instructorId) {

			return $http.get('/api/rooms/lectures/' + instructorId)
				.then(function(res) {
					return res.data
				})
		},

		makeRoom: function(name, instructorId) {
			return $http.post('/api/rooms', {
					name: name,
					instructor: instructorId
				})
				.then(function(res) {
					socketFactory.emit('initiliaze comments', {
						roomId: res.data._id
					})

					return res.data;
				})
		},

		getOneRoom: function(room_id) {
			return $http.get('/api/rooms/' + room_id)
				.then(function(res) {
					return res.data;
				});
		},
		getAllLectures: function() {
			return $http.get('/api/rooms/lectures')
				.then(function(res) {
					return res.data
				})
		},

	};
});