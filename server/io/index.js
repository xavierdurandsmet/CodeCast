'use strict';
var socketio = require('socket.io');
var io = null;
var mongoose = require('mongoose');
require('../db/models');
var CodeSlice = mongoose.model('CodeSlice');
var Comment = mongoose.model('Comment');
var Room = mongoose.model('Room');

module.exports = function(server) {

	if (io) return io;
	io = socketio(server);

	io.on('connection', function(socket) {

		// on key press, create new snippet and update codeHistory
		socket.on('updatedText', function(obj) {
			console.log('in index io updatedText', obj.room.toString())
			var snippet = obj;
			var roomToSendTo = obj.room.toString();
			// emit to the specific room
			socket.broadcast.to(roomToSendTo).emit('change the textSnip', obj);
			// update History
			Room.findByIdAndUpdate(obj.room, {textHistory: obj.text, resultHistory: obj.result}).exec()
			.then(function(){
				// store the obj in db
				CodeSlice.create(snippet)
			})
		})

		// when user posts a comment/quesion, create new comment
		socket.on('send a comment', function (obj) {
			console.log('socket on server obj', obj)
			var commentObj = obj;
			var roomToSendTo = obj.room.toString();
			// create a comment instance and update comment History on room
			Comment.create(commentObj)
			.then(function(comment){
				console.log('comment created', comment)
				Room.findById(commentObj.room).populate('commentHistory').exec()
				.then(function (room) {
					room.commentHistory.push(comment);
					room.save()
					console.log('room with commentHistory', room)
					// send comment to specific room including the sender
					io.to(roomToSendTo).emit('receive comment', room);
					return room;
				})
			})
		})

		socket.on('join', function(objReceived) {
			console.log("USER HAS ARRIVED");
			var newUser = objReceived.user;
			socket.join(objReceived.room);
			// update the list of students in room
			Room.findById(objReceived.room).populate('students').exec()
			.then(function (room) {
				var push = true;
				room.students.forEach(function (studentObj) {
					if ((studentObj._id === newUser._id) || (objReceived.instructor === true)) {
						push = false;
					}
				})
				if (push) {
					room.students.push(newUser)
				}

				// if ((room.students.indexOf(newUser._id) === -1) && (room.students.indexOf(newUser._id) !== objReceived.instructor)){
				// 	room.students.push(newUser._id)
				// }
				room.save()
				console.log('room.students after update', room)
				io.to(room._id).emit('add to room.students', room);
				return room;
			})
		})


		socket.on('leave', function(objReceived) {
			console.log("USER HAS LEFT");
			var newUser = objReceived.user;
			// remove student from list in room
			socket.leave(objReceived.room);
			Room.findById(objReceived.room).populate('students').exec()
			.then(function (room) {
				room.students.splice(room.students.indexOf(newUser), 1)
				room.save()
				console.log('room.students after update when leaves room', room.students)
				io.to(room._id).emit('delete from room.students', room);
				return room;
			})
		});

		socket.on('disconnect', function() {
			console.log('user disconnected');
		});
	});



	return io;

};