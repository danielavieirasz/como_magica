// --- VARIÁVEIS DOS PERSONAGENS ---
let posIvy, posOllie; 
let tam = 40;
let velocidade = 4;

// Estado do Jogo: Controla quem a mente do jogador está guiando (true = Ivy, false = Ollie)
let controlaIvy = true; 

// --- VARIÁVEIS DO CENÁRIO ---
let nuvens = [];
let efeitoTroca = 0; // Intensidade/Opacidade do efeito de transição

function setup() {
  createCanvas(800, 500);
  
  // Inicialização das coordenadas cartesianas (Vetores)
  posIvy = createVector(200, height - 70);
  posOllie = createVector(600, height - 70);
  
  // Geração procedural de nuvens
  for (let i = 0; i < 4; i++) {
    nuvens.push({
      x: random(width),
      y: random(50, 150),
      vel: random(0.5, 1.5),
      tam: random(40, 70)
    });
  }
}

function draw() {
  desenharCeu();
  desenharMontanhas();
  atualizarEDesenharNuvens();
  
  // --- FLUXO DE CONTROLE (MÁGICA DE TROCA) ---
  if (controlaIvy) {
    moverPersonagem(posIvy);
  } else {
    moverPersonagem(posOllie);
  }
  
  // --- RENDERIZAÇÃO DOS ELEMENTOSATIVOS ---
  desenharIvy();
  desenharOllie();
  
  // --- ANIMAÇÃO DO FEIXE DE ENERGIA ---
  if (efeitoTroca > 0) {
    desenharEfeitoTroca();
    efeitoTroca -= 5; // Efeito fade-out automático
  }
  
  // --- INTERFACE DO USUÁRIO (UI) ---
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  text("Pressione [ BARRA DE ESPAÇO ] para trocar de corpo", width / 2, 30);
}

// --- FUNÇÃO DE MOVIMENTAÇÃO GENÉRICA ---
function moverPersonagem(pos) {
  if (keyIsDown(LEFT_ARROW))  pos.x -= velocidade;
  if (keyIsDown(RIGHT_ARROW)) pos.x += velocidade;
  
  // Restrição de tela (Clamping)
  pos.x = constrain(pos.x, tam, width - tam);
}

// --- ESCUTA DE EVENTOS DO TECLADO ---
function keyPressed() {
  if (key === ' ') {
    controlaIvy = !controlaIvy; // Inversão do estado booleano
    efeitoTroca = 255;          // Inicializa o efeito visual com opacidade máxima
  }
}

// --- FUNÇÕES DE DESENHO DO CENÁRIO ---
function desenharCeu() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color('#2c3e50'), color('#fd746c'), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function desenharMontanhas() {
  noStroke();
  
  // Camada de Fundo (Paralaxe Traseiro)
  fill('#3b2f4a');
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = map(noise(x * 0.005), 0, 1, height - 200, height - 50);
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Camada de Frente (Chão / Primeiro Plano)
  fill('#23192e');
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = map(noise(x * 0.008 + 100), 0, 1, height - 120, height - 30);
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
}

function atualizarEDesenharNuvens() {
  fill(255, 255, 255, 120);
  noStroke();
  for (let n of nuvens) {
    n.x += n.vel;
    if (n.x - n.tam > width) {
      n.x = -n.tam; // Efeito de loop infinito (Screen wrapping)
      n.y = random(50, 150);
    }
    ellipse(n.x, n.y, n.tam, n.tam * 0.6);
    ellipse(n.x + n.tam*0.3, n.y - n.tam*0.1, n.tam*0.8, n.tam*0.6);
    ellipse(n.x - n.tam*0.3, n.y - n.tam*0.1, n.tam*0.7, n.tam*0.5);
  }
}

// --- FUNÇÕES DE DESENHO DOS PERSONAGENS ---
function desenharIvy() {
  push();
  translate(posIvy.x, posIvy.y);
  if (controlaIvy) desenharAuraControle();
  
  fill('#00d2ff');
  stroke(255);
  strokeWeight(2);
  beginShape();
  vertex(0, -tam);
  vertex(tam/2, 0);
  vertex(0, tam);
  vertex(-tam/2, 0);
  endShape(CLOSE);
  pop();
}

function desenharOllie() {
  push();
  translate(posOllie.x, posOllie.y);
  if (!controlaIvy) desenharAuraControle();
  
  fill('#ff007f');
  stroke(255);
  strokeWeight(2);
  ellipse(0, 0, tam * 1.5, tam * 1.5);
  pop();
}

function desenharAuraControle() {
  noStroke();
  for (let i = 3; i > 0; i--) {
    fill(255, 255, 150, 40 / i);
    ellipse(0, 0, tam * 2 * (i * 0.5 + 0.5) + sin(frameCount * 0.1) * 10);
  }
}

// --- ANIMAÇÃO DE CONEXÃO QUANTICA / MAGIA ---
function desenharEfeitoTroca() {
  stroke(255, 255, 200, efeitoTroca);
  strokeWeight(map(efeitoTroca, 0, 255, 1, 15));
  line(posIvy.x, posIvy.y, posOllie.x, posOllie.y);
  
  noFill();
  stroke(255, efeitoTroca);
  ellipse(posIvy.x, posIvy.y, 80);
  ellipse(posOllie.x, posOllie.y, 80);
}