var jogadores = [];
var sorteioEmAndamento = false;
var intervalo;

function gerarCartela() {
  var nome = prompt("Digite um nickname");
  
    if (!nome || nome.trim() === "") {
      alert("Você precisa digitar o nome do jogador!!!");
      return;
    }
  
    var regex = /^[A-Za-zÀ-ú]+$/;
    if (!regex.test(nome)) {
      alert("O nome do jogador deve conter apenas letras.");
      return;
    }
  
    var mesmoNickname = jogadores.find(function(jogador) {
      return jogador.nome === nome;
    });
  
    if (mesmoNickname) {
      alert("Já existe um jogador com o mesmo nickname.");
      return;
    }
  
    var cartela = [
      gerarNumerosAleatorios(5, 1, 15),
      gerarNumerosAleatorios(5, 16, 30),
      gerarNumerosAleatorios(5, 31, 45),
      gerarNumerosAleatorios(5, 46, 60),
      gerarNumerosAleatorios(5, 61, 75)
    ];
  
    jogadores.push({
      nome: nome,
      cartela: cartela
    });
  
    desenharCartela(nome, cartela);
  
    console.log(jogadores);

}

function desenharCartela(nome, cartela) {
  var div = document.getElementById("espacocartela");

  var jogadorDiv = document.createElement("div");
  jogadorDiv.classList.add("jogador");

  var nomeJogadorDiv = document.createElement("h3");
  nomeJogadorDiv.innerText = nome;
  jogadorDiv.appendChild(nomeJogadorDiv);

  var tabela = document.createElement("table");
  tabela.classList.add("cartela");

  var thead = document.createElement("thead");

  var thB = document.createElement("th");
  thB.innerText = "B";
  var thI = document.createElement("th");
  thI.innerText = "I";
  var thN = document.createElement("th");
  thN.innerText = "N";
  var thG = document.createElement("th");
  thG.innerText = "G";
  var thO = document.createElement("th");
  thO.innerText = "O";

  thead.appendChild(thB);
  thead.appendChild(thI);
  thead.appendChild(thN);
  thead.appendChild(thG);
  thead.appendChild(thO);

  for (var i = 0; i < 5; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < 5; j++) {
      var td = document.createElement("td");
      if (i === 2 && j === 2) {
        td.innerText = "X";
        tr.appendChild(td);
      } else {
        td.innerText = cartela[j][i];
        tr.appendChild(td);
      }
    }
    tabela.appendChild(tr);
  }

  tabela.appendChild(thead);
  jogadorDiv.appendChild(tabela);
  div.appendChild(jogadorDiv);
}

function reiniciarJogo() {
  var espacoCartela = document.getElementById("espacocartela");
  espacoCartela.innerHTML = "";

  jogadores = [];
  sorteioEmAndamento = false;
  clearInterval(intervalo);

  var numerosSorteadosDiv = document.getElementById("bolasorteadas");
  numerosSorteadosDiv.innerText = "";
}

function startGame() {
  if (jogadores.length === 0) {
    alert("Crie pelo menos uma cartela antes de iniciar o jogo.");
    return;
  }

  if (sorteioEmAndamento) {
    alert("O jogo já está em andamento.");
    return;
  }

  var numerosSorteadosDiv = document.getElementById("bolasorteadas");
  var numerosSorteados = [];
  var numerosRestantes = gerarNumerosAleatorios(75, 1, 75);

  sorteioEmAndamento = true;
  intervalo = setInterval(function () {
    if (numerosRestantes.length === 0) {
      clearInterval(intervalo);
      console.log("Jogo finalizado.");
      sorteioEmAndamento = false;
      return;
    }

    var numeroSorteado = numerosRestantes.shift();
    numerosSorteados.push(numeroSorteado);
    numerosSorteadosDiv.innerText = numerosSorteados.join(", ");

    for (var i = 0; i < jogadores.length; i++) {
      var jogador = jogadores[i];
      var cartela = jogador.cartela;

      if (verificarCartela(cartela, numerosSorteados)) {
        clearInterval(intervalo);
        sorteioEmAndamento = false;
        console.log("Jogador " + jogador.nome + " venceu!");
        return;
      }

      // Marcar número sorteado em todas as cartelas
      marcarNumeroSorteado(cartela, numeroSorteado);
    }
  }, 3000);
}

function marcarNumeroSorteado(cartela, numero) {
  var div = document.getElementById("espacocartela");
  var cartelaDivs = div.getElementsByClassName("cartela");

  for (var i = 0; i < cartelaDivs.length; i++) {
    var tds = cartelaDivs[i].getElementsByTagName("td");

    for (var j = 0; j < tds.length; j++) {
      if (tds[j].innerText === String(numero)) {
        tds[j].classList.add("numero-sorteado");
      }
    }
  }
}

function gerarNumerosAleatorios(quantidade, min, max) {
  var numeros = [];

  while (numeros.length < quantidade) {
    var numero = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!numeros.includes(numero)) {
      numeros.push(numero);
    }
  }

  return numeros;
}

function verificarCartela(cartela, numerosSorteados) {
  for (var row = 0; row < cartela.length; row++) {
    var linhaCompleta = true;

    for (var col = 0; col < cartela[row].length; col++) {
      if (!numerosSorteados.includes(cartela[row][col])) {
        linhaCompleta = false;
        break;
      }
    }

    if (linhaCompleta) {
      return true;
    }
  }

  return false;
}
