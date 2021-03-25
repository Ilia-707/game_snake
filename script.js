document.getElementById('newGame').onclick = start;

let param = document.getElementById('param');
let paramList = document.getElementsByClassName('param');
param.onclick = function() {    
	paramList[0].style.visibility = "visible";	
	paramList[0].style.zIndex = 1;
}
let apply = document.getElementById('apply');
apply.onclick = function() {    
	paramList[0].style.visibility = "hidden";		
}
function start () {
	let zone = document.getElementById('zone');
	zone.innerHTML = "";
	let result = document.getElementById('result');
	result.innerHTML = "";
	let timerId;
	let snake = [];
	let newLink;		
	let size = zone.clientWidth/pole.value;
	let delay = speed.value;	
	for (let i = 1; i<=3; i++) {
		let link = document.createElement('div');
		link.setAttribute('id', `link${i}`);
		link.classList.add('link');		
		link.style.width = size + "px";
		link.style.height = size + "px";
		link.style.top = 1*size + "px";
		link.style.left = size*(3-i) + "px";				
		zone.append(link);		
		snake.push(i);
	}
	let link1 = document.getElementById('link1');
	link1.style.backgroundColor = "#02ca20";
	
	createNewLink ();
	
	function createNewLink () {
	    newLink = document.createElement('div');
	    let ID = snake[snake.length-1]+1; 
        newLink.setAttribute('id', `link${ID}`);
        newLink.classList.add('link');
		newLink.style.width = size + "px";
		newLink.style.height = size + "px";	    	    
        createCoord();
		//заранее добаляем в массив snake
		snake.push(ID);
    
        function createCoord() {
	        let coordZone = zone.getBoundingClientRect();
	        let top = Math.floor(Math.random()*pole.value)*size;	
	        let left = Math.floor(Math.random()*pole.value)*size;	    
            for (let i = 1; i <= snake.length; i++) {
     	        let link = document.getElementById(`link${i}`);
		        let coord = link.getBoundingClientRect();		        
                if (!((coord.top - coordZone.top) == top && (coord.left - coordZone.left) == left)) {
					newLink.style.top = top + "px";
                    newLink.style.left = left + "px";
                    zone.append(newLink);				    
			    } else {
	                createCoord();
				    break;
			    }
		    }
        }
	}
	
	document.addEventListener('keydown', move);
	
	function move(event) {		
		let link2 = document.getElementById('link2');
		let coord1 = link1.getBoundingClientRect();
		let coord2 = link2.getBoundingClientRect();
		if (event.code =='ArrowDown') {
			event.preventDefault();
			if (coord2.top == coord1.top + size) return;
			changeCoordAndMove (0, size);
		} else if (event.code =='ArrowLeft') {
			event.preventDefault();
			if (coord2.left == coord1.left - size) return;
			changeCoordAndMove(-size, 0);
		} else if (event.code =='ArrowRight') {
			event.preventDefault();
			if (coord2.left == coord1.left + size) return;
			changeCoordAndMove(size, 0);
		} else if (event.code =='ArrowUp') {
			event.preventDefault();
			if (coord2.top == coord1.top - size) return;
			changeCoordAndMove(0, -size);
		}
			
	    function changeCoordAndMove (X, Y) {		   			
			let coordZone = zone.getBoundingClientRect();
			changeCoord (X, Y);
		    if (typeof(timerId) != "undefined") clearInterval(timerId);				
			timerId = setInterval(changeCoord, delay, X, Y);
			
			function changeCoord (X, Y) {
			    X = +X;
			    Y = +Y;				
			    let coordLink1 = link1.getBoundingClientRect();
			    let top = coordLink1.top - coordZone.top;
			    top += Y;
			    let left = coordLink1.left - coordZone.left;
			    left += X;				
			    if (left < 0 || left > (600-size) || top < 0 || top > (600-size)) {
				    document. removeEventListener ('keydown', move);
				    clearInterval(timerId); 
     				link1.style.backgroundColor = 'red';
					let gameOver = document.createElement('span');
					gameOver.innerHTML = 'Game over';
					gameOver.classList.add('gameOver');
					zone.append(gameOver);
				console.log(gameOver);					
			    } else {
					//вычисляем координаты полседнего звена змейки
					//для передачи их в дальнейшем новому звену
					let lastLink = document.getElementById(`link${snake.length-1}`);
					let coordLastLink = lastLink.getBoundingClientRect();
					//далее каждое звено получает координаты предыдущего
			        for (let i = snake.length-1; i>1; i--) {
				        let linkPrevious = document.getElementById(`link${i-1}`);
				        let coord = linkPrevious.getBoundingClientRect();
				        let linkCurrent = document.getElementById(`link${i}`);
				        let currentTop = coord.top - coordZone.top;
				        let currentLeft = coord.left - coordZone.left;
						//проверяем несовпала ли голова змеи с координатами другого звена(т.е. врезалась в себя)
						//если да, то подсвечиваем ее красным цветом и прекращаем движение
				        if (currentTop == top && currentLeft == left) {
			                document. removeEventListener ('keydown', move);
			                clearInterval(timerId);
							link1.style.backgroundColor = 'red';
					        let gameOver = document.createElement('span');
							gameOver.innerHTML = 'Game over';
							gameOver.classList.add('gameOver');
					        zone.append(gameOver);
				        } else { 
				            linkCurrent.style.top = currentTop + "px";
				            linkCurrent.style.left = currentLeft + "px";
				        }
                    }				   
			        link1.style.top = top + "px";				     
			        link1.style.left = left + "px";
					//если голова змеи совпала с координатами нового звена(т.е. съела)
					//то изменяем координаты нового звена на координаты последнего и запускаем функцию createNewLink
					let coordNewLink = newLink.getBoundingClientRect(); 
					if ((coordNewLink.top - coordZone.top) == top && (coordNewLink.left - coordZone.left) == left) {
						link1.style.backgroundColor = 'red';
					    setTimeout(()=> link1.style.backgroundColor = '#02ca20', delay);						
						newLink.style.top = coordLastLink.top - coordZone.top + "px";
						newLink.style.left = coordLastLink.left - coordZone.left + "px";						
						result.innerHTML = snake.length - 3;
						createNewLink ();
					}
			    }	           
            }			   
	    }
	}
}
			
				