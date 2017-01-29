'use strict';

function Seabatle() {
	var self = this;
	const WAR_SIZE = 10;
	var batleFieldUser = document.querySelector('#batleFieldUser');
	var batleFieldComp = document.querySelector('#batleFieldComp');
	var creatingField = function(n){
		var usertable = document.createElement('table');
		var tbody = document.createElement('tbody');
		this.battleField = new Array(n);
		for (var i = 0; i < n; i++){
			var tr = document.createElement('tr');
			this.battleField[i] = new Array(n);
				for(var j = 0; j < n; j++){
					var td = document.createElement('td');
					tr.appendChild(td);
	    			this.battleField[i][j] = { 		
						user: {
							ship: false,
							shoot: false,
							missed: false,
							kill: false,
							wound: false,
							margin: false,
							deck: 0
	    					},
	    				enemy: {
	    					ship: false,
							shoot: false,
							missed: false,
							kill: false,
							wound: false,
							margin: false,
							deck: 0
						}
					};
				};
			tbody.appendChild(tr);
		};
		usertable.appendChild(tbody);
		batleFieldUser.appendChild(usertable);
		var compTable = usertable.cloneNode(true);
		batleFieldComp.appendChild(compTable);
	}.bind(this);
	creatingField(WAR_SIZE);
	var random = false;
	var target = "user";
	var countLenght = 0;
	var shipLog = document.querySelector("#shipsLog");		// Корабельнный журнал для ввода инфы из игры
	var loged = function(messagetext){
		var shipLogNode = document.createElement("p");
		var shiplogTime = document.createElement("span"); //TODO возможный вывод времении напротив каждого сообщения игры.
		var shipLogText = document.createTextNode(messagetext);
		shipLogNode.appendChild(shipLogText);
		shipLog.insertBefore(shipLogNode, shipLog.firstChild);
	};
	var manual = document.querySelector(".manual"); // активация "ручной" растановки
	var manualData = document.querySelector(".column");
	manualData.style.display = "none";
	manual.addEventListener("click", function(){
		random = false;
		activedClearAll();
		manualData.style.display = "block";
	});
	batleFieldUser.addEventListener("click", activedField);
	function activedField (e){                           // Ф активирует начальннык координаты для построения корабля
		if(e.target.nodeName == "TD"){
			if(!dataBuildShip.shipLenght) return loged("eroor03");
			target = "user";
			dataBuildShip.x = e.target.parentNode.rowIndex;
			dataBuildShip.y = e.target.cellIndex;
			requestBuildingShip();
		};
	};
	var dataBuildShip = {	// объект содержит параметры текущего строящегося корабля
		x: null,
		y: null,
		shipLenght: null,
		direction: 1
	};
	var port = {	// "порт" содержит полный набор кораблей по палубностям
		ship4: 1,
		ship3: 2,
		ship2: 3,
		ship1: 4
	};
	var switchDeck = document.querySelector(".paluba");
	switchDeck.addEventListener("click", activedShipPort);     //выбор палубности текущего строящегося корябля.
	function activedShipPort(e){
		if(e.target.selectedIndex != 0){
			dataBuildShip.shipLenght = e.target.selectedIndex;
		}
	};
	var direction = document.querySelector(".direction");		// выбор направления корабля
	direction.addEventListener("click", activedDirection);
	function activedDirection(e){
		if(e.target.nodeName != "INPUT") return;
		if(e.target.checked){
			dataBuildShip.direction = 0;
			e.target.nextElementSibling.innerText = "Горизонтальный";
		} else if(!e.target.checked){
			dataBuildShip.direction = 1;
			e.target.nextElementSibling.innerText = "Вертикальный";
		};
	};
	var user = document.querySelector("#batleFieldUser table tbody");
	var enemy = document.querySelector("#batleFieldComp table tbody");
	var requestBuildingShip = function(){  //функция "запроса" на построение корабля, запускает функции валидаций и после потверждение функцию стройки корабля.
		var x = dataBuildShip.x;
		var y = dataBuildShip.y;
		var shipLenght = dataBuildShip.shipLenght;
		var direction = dataBuildShip.direction;
		if (validationshipLenght(x,y,shipLenght,direction) && validationMargin(x,y,shipLenght,direction) 
			&& validationPortship()) {	
		 	buildingShip(x,y,shipLenght,direction);
		 	if (random == true && (port.ship1 + port.ship2 + port.ship3 + port.ship4) != 0) {
		 		automating();
		 	};
		} else if (random) {
			automating();
		} else{
			console.log(messageError);			
		}
	};
		var clearAll = document.querySelector(".clear-all"); 	// Ф очистки всех полей от кораблей. Сброс "ручной" растановки.
			clearAll.addEventListener("click", function(e){
				if(e.target.nodeName != "BUTTON") return;
				activedClearAll();
			});
		var activedClearAll = function (){
				for (var i = 0; i < 10; i++) {
					for (var j = 0; j < 10; j++) {
						self.battleField[i][j][target].ship = false;
						self.battleField[i][j][target].margin = false;
						self.battleField[i][j][target].deck = false;
						port.ship4 = 1;
						port.ship3 = 2;
						port.ship2 = 3;
						port.ship1 = 4;
						if(target == "user" && user.classList.contains("tdUserShip")) user.children[i].children[j].classList.remove("tdUserShip");
					};
				};
			};
		var errorTable = { 					// объект с информационными сообщениями.
				eroor02: 'Слишком близко к другому Вашему кораблю! Выберите другое расположение!',
				eroor03: 'Выберите палубность корабля!',
				eroor04: 'Ваш корабль вылазит за край мира! Он упадет! Выберите другую палубность или новое расположение!',
				eroor07: 'Вы уже стреляли сюда!',
				eroor08: 'Вы установили максимум кораблей данной палубности!',
				  msg01: 'Корабль готов!',
				  msg02: 'Игрок промахнулся!',
				  msg04: 'Компьюьер промахнулся!',
				  msg05: 'Компьютер убил все корабли игрока! Игрок проиграл!',
				  msg06: 'Игрок убил все корабли компьютера! Компьютер проиграл!',
				  msg07: 'Игрок убил корабль компьютера!',
				  msg08: 'Компьютер убил корабль игрока!',
				  msg09: 'Игрок ранил корабль компьютера!',
				  msg10: 'Компьютер ранил корабль игрока!'
			};
		var automatic = document.querySelector(".automatic");  // активация автоматической растановки
			automatic.addEventListener("click", function(){
				target = "user";
				manualData.style.display = "none";
				activedClearAll();
				automating();
			});
		var numbersGeneration = function (min, max) {
			var rand = min + Math.random() * (max + 1 - min);
			rand = Math.floor(rand);
			return rand;
		};
		var automating = function (){
			random = true;
			dataBuildShip.x = numbersGeneration(0, 9);
			dataBuildShip.y = numbersGeneration(0, 9);
			dataBuildShip.shipLenght = numbersGeneration(1, 4);
			dataBuildShip.direction	= numbersGeneration(0, 1);
			requestBuildingShip();
			};
		var enemyBuild = function(){	// активация постройки кораблей компьютера
			target = "enemy";
			activedClearAll();
			automating();
			return true;
		};
		var buildingShip = function (x,y,shipLenght,direction){ // Ф построение корабля
		// debugger;
		for(var i = (x-1); i <= (x + 1); i++ ){
			if(i < 0 || i > this.battleField.length - 1) continue;
			for(var j = (y-1); j <= (y+1); j++){
				if(j < 0 || j > this.battleField.length - 1) continue;
				this.battleField[i][j][target].margin = true;
			}
		}
		countLenght --;
		this.battleField[x][y][target].ship = true;
		if(target == "user") user.children[x].children[y].classList.add("tdUserShip");
		this.battleField[x][y][target].deck = shipLenght;
		if (countLenght <= 0) {
			loged(errorTable.msg01);
			return;
		} else if(direction == 1){
			buildingShip((x+1),y,shipLenght,direction);
		} else {
			buildingShip(x,(y+1),shipLenght,direction);
		}
	}.bind(this);
	var validationMargin = function  (x,y,shipLenght,direction){ // проверка на близость других кораблей
		// debugger;
		if(direction == 1){
			if (this.battleField[x][y][target].margin == true || this.battleField[x+(shipLenght-1)][y][target].margin == true) {
				loged(errorTable.eroor02);
				return false;
			} else {
				return true;
			}
		}else if (direction == 0){
			if (this.battleField[x][y][target].margin == true || this.battleField[x][y+(shipLenght-1)][target].margin == true) {
				loged(errorTable.eroor02);
				return false;
			} else {
				return true;
			}
		}
	}.bind(this);
	var validationshipLenght = function (x,y,shipLenght,direction){ // проверка на влезамость корабля в размеры поля
		// debugger;
		if(direction == 1){
			if((x+shipLenght) <= this.battleField.length) {
				countLenght = shipLenght;
				return true;
			} else {
				loged(errorTable.eroor04);
				return false;
			}
		} else if (direction == 0){
			if((y+shipLenght) <= this.battleField.length){
				countLenght = shipLenght;
				return true;
			}else {
				loged(errorTable.eroor04);
				return false;
			}
		}
	}.bind(this);
	var validationPortship = function(){   // проверка количестка раставленных кораблей
		switch (dataBuildShip.shipLenght){
			case 1: port.ship1--;
				if(port.ship1 < 0){
					loged(errorTable.eroor08);
					port.ship1 = 0;
					return false
				} else return true;
			case 2: port.ship2--;
				if(port.ship2 < 0) {
					loged(errorTable.eroor08);
					port.ship2 = 0;
					return false
				} else return true;
			case 3: port.ship3--;
				if(port.ship3 < 0){
					loged(errorTable.eroor08);
					port.ship3 = 0;
					return false
				} else return true;
			case 4: port.ship4--;
				if(port.ship4 < 0){
					loged(errorTable.eroor08);
					port.ship4 = 0;
					return false
				} else return true;
		}
	};
	var startBattle = document.querySelector(".startbattle"); // старт боя
			startBattle.addEventListener("click", function(){
				enemyBuild();
				batleFieldComp.addEventListener("click", shootout);
			});
	var shootout = function(e){
		if(e.target.nodeName != "TD") return false;
			var x = e.target.parentNode.rowIndex;
			var y = e.target.cellIndex;
			target = "enemy";
			if (validationFieldShoot(x,y)) killingShip(x,y);
			return;
	};
	var killingShip = function(x,y){
		// debugger;
		this.battleField[x][y][target].shoot = true;
		if (this.battleField[x][y][target].ship == true){
			this.battleField[x][y][target].ship = false;
			this.battleField[x][y][target].kill = true;
			if(this.battleField[x][y][target].deck == 1){
					if(target == "enemy"){
						enemy.children[x].children[y].classList.add("tdKillShip");
						loged(errorTable.msg07);
						validationSonar();
					}
					if(target == "user"){
						if(shipWounded[target].woundedCount != 0) {
							user.children[shipWounded[target].lastX].children[shipWounded[target].lastY].classList.remove("tdUserShip");
							user.children[shipWounded[target].lastX].children[shipWounded[target].lastY].classList.add("tdKillShip");;
						}
						user.children[x].children[y].classList.remove("tdUserShip");
						user.children[x].children[y].classList.add("tdWoundShip");
						shipWounded[target].woundedCount = 0;
						shipWounded[target].deck = undefined;
						loged(errorTable.msg08);
						if(validationSonar())automatingShot();
					}
			} else {
				this.battleField[x][y][target].wound = true;
					if(target == "enemy") {
						if(shipWounded[target].woundedCount != 0){
							enemy.children[shipWounded[target].lastX].children[shipWounded[target].lastY].classList.remove("tdWoundShip");
							enemy.children[shipWounded[target].lastX].children[shipWounded[target].lastY].classList.add("tdKillShip");
						};
						shipWounded[target].woundedCount = 1;
						shipWounded[target].deck = this.battleField[x][y][target].deck - 1;
						shipWounded[target].lastX = x;
						shipWounded[target].lastY = y;
						loged(errorTable.msg09);
						enemy.children[x].children[y].classList.add("tdWoundShip");
					}
					if(target == "user"){
						if(shipWounded[target].woundedCount != 0) {
							user.children[shipWounded[target].lastX].children[shipWounded[target].lastY].classList.remove("tdWoundShip");
							user.children[shipWounded[target].lastX].children[shipWounded[target].lastY].classList.add("tdKillShip");
						}
						user.children[x].children[y].classList.add("tdWoundShip");
						shipWounded[target].woundedCount = 1;
						shipWounded[target].deck = this.battleField[x][y][target].deck - 1;
						shipWounded[target].lastX = x;
						shipWounded[target].lastY = y;
						loged(errorTable.msg10);
						coordinatesRebound();
					}
				}
			} else {
				this.battleField[x][y][target].missed = true;
				this.battleField[x][y][target].deck = 0;
				if(target == "enemy"){
					enemy.children[x].children[y].classList.add("tdMissedShip");
					if(shipWounded[target].woundedCount > 0) {
						loged(errorTable.msg02);
						coordinatesRebound();
					}else{
						loged(errorTable.msg02);
						automatingShot();
					}
				} else if(target == "user") {
					user.children[x].children[y].classList.add("tdMissedShip");
					loged(errorTable.msg04);
				}
			}	
	}.bind(this); 
	var automatingShot = function(){
		// debugger;
		target = "user";
		var x = numbersGeneration(0, 9);
		var y = numbersGeneration(0, 9);
		shipWounded[target].firstX =x;
		shipWounded[target].firstY =y;
		if (validationFieldShoot(x,y) && validationShotMargin (x,y)) {
			killingShip(x,y);
			return -1;
		} else {
			automatingShot();
		}
		return;
	};
	var validationShotMargin = function(x,y){
		for(var i = (x-1); i <= (x + 1); i++ ){					// циклы для "построения" вокруг корабля "рамки" толщиной 1 квадрат
			if(i < 0 || i > this.battleField.length - 1) continue;
			for(var j = (y-1); j <= (y+1); j++){
				if(j < 0 || j > this.battleField.length - 1) continue;
				if(this.battleField[i][j][target].kill == true){
					return false;
				} else return true;
			}
		}	
	}.bind(this);
	var shipWounded = {					// объект "последний раненный корабль"
			user: {
				firstX: undefined,
				firstY: undefined,
				lastX: undefined,
				lastY: undefined,
				deck: undefined,
				woundedCount: 0,
				shootX: undefined,
				shootY: undefined
			},
			enemy: {
				lastX: undefined,
				lastY: undefined,
				deck: undefined,
				woundedCount: 0
				// shootX: undefined,
				// shootY: undefined
			}
	};
	var coordinatesRebound = function(){ // Ф получающая координаты возможные для добивания раненого корабля
		// debugger;
		target = "user";
		var directionRebound = numbersGeneration(0,1);
		if(directionRebound == 1) {
			shipWounded[target].shootX = numbersGeneration(shipWounded[target].lastX-1, shipWounded[target].lastX+1);
			shipWounded[target].shootY = shipWounded[target].lastY;
		} else {
			shipWounded[target].shootY = numbersGeneration(shipWounded[target].lastY-1, shipWounded[target].lastY+1);
			shipWounded[target].shootX = shipWounded[target].lastX;
		};
		validationRebound();
		return -1;
	};
	var validationRebound = function(){                        // Ф добивания раненого корабля
		// debugger;
		if(validationFieldRebound(shipWounded[target].shootX, shipWounded[target].shootY) && validationFieldShoot(shipWounded[target].shootX, shipWounded[target].shootY)){
			this.battleField[shipWounded[target].shootX][shipWounded[target].shootY][target].deck = shipWounded[target].deck;
			killingShip(shipWounded[target].shootX,shipWounded[target].shootY);
			return -1;
		} else if (totalDestruction()){
			this.battleField[shipWounded[target].shootX][shipWounded[target].shootY][target].deck = shipWounded[target].deck;
			killingShip(shipWounded[target].shootX,shipWounded[target].shootY);
			return -1;
		} else {
			coordinatesRebound();
		}
	}.bind(this);
	var validationFieldRebound = function(x,y){       // проверка для попытки добить раненный корабль
		// debugger;
		if(x >= 0 && y >= 0 && x <= this.battleField.length-1 && y <= this.battleField.length-1 ){
			return true;
		} else {
			return false
		};
	}.bind(this);
	var validationFieldShoot = function(x,y){			// проверка на "стрелили ли в поле"
		if (this.battleField[x][y][target].shoot == false){
			return true;
		} else{
			loged(errorTable.eroor07);
			return false;
		}
	}.bind(this);
	var totalDestruction = function(){				// функция для добивания раненого корабля. для 3-4 палубнных кораблей
		// debugger;
		var deathReturn = 0;
		var doubleKill = 0;
		for(var i = (shipWounded[target].firstX-1); i <= (shipWounded[target].firstX + 1); i++ ){
			if(i < 0 || i > this.battleField.length - 1) continue;
			for(var j = (shipWounded[target].firstY-1); j <= (shipWounded[target].firstY+1); j++){
				if(j < 0 || j > this.battleField.length - 1) continue;
				if(i == shipWounded[target].firstX && j == shipWounded[target].firstY) continue;
				if(this.battleField[i][j][target].kill === true){
					deathReturn++
				}
				if(this.battleField[i][j][target].ship === true){
					shipWounded[target].shootX = i;
					shipWounded[target].shootY = j;
					doubleKill++;
				}
			}
		}
		if(deathReturn == 1 && doubleKill == 1){
			return true;
		} else {
			return false;
		}
	}.bind(this);
	var validationSonar = function(){			// проверка на наличие оставшихся кораблей
		var countAllShip = 0;
			for (var i = 0; i <= this.battleField.length - 1; i++) {
				for (var j = 0; j <= this.battleField.length - 1; j++) {
					if (this.battleField[i][j][target].ship == true){
						countAllShip++;
						return true;
					}
				}
			}
		if(countAllShip <= 0 && target == "user"){
			loged(errorTable.msg05);
			activedClearAll();
			return false;
		} else if(countAllShip <= 0 && target == "enemy"){
			loged(errorTable.msg06);
			activedClearAll();
			return false;
		}
	}.bind(this);
}
var seabatle = new Seabatle();