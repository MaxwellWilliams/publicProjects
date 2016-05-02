var squares = [],
    EMPTY = '\xA0',
    globalRow,
    globalColumn,
    turn,
    moves,
    gameMode,
    ai1Mode,
    ai2Mode,
    isOtherAiSet,
    gameIsOver
    thisDir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')),
    redImageSrc = "file://" + thisDir + "/redPiece.jpg",
    yellowImageSrc = "file://" + thisDir + "/yellowPiece.jpg",
    blockerImageSrc = "file://" + thisDir + "/blackPiece.jpg";
    
startNewGame = function() {
    var redsGamePiece = document.getElementById("redPiece"),
        redsblockerPieces = document.getElementById("redsBlockerPiecesDiv"),
        yellowPlayerDiv = document.getElementById("yellowPlayer"),
        yellowsGamePiece = document.getElementById("yellowPiece"),
        yellowsblockerPieces = document.getElementById("yellowsBlockerPiecesDiv"),
        collectBlockerPieceButton = document.getElementById("collectBlockerPieceButton");
    
    globalRow = 0;
    globalColumn = 0;
    turn = 'Red';
    moves = 0;
    gameMode = -1;
    ai1Mode = -1;
    ai2Mode = -1;
    isOtherAiSet = false;
    gameIsOver = false;
    
    setupChooseGameMode(true);
    setupPlayerMove(false);
    
    redsGamePiece.setAttribute("draggable", "false");
    yellowsGamePiece.setAttribute("draggable", "false");
    yellowPlayerDiv.style.backgroundColor = "#808080";
    yellowPlayerDiv.style.opacity = "0.40";
    collectBlockerPieceButton.disabled = true;
    
    for (i = 0; i < squares.length; i += 1) {
        squares[i].pieceType = EMPTY;
        if(squares[i].piecePlaced) {
            squares[i].removeChild(squares[i].childNodes[0]);
            squares[i].piecePlaced = false;
        }
    }
    while (redsblockerPieces.firstChild) {
        redsblockerPieces.removeChild(redsblockerPieces.firstChild);
    }
    while (yellowsblockerPieces.firstChild) {
        yellowsblockerPieces.removeChild(yellowsblockerPieces.firstChild);
    }
}

function setGameMode(modeValue) {
    gameMode = modeValue;
    if(gameMode == 0){
        setupChooseGameMode(false);
        setupPlayerMove(true);
    } else if(gameMode == 1) {
        setupChooseGameMode(false);
        setupChooseAi2(true);
    } else if(gameMode == 2) {
        setupChooseGameMode(false);
        setupChooseAi1(true);
        setupChooseAi2(true);
    }
}

function setAi1Mode(modeValue) {
    ai1Mode = modeValue;
    setupChooseAi1(false);
    
    if(gameMode == 2 && isOtherAiSet) {
        setupTable(true);
        aiVSai();
    } else if(gameMode == 2 && !isOtherAiSet) {
        isOtherAiSet = true;
    }
}

function setAi2Mode(modeValue) {
    ai2Mode = modeValue;
    setupChooseAi2(false);
    
    if(gameMode == 1){
        setupPlayerMove(true);
    } else if(gameMode == 2 && isOtherAiSet) {
        setupTable(true);
        aiVSai();
    } else if(gameMode == 2 && !isOtherAiSet) {
        isOtherAiSet = true;
    }
}

function setupChooseGameMode(enable){
    var chooseGameModeDiv = document.getElementById("chooseGameMode"),
        playerVSplayerButton = document.getElementById("playerVplayer"),
        playerVSaiButton = document.getElementById("playerVai"),
        aiVSaiButton = document.getElementById("aiVai"),
        backgroundColorValue = enable ? "#FFFFFF" : "#808080",
        opacityValue = enable ? "1.00" : "0.40",
        buttonMode = !enable;
    
    chooseGameModeDiv.style.backgroundColor = backgroundColorValue;
    chooseGameModeDiv.style.opacity = opacityValue;
    playerVSplayerButton.disabled = buttonMode;
    playerVSaiButton.disabled = buttonMode;
    aiVSaiButton.disabled = buttonMode;
}

function setupPlayerMove(enable){
    var redsGamePiece = document.getElementById("redPiece"),
        redPlayerDiv = document.getElementById("redPlayer"),
        footerDiv = document.getElementById("footer"),
        collectBlockerButton = document.getElementById("collectBlockerPieceButton"),
        backgroundColorValue = enable ? "#FFFFFF" : "#808080",
        opacityValue = enable ? "1.00" : "0.40",
        buttonMode = !enable;
    
    redsGamePiece.setAttribute("draggable", "true");
    redPlayerDiv.style.backgroundColor = backgroundColorValue;
    redPlayerDiv.style.opacity = opacityValue;
    footerDiv.style.backgroundColor = backgroundColorValue;
    footerDiv.style.opacity = opacityValue;
    collectBlockerButton.disabled = buttonMode;
    setupTable(enable);
}

function setupChooseAi1(enable){
    var chooseAi1ModeDiv = document.getElementById("chooseAi1Mode"),
        ai1RandomButton = document.getElementById("ai1Random"),
        ai1DefensiveButton = document.getElementById("ai1Defensive"),
        ai1OffensiveButton = document.getElementById("ai1Offensive"),
        backgroundColorValue = enable ? "#FFFFFF" : "#808080",
        opacityValue = enable ? "1.00" : "0.40",
        buttonMode = !enable;
        
    chooseAi1ModeDiv.style.backgroundColor = backgroundColorValue;
    chooseAi1ModeDiv.style.opacity = opacityValue;
    ai1RandomButton.disabled = buttonMode;
    ai1DefensiveButton.disabled = buttonMode;
    ai1OffensiveButton.disabled = buttonMode;
}

function setupChooseAi2(enable) {
    var chooseAi2ModeDiv = document.getElementById("chooseAi2Mode"),
        ai2RandomButton = document.getElementById("ai2Random"),
        ai2DefensiveButton = document.getElementById("ai2Defensive"),
        ai2OffensiveButton = document.getElementById("ai2Offensive"),
        backgroundColorValue = enable ? "#FFFFFF" : "#808080",
        opacityValue = enable ? "1.00" : "0.40",
        buttonMode = !enable;
        
    chooseAi2ModeDiv.style.backgroundColor = backgroundColorValue;
    chooseAi2ModeDiv.style.opacity = opacityValue;
    ai2RandomButton.disabled = buttonMode;
    ai2DefensiveButton.disabled = buttonMode;
    ai2OffensiveButton.disabled = buttonMode;
}

function setupTable(enable) {
    var tableDiv = document.getElementById("table"),
        backgroundColorValue = enable ? "#FFFFFF" : "#808080",
        opacityValue = enable ? "1.00" : "0.40";
    
    tableDiv.style.backgroundColor = backgroundColorValue;
    tableDiv.style.opacity = opacityValue;
}

function set(ev) {
    ev.preventDefault();
    
    if(ev.dataTransfer.getData("text") == redImageSrc || ev.dataTransfer.getData("text") == yellowImageSrc || ev.dataTransfer.getData("text") == blockerImageSrc) {
        var row = this.i,
            column = this.j,
            rowIsFull = document.getElementById("cell" + "0" + column).piecePlaced == true,
            droppedImageSrc = ev.dataTransfer.getData("text"),
            isBlockerPiece = (droppedImageSrc == blockerImageSrc),
            waitToAlertWinTime = 526;
            
        if(rowIsFull) {
            alert("This column already is full!"); 
        } else {
            row = findRow(column);
            placePiece(row, column, droppedImageSrc, isBlockerPiece, waitToAlertWinTime);
            if(isBlockerPiece) {
                removeBlockerPiece();
            } else if(!gameIsOver) {
                changePlayers();
            }
        }
    }
}

function playerVSai() {
    var aiMoveSpeed = 525;          // Must be at least 525 to ensure proper order of execution (of other functions), ideally at least .
    
    window.setTimeout(function(){
        if(ai2Mode == 0){
            aiRandom(aiMoveSpeed);
        } else if(ai2Mode == 1) {
            aiDefensive(aiMoveSpeed);
        } else if(ai2Mode == 2) {
            aiSimpleComplete(aiMoveSpeed);
        }
        
    }, 600);
}

function aiVSai() {
    var aiTurnSpeed = 2200,              // Must be at least 526 to ensure proper order of execution (of other functions).
        aiMoveSpeed = aiTurnSpeed / 4;   // Must be 1/4 of turn to allow for a maximum of 4 possible moves to occur each turn.
    
    if(ai1Mode == 0){
        aiRandom(aiMoveSpeed);
    } else if(ai1Mode == 1) {
        aiDefensive(aiMoveSpeed);
    } else if(ai1Mode == 2) {
        aiSimpleComplete(aiMoveSpeed);
    }
    
    setTimeout(function(){
        if(!gameIsOver){
            aiVSai();  
        }
    }, aiTurnSpeed);
}

function aiRandom(aiMoveSpeed, recursive = false) {
    if(!gameIsOver){
        var moveOptions = 2;
            currentPlayersBlockerPiecesDiv = turn === 'Red' ? document.getElementById("redsBlockerPiecesDiv") : document.getElementById("yellowsBlockerPiecesDiv"),
            currentPlayersBlockerPiecesLength = currentPlayersBlockerPiecesDiv.children.length;
        
        if(currentPlayersBlockerPiecesLength > 0){
            moveOptions = 3;
        }
        
        moveChoice = Math.floor(moveOptions * Math.random());
        
        while(((currentPlayersBlockerPiecesLength >= 6) || recursive) && moveChoice == 1) {
            moveChoice = Math.floor(moveOptions * Math.random());
        }
        
        if(moveChoice == 0) {
            window.setTimeout(function(){
                placePieceRandomly(false, aiMoveSpeed);
                //alert("End of turn.")
            }, aiMoveSpeed)
        } else if(moveChoice == 1){
            window.setTimeout(function(){
                collectBlockerPiece();
                //alert("End of turn.")
            }, aiMoveSpeed);
        } else if(moveChoice == 2){
            window.setTimeout(function(){
                placePieceRandomly(true, aiMoveSpeed);
                aiRandom(aiMoveSpeed, true);
            }, aiMoveSpeed);
        }
    }
    
}

function aiDefensive(aiMoveSpeed) {
    if(!gameIsOver){
        var currentPlayersBlockerPiecesDiv = turn === 'Red' ? document.getElementById("redsBlockerPiecesDiv") : document.getElementById("yellowsBlockerPiecesDiv"),
            currentPlayersBlockerPiecesLength = currentPlayersBlockerPiecesDiv.children.length / 2,
            opponentsBlockerPiecesDiv = turn === 'Red' ? document.getElementById("yellowsBlockerPiecesDiv") : document.getElementById("redsBlockerPiecesDiv"),
            opponentsBlockerPiecesLength = opponentsBlockerPiecesDiv.children.length / 2,
            largestDefensiveMove = (currentPlayersBlockerPiecesLength + 1) < (opponentsBlockerPiecesLength + 2) ? (currentPlayersBlockerPiecesLength + 1) : (opponentsBlockerPiecesLength + 2),
            placedPiece = false,
            droppedImageSrc = turn === 'Red' ? redImageSrc : yellowImageSrc;
            
        //alert(largestDefensiveMove);
        
        for(var moveSize = 1; moveSize <= largestDefensiveMove; moveSize += 1) {
            var immediateDefensiveMoveLocation = getImmediateDevensiveMoves(moveSize);
            //alert("Possible Immediate Defensive moves: " + immediateDefensiveMoveLocation.toString());
        
            if(immediateDefensiveMoveLocation.length > 0 && !placedPiece){
                var moveOption = Math.floor(immediateDefensiveMoveLocation.length * Math.random()),
                    column = immediateDefensiveMoveLocation[moveOption];
                    
                for(var move = 1; move <= moveSize; move += 1) {
                    placedPiece = true;
                    
                    window.setTimeout(function(){
                        var row = findRow(column);
                        currentPlayersBlockerPiecesLength = currentPlayersBlockerPiecesDiv.children.length / 2;
                    
                        if(currentPlayersBlockerPiecesLength > 0) {
                            placePiece(row, column, blockerImageSrc, true, aiMoveSpeed);
                            removeBlockerPiece();
                            
                        } else {
                            //alert("Here!");
                            
                            placePiece(row, column, droppedImageSrc, false, aiMoveSpeed);
                            
                            if(!gameIsOver){
                                changePlayers();
                            }
                        }
                    }, aiMoveSpeed * move);
                }
            }
        }

        if(!placedPiece && getImmediateDevensiveMoves(currentPlayersBlockerPiecesLength + 2).length > 0 && currentPlayersBlockerPiecesLength <= 6){
            window.setTimeout(function(){
                //alert("Defensively collecting blocker piece.");
                collectBlockerPiece();
            }, aiMoveSpeed);
        } else if(!placedPiece) {
            //alert("Random move");
            aiRandom(aiMoveSpeed, false);
        }  
    }
}


function aiSimpleComplete(aiMoveSpeed) {
    if(!gameIsOver){
        var currentPlayersBlockerPiecesDiv = turn === 'Red' ? document.getElementById("redsBlockerPiecesDiv") : document.getElementById("yellowsBlockerPiecesDiv"),
            currentPlayersBlockerPiecesLength = currentPlayersBlockerPiecesDiv.children.length / 2,
            opponentsBlockerPiecesDiv = turn === 'Red' ? document.getElementById("yellowsBlockerPiecesDiv") : document.getElementById("redsBlockerPiecesDiv"),
            opponentsBlockerPiecesLength = opponentsBlockerPiecesDiv.children.length / 2,
            largetsOffensiveMove = currentPlayersBlockerPiecesLength + 1,
            largestDefensiveMove = (currentPlayersBlockerPiecesLength + 1) < (opponentsBlockerPiecesLength + 2) ? (currentPlayersBlockerPiecesLength + 1) : (opponentsBlockerPiecesLength + 2),
            placedPiece = false,
            droppedImageSrc = turn === 'Red' ? redImageSrc : yellowImageSrc;
        
        
        for(var moveSize = 1; moveSize <= largetsOffensiveMove; moveSize += 1) {
            var immediateOffensiveMoveLocations = getImmediateOffensiveMoves(moveSize);
            //alert("Possible Immediate Defensive moves: " + immediateOffensiveMoveLocations.toString());
        
            if(immediateOffensiveMoveLocations.length > 0 && !placedPiece){
                var moveOption = Math.floor(immediateOffensiveMoveLocations.length * Math.random()),
                    column = immediateOffensiveMoveLocations[moveOption];
                placedPiece = true;
                
                for(var move = 1; move <= moveSize; move += 1) {
                    window.setTimeout(function(){
                        var row = findRow(column);
                        currentPlayersBlockerPiecesLength = currentPlayersBlockerPiecesDiv.children.length / 2;
                    
                        if(!(inChcek(row, column, 0, 1, turn) || inChcek(row, column, 1, 0, turn) ||
                           inChcek(row, column, 1, 1, turn) || inChcek(row, column, 1, - 1, turn))) {
                            placePiece(row, column, blockerImageSrc, true, aiMoveSpeed);
                            removeBlockerPiece();
                            
                        } else {
                            //alert("Here!");
                            
                            placePiece(row, column, droppedImageSrc, false, aiMoveSpeed);
                        }
                    }, aiMoveSpeed * move);
                }
            }
        }
        if(!placedPiece && getImmediateOffensiveMoves(currentPlayersBlockerPiecesLength + 2).length > 0 && currentPlayersBlockerPiecesLength <= 6){
            window.setTimeout(function(){
                //alert("Offensively collecting blocker piece.");
                collectBlockerPiece();
            }, aiMoveSpeed);
        } else if(!placedPiece){
            aiDefensive(aiMoveSpeed);
        }
    }
}

function placePieceRandomly(isBlockerPiece, aiMoveSpeed){
    var droppedImageSrc = turn === 'Red' ? redImageSrc : yellowImageSrc,
        waitToAlertEndGameTime = aiMoveSpeed;
    
    droppedImageSrc = isBlockerPiece ? blockerImageSrc : droppedImageSrc;
    
    do {
        column = Math.floor(8 * Math.random());
    } while(document.getElementById("cell" + "0" + column).piecePlaced == true);
    
    row = findRow(column);
    placePiece(row, column, droppedImageSrc, isBlockerPiece, waitToAlertEndGameTime);
    
    if(isBlockerPiece) {
        removeBlockerPiece();
    } else if(!isBlockerPiece && !gameIsOver){
        changePlayers();
    }
    
}

function checkConnectedPieces(row, column, rowIncrement, columnIncrement) {
    var pieceType = document.getElementById("cell" + row + column).pieceType,
        connectedPieces = 0,
        canIncrementAgain = true;
    
    if(pieceType === EMPTY) {
        pieceType = 'nothing';
    }
    
    for(counter = 0; counter < 3; counter++) {
        
        if(connectedPieces != counter){
            canIncrementAgain = false;
        }
        
        if(canIncrementAgain && row + rowIncrement < 7 && row + rowIncrement >= 0) {
            row += rowIncrement;
        } else {
            canIncrementAgain = false;
        }
        if(canIncrementAgain && column + columnIncrement < 8 && column + columnIncrement >= 0) {
            column += columnIncrement;
        } else {
            canIncrementAgain = false;
        }
        
        var currentCell = document.getElementById("cell" + row + column);
        
        if(canIncrementAgain && currentCell.piecePlaced && (pieceType == currentCell.pieceType)) {
            connectedPieces+=1;
        }
    }
    return connectedPieces;
}

function findRow(column) {
    var row = 6,
        foundOpenSpace = false;
    
    while(!foundOpenSpace && row > -1){
        if(document.getElementById("cell" + row + column).piecePlaced == false) {
            foundOpenSpace = true;
        } else {
            row -= 1;
        }
    }
    return row;
}

function placePiece(row, column, imageSource, isBlockerPiece, waitToAlertEndGameTime) {
    var gameOver = false,
        piece = document.createElement("img");
        piece.setAttribute("src", imageSource);
        piece.setAttribute("draggable", false);
        piece.setAttribute("height", 42);
        piece.setAttribute("width", 42);
        
        document.getElementById("cell" + row + column).piecePlaced = true;
        document.getElementById("cell" + row + column).pieceType = isBlockerPiece === true ? 'blocker' : turn;
        moves += 1;
        
    for(var counter = 0; counter <= row; counter+=1) {
        pieceFalling(piece, counter, column);
    }
    
    if(!isBlockerPiece && win(row, column)) {
        gameIsOver = true;
        window.setTimeout(function(){
            alert(turn + " wins!");
            startNewGame();
        }, waitToAlertEndGameTime);
    }
    if(tie() && !gameIsOver){
       gameIsOver = true; 
       window.setTimeout(function(){
            alert("Tie game!");
            startNewGame();
        }, waitToAlertEndGameTime);
    }
}

function pieceFalling(piece, counter, column){
    document.getElementById("cell" + counter + column).appendChild(piece);
    setTimeout(function(){
        
        document.getElementById("cell" + counter + column).appendChild(piece);
        
    }, 75 * counter)
}

function win(row, column) {
    var win = false,
        currentPlayer = turn;
    
    if(checkConnectedPieces(row, column, 0, 1) + checkConnectedPieces(row, column, 0, -1) >= 3){
        win = true;
    } else if(checkConnectedPieces(row, column, 1, 0) + checkConnectedPieces(row, column, -1, 0) >= 3){
        win = true;
    } else if(checkConnectedPieces(row, column, 1, 1) + checkConnectedPieces(row, column, -1, -1) >= 3){
        win = true;
    } else if(checkConnectedPieces(row, column, 1, -1) + checkConnectedPieces(row, column, -1, 1) >= 3) {
        win = true;
    } else {
        win = false;
    }
    
    return win;
}

function tie() {
    if (moves === 56) {
        return true;
    } else {
        return false;
    }
}

function removeBlockerPiece() {
    var currentPlayersBlockerPiecesDiv = turn === 'Red' ? document.getElementById("redsBlockerPiecesDiv") : document.getElementById("yellowsBlockerPiecesDiv"),
        currentPlayersBlockerPieces = currentPlayersBlockerPiecesDiv.children;
    
    currentPlayersBlockerPiecesDiv.removeChild(currentPlayersBlockerPiecesDiv.childNodes[currentPlayersBlockerPieces.length-1]);
    currentPlayersBlockerPiecesDiv.removeChild(currentPlayersBlockerPiecesDiv.childNodes[currentPlayersBlockerPieces.length-1]);
    document.getElementById("collectBlockerPieceButton").disabled = true;
}

function changePlayers() { 
    var currentPlayerDiv = turn === 'Red' ? document.getElementById("redPlayer") : document.getElementById("yellowPlayer"),
        otherPlayerDiv = turn === 'Red' ? document.getElementById("yellowPlayer") : document.getElementById("redPlayer"),
        //currentPlayersBlockerPiecesDiv = turn === 'Red' ? document.getElementById("redsBlockerPiecesDiv") : document.getElementById("yellowsBlockerPiecesDiv"),
        //otherPlayersBlockerPiecesDiv = turn === 'Red' ? document.getElementById("yellowsBlockerPiecesDiv") : document.getElementById("redsBlockerPiecesDiv"),
        currentPlayersBlockerPieces = turn === 'Red' ? document.getElementById("redsBlockerPiecesDiv").children : document.getElementById("yellowsBlockerPiecesDiv").children,
        otherPlayersBlockerPieces = turn === 'Red' ? document.getElementById("yellowsBlockerPiecesDiv").children : document.getElementById("redsBlockerPiecesDiv").children,
        currentPlayersGamePiece = turn === 'Red' ? document.getElementById("redPiece") : document.getElementById("yellowPiece"),
        otherPlayersGamePiece = turn === 'Red' ? document.getElementById("yellowPiece") : document.getElementById("redPiece");
    
    currentPlayersGamePiece.setAttribute("draggable", "false");
    currentPlayerDiv.style.backgroundColor = "#808080";
    currentPlayerDiv.style.opacity = "0.40";
    
    if(gameMode == 0 || (gameMode == 1 && turn == 'Yellow')){
        otherPlayersGamePiece.setAttribute("draggable", "true");
        otherPlayerDiv.style.backgroundColor = "#FFFFFF";
        otherPlayerDiv.style.opacity = "1.00";
    }
    
    for(var i = 0; i < currentPlayersBlockerPieces.length; i++) {
        currentPlayersBlockerPieces[i].setAttribute("draggable", "false");
    }
    for(var i = 0; i < otherPlayersBlockerPieces.length; i++) {
        otherPlayersBlockerPieces[i].setAttribute("draggable", "true");
    }
    
    if(gameMode != 2 && !(gameMode == 1 && turn === 'Red')){
        document.getElementById("collectBlockerPieceButton").disabled = false;
    } 
    
    turn = turn === 'Red' ? 'Yellow' : 'Red';
    
    if(otherPlayersBlockerPieces.length > 4){
       document.getElementById("collectBlockerPieceButton").disabled = true; 
    }
    
    if(gameMode == 1 && turn == 'Yellow' && !gameIsOver) {
        playerVSai();
    }
}

function collectBlockerPiece() {
    var elem = document.createElement("img"),
        currentPlayersBlockerPiecesDiv = turn === 'Red' ? document.getElementById("redsBlockerPiecesDiv") : document.getElementById("yellowsBlockerPiecesDiv"),
        blockerPieceButton = document.getElementById("collectBlockerPieceButton");
        
    blockerPieceButton.disabled = true;
        
    elem.setAttribute("src", "blackPiece.jpg");
    elem.setAttribute("draggable", "true");
    elem.setAttribute("height", "42");
    elem.setAttribute("width", "42");
    elem.setAttribute("alt", "blackPiece");
    
    currentPlayersBlockerPiecesDiv.appendChild(elem);
    currentPlayersBlockerPiecesDiv.appendChild(document.createElement("br"));
    
    changePlayers();
}

function getImmediateDevensiveMoves(piecesUsed) {
    var immediateMoves = [],
        opponentPieceType = turn === 'Red' ? 'Yellow' : 'Red';
    
    for(var column = 0; column < 8; column += 1){
        var row = findRow(column) - (piecesUsed - 1);
        
        //if(piecesUsed > 1){
        //    alert("(" + column + ", " + row + ")");
        //}
        
        if((inChcek(row, column, 0, 1, opponentPieceType) || inChcek(row, column, 1, 0, opponentPieceType) ||
           inChcek(row, column, 1, 1, opponentPieceType) || inChcek(row, column, 1, -1, opponentPieceType))) {
            immediateMoves.push(column);
        }
    }
    //alert("Possible Immediate Defensive moves: " + immediateMoves.toString());
    return immediateMoves;
}

function getImmediateOffensiveMoves(piecesUsed) {
    var immediateMoves = [],
        playersPieceType = turn;
    
    for(var column = 0; column < 8; column += 1){
        var row = findRow(column) - (piecesUsed - 1);
        
        if(inChcek(row, column, 0, 1, playersPieceType) || inChcek(row, column, 1, 0, playersPieceType) ||
           inChcek(row, column, 1, 1, playersPieceType) || inChcek(row, column, 1, - 1, playersPieceType)) {
            immediateMoves.push(column);
        }
    }
    //alert("Possible Immediate Offensive moves: " + immediateMoves.toString());
    return immediateMoves;
    
    
}

function inChcek(row, column, rowIncrement, columnIncrement, pieceType) {
    var firstRow = row + rowIncrement,
        secondRow = row - rowIncrement,
        firstColumn = column + columnIncrement,
        secondColumn = column - columnIncrement,
        isFirstRowValid = firstRow >= 0 && firstRow <= 6,
        isSecondRowValid = secondRow >= 0 && secondRow <= 6,
        isFirstColumnValid = firstColumn >= 0 && firstColumn <= 7,
        isSecondColumnValid = secondColumn >= 0 && secondColumn <= 7,
        firstDirectionIsPieceType = false,
        secondDirectionIsPieceType = false;
    
    if(isFirstRowValid && isFirstColumnValid){
        firstDirectionIsPieceType = document.getElementById("cell" + firstRow + firstColumn).pieceType == pieceType;
    }
    if(isSecondRowValid && isSecondColumnValid) {
        secondDirectionIsPieceType = document.getElementById("cell" + secondRow + secondColumn).pieceType == pieceType;
    }
    
    if(firstDirectionIsPieceType && checkConnectedPieces(firstRow, firstColumn, rowIncrement, columnIncrement) >= 2){
        return true;
    } else if(secondDirectionIsPieceType && checkConnectedPieces(secondRow, secondColumn, - rowIncrement, - columnIncrement) >= 2){
        return true;
    } else if(secondDirectionIsPieceType && firstDirectionIsPieceType && (checkConnectedPieces(firstRow, firstColumn, rowIncrement, columnIncrement) >= 1 || checkConnectedPieces(secondRow, secondColumn, - rowIncrement, - columnIncrement) >= 1)){
        return true;
    } else {
        return false;
    } 
}

window.onload = function() {
    for (i = 0; i < 7; i += 1) {
        for (j = 0; j < 8; j += 1) {
            cell = document.getElementById("cell" + i + j);
            cell.i = i;
            cell.j = j;
            cell.piecePlaced = false;
            cell.pieceType = EMPTY;
            cell.ondrop = set;
            squares.push(cell);
        }
    }
    startNewGame();
}
