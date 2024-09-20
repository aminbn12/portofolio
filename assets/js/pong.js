// Sélection du canvas
const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

// Chargement des sons
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "assets/sounds/hit.mp3";
wall.src = "assets/sounds/wall.mp3";
comScore.src = "assets/sounds/comScore.mp3";
userScore.src = "assets/sounds/userScore.mp3";

// Objet Ball
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// Raquette du joueur
const user = {
    x : 0,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "#0d6efd"  // Couleur bleue de votre projet
}

// Raquette de l'ordinateur
const com = {
    x : canvas.width - 10,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "#0d6efd"  // Couleur bleue de votre projet
}

// Filet
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// Dessiner un rectangle (pour les raquettes)
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Dessiner un cercle (pour la balle)
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// Suivre la position de la souris pour déplacer la raquette
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

// Réinitialiser la balle après un point marqué
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// Dessiner le filet
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Dessiner le texte (scores)
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Détection des collisions
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Mise à jour de la logique du jeu
function update(){
    if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        resetBall();
    } else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }
    
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    if(collision(ball,player)){
        hit.play();
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
    }
}

// Fonction de rendu graphique
function render(){
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(user.score,canvas.width/4,canvas.height/5);
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

// Fonction de redimensionnement du canvas pour qu'il soit responsive
function resizeCanvas() {
    const aspectRatio = 600 / 400;  // Ratio d'aspect du jeu
    let canvasWidth = Math.min(window.innerWidth, 600);  // Maximum 600px de large
    let canvasHeight = canvasWidth / aspectRatio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    updateElementsSize(); // Mettre à jour les éléments du jeu après redimensionnement
}

// Ajuster la taille des éléments après redimensionnement
function updateElementsSize() {
    user.height = canvas.height * 0.25;  // Ajuster la taille des raquettes
    com.height = canvas.height * 0.25;
    ball.radius = canvas.width * 0.02;  // Ajuster la taille de la balle
}

// Variable pour vérifier si le jeu a commencé
let gameStarted = false;

// Démarrer le jeu quand la souris entre dans le canvas
canvas.addEventListener('mouseenter', function() {
    if (!gameStarted) {
        gameStarted = true;
        loop = setInterval(game, 1000 / 50);  // Lancer la boucle de jeu
    }
});

// Redimensionner le canvas lorsqu'on redimensionne la fenêtre
window.addEventListener('resize', resizeCanvas);

// Initialiser les dimensions au chargement de la page
resizeCanvas();
updateElementsSize();  // Initialiser les éléments à la bonne taille

// Fonction principale du jeu
function game(){
    update();
    render();
}
