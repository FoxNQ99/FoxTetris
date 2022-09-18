const ENV = {
	mapSize: {
		width: 15,
		height: 25,
	},
	className: {
		point: "game-point",
		activePoint: "active",
		gameContainer: "game-container",
		mapContainer: "map-container",
		menuContainer: "menu-container",

		infoContainer: "info-container",
		infoDesc: "info-desc",
		infoContent: "info-content",
		nextBoxContent: "info-next-box",

		title: "title",
	},
	ID: {
		root: "root",
		view: "mainView",
		menu: "mainMenu",
		menuInput: "txbUserName",
		menuHelloString: "lbHello",
		menuStartBtn: "btnStart",
		menuStartBtnBig: "btnStartBig",

		scoreLabel: "lbScore",
		playerNameLabel: "lbUsername",
	},
	content: {
		title: "JS Tetris Game",
		start: "Start Game",
		lose: "You Lose!!, Thank you for Playing",
		won: "Wow, You is not a Hunman",
		menuInput: "What Your Name, Hero?",
	},
	hello: {
		morning: ["Have a Nice Day, ", "Nice To See You, ", "Thank You Plaing My Game"],
		midday: ['Or should I say " afternoon "? ', "Are You OK? ", "How's It Going? "],
		evening: ["uhm ... Hi, ", "Good Evening, ", "Are You OK? "],
	},
};
export default ENV;
