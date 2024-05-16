// Questa è la tua lista mockata di videogiochi
var games = [];

function getGamesData() {
    // Popola la tabella con i dati dei videogiochi
    populateTable(games);
}

function populateTable(games) {
    var table = document.getElementById('gamesTable');

    var intestazione = table.insertRow(0); // crea la riga e anche dopo le celle

    var int0 = intestazione.insertCell(0);
    var int1 = intestazione.insertCell(1);
    var int2 = intestazione.insertCell(2);
    var int3 = intestazione.insertCell(3);

    int0.innerHTML = '<th>Seleziona</th>';
    int1.innerHTML = '<th>Nome</th>';
    int2.innerHTML = '<th>Prezzo</th>';
    int3.innerHTML = '<th>Quantità</th>';

    fetch('http://localhost:8080/negozio-remoto/getCatalogoRemoto')
        .then(response => response.json())
        .then(data => {
            data.forEach(function(game, index) {
                var row = table.insertRow(-1);
                row.id = 'gameRow_' + index;
                
                var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(1);
                var cell2 = row.insertCell(2);
                var cell3 = row.insertCell(3);
                
                var nuovoID = games.length;
                cell0.innerHTML = '<input type="checkbox" name="gameSelect" data-game-id="' + nuovoID + '">';
                cell1.innerHTML = game.nomeG;
                cell2.innerHTML = game.prezzoG;
                cell3.innerHTML = game.quantitaG;
                games.push({id: nuovoID, nome: game.nomeG, prezzo: parseInt(game.prezzoG), quantita: parseInt(game.quantitaG)});
            });
                
        }).catch(error => console.error('Error:', error));
}


function toggleTable() {
    var puff = document.getElementById("puff");
    
    if (puff.style.visibility === "hidden") {
        puff.style.visibility = "visible";
    }
    else {
        puff.style.visibility = "hidden";
    }
}




function vendiCopie() {
    $('#modaleVenditaVideogioco').modal('show');
}
function confermaVendiCopieVideogioco() {
    var selectedGamesIds = [];
    $("input[name='gameSelect']:checked").each(function() {
        selectedGamesIds.push(parseInt($(this).data('game-id')));
    });

    if (selectedGamesIds.length === 0) {
        console.log("Nessun videogioco selezionato.");
        return;
    }

    selectedGamesIds.forEach(function(gameId) {
        var gameIndex = games.findIndex(function(game) {
            return game.id === gameId;
        });

        if (gameIndex !== -1) {
            var quantitaDaVendere = prompt("Inserisci la quantità da vendere per il videogioco '" + games[gameIndex].nome + "':");
            quantitaDaVendere = parseInt(quantitaDaVendere);

            if (isNaN(quantitaDaVendere) || quantitaDaVendere <= 0 || quantitaDaVendere > games[gameIndex].quantita) {
                alert("Quantità non valida per il videogioco '" + games[gameIndex].nome + "'.");
                return;
            }
            
            fetch('http://localhost:8080/negozio-remoto/vendiCopieRemoto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'nomeVideogioco=' + encodeURIComponent(games[gameIndex].nome) + '&numeroCopie=' + encodeURIComponent(quantitaDaVendere)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore durante la vendita delle copie del videogioco');
                }
                alert("Hai venduto " + quantitaDaVendere + " copie del videogioco '" + games[gameIndex].nome + "'.");
                // Gestisci la risposta dal backend, se necessario
                // Effettua il refresh del catalogo o esegui altre azioni necessarie
                refreshCatalogo();
            })
            .catch(error => {
                console.error('Errore:', error);
                alert('Si è verificato un errore durante la vendita delle copie del videogioco');
            });
            
        }
    });

    refreshCatalogo();
}

// Quando l'utente cambia il valore di un campo del form, controlla se tutti i campi sono valorizzati
$('form input').on('change', function() {
    var nome = document.getElementById('nome').value;
    var prezzo = document.getElementById('prezzo').value;
    var quantita = document.getElementById('quantita').value;
  
    // Se tutti i campi sono valorizzati, abilita il pulsante di conferma
    if (nome && prezzo > 0 && quantita > 0) {
      document.getElementById('confermaInserimento').disabled = false;
    }
    else {
      document.getElementById('confermaInserimento').disabled = true;
    }
});

function chiudiModaleVendita() {
    $('#modaleVenditaVideogioco').modal('hide');
}
function chiudiModaleDettaglioVideogioco() {
    $('#dv').modal('hide');
}

function dettaglio() {
    var immagine_dettaglio = document.getElementById("immagine_dettaglio");
    var selectedGamesIds = [];

    $("input[name='gameSelect']:checked").each(function() {
        selectedGamesIds.push($(this).data('game-id')); 
    });

    if(selectedGamesIds.length === 1){
        var gameIndex = games.findIndex(function(game) {
            return game.id === selectedGamesIds[0];
        });
        $(document).ready(function() {
            // Effettua una richiesta al servizio backend per ottenere i dati
            $.ajax({
                url: 'http://10.110.12.125:8080/negozio/findDettaglioVideogioco?nome=' + encodeURIComponent(games[gameIndex].nome),
                method: 'GET',
                success: function(data) {
                    var urlImmagine ="immagini_sfondo/" + data.nomeImmagine +"."+data.estensioneImmagine;
                    console.log(urlImmagine);
                    immagine_dettaglio.src=urlImmagine;

                    // Aggiorna dinamicamente i campi con i dati ricevuti dal backend
                    $('#nome_videogioco').text(data.nome);
                    $('#immagine_dettaglio').attr('src', urlImmagine);
                    $('#descrizione_videogioco').text(data.descrizione);
                },
                error: function(xhr, status, error) {
                    console.error('Errore durante la richiesta al findDettaglio:', error);
                    $('#nome_videogioco').text('errore...');
                    $('#immagine_dettaglio').attr('src', 'immagini_sfondo/' + data.nomeImmagine +'.'+data.estensioneImmagine);
                    $('#descrizione_videogioco').text('Gioco non trovato!');
                }
            });
        });
    }
    $('#dv').modal('show');
}

$("input[name='gameSelect']").change(function() {
    $('#eliminaVideogioco').prop('disabled', false);
    console.log("Gioco selezionato");
});

function refreshCatalogo() {
    $('#gamesTable tbody').empty();
    populateTable(games);
    console.log("Refreshato");
}

window.onload = getGamesData;