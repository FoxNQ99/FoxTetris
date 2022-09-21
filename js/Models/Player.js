"use strict";

class Player {
	constructor() {
		this.name = this.mail = "";
		this.score = 0;
		this.isLose = true;
	}
	setScore() {
		this.score += 1;
	}
	setLose(isLose) {
		this.isLose = isLose;
	}
	reset() {
		this.score = 0;
		this.setLose(false);
	}
	setName(name) {
		this.name = name;
	}
	setMail(mail) {
		this.mail = mail;
	}
	getName() {
		return this.name;
	}
	getScore() {
		return this.score;
	}
	IsLose() {
		return this.isLose;
	}
}

export default Player;
