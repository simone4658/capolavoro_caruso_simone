// Questa è la tua lista mockata di videogiochi
var games = [];

var giocoCasuale = null;

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

    fetch('http://localhost:8080/negozio/getCatalogo')
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


function aggiungiVideogioco() {
    $('#modaleInserisciVideogioco').modal('show');
}
document.getElementById('newGameForm').onsubmit = function(e) {
    e.preventDefault();
    
    // Ottieni i dati del nuovo videogioco dal form
    var nome = document.getElementById('nome').value;
    var prezzo = document.getElementById('prezzo').value;
    var quantita = document.getElementById('quantita').value;
    
    /* Assegna un ID univoco al nuovo videogioco
    var nuovoID = games.length;*/

    var nuovoVideogioco = {
        nomeG: nome,
        prezzoG: parseInt(prezzo),
        quantitaG: parseInt(quantita)
    };

    // Effettua una richiesta POST al backend per inserire il nuovo videogioco
    fetch('http://localhost:8080/negozio/addVideogioco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuovoVideogioco)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore durante l\'inserimento del videogioco');
        }
    })
    .then(data => {
        // Effettua il refresh del catalogo o esegui altre azioni necessarie
        refreshCatalogo();
    })
    .catch(error => {
        console.error('Errore:', error);
        alert('Si è verificato un errore durante l\'inserimento del videogioco');
    });
    
    document.getElementById('nome').value = "";
    document.getElementById('prezzo').value = "";
    document.getElementById('quantita').value = "";
    chiudiModaleInserisci();
}

function eliminaVideogioco() {
    $('#modaleEliminaVideogioco').modal('show');
}
function confermaEliminazioneVideogioco() {
        var selectedGamesIds = [];
        $("input[name='gameSelect']:checked").each(function() {
            selectedGamesIds.push($(this).data('game-id')); 
        });
    
        if (selectedGamesIds.length === 0) {
            console.log("Nessun videogioco selezionato.");
            return;
        }
    
        selectedGamesIds.forEach(function(gameId) {
            fetch('http://localhost:8080/negozio/deleteVideogioco?nomeV=' + encodeURIComponent(games.find(game => game.id === gameId).nome), {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore durante l\'eliminazione del videogioco');
                }
                // Gestisci la risposta dal backend, se necessario
                // Effettua il refresh del catalogo o esegui altre azioni necessarie
                refreshCatalogo();
            })
            .catch(error => {
                console.error('Errore:', error);
                alert('Si è verificato un errore durante l\'eliminazione del videogioco');
            });
        });
    
        console.log("Hai eliminato " + selectedGamesIds.length + " videogioco/i.");
        games = games.filter(function(game) {
            return !selectedGamesIds.includes(game.id);
        });
        refreshCatalogo();
        chiudiModaleElimina();
}

function aggiungiCopie() {
    $('#modaleAggiuntaVideogioco').modal('show');
}
function confermaAggiungiCopieVideogioco() {
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
            var quantitaDaAggiungere = prompt("Inserisci la quantità da aggiungere per il videogioco '" + games[gameIndex].nome + "':");
            quantitaDaAggiungere = parseInt(quantitaDaAggiungere);
    
            if (isNaN(quantitaDaAggiungere) || quantitaDaAggiungere <= 0) {
                console.log("Quantità non valida per il videogioco '" + games[gameIndex].nome + "'.");
                return;
            }

            // Effettua una richiesta POST al backend per aggiungere le copie del videogioco
            fetch('http://localhost:8080/negozio/aggiungiCopie?nomeVideogioco=' + encodeURIComponent(games[gameIndex].nome) + '&numeroCopie=' + encodeURIComponent(quantitaDaAggiungere), {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore durante l\'aggiunta delle copie del videogioco');
                }
                console.log("Hai aggiunto " + quantitaDaAggiungere + " copie del videogioco '" + games[gameIndex].nome + "'.");
                // Gestisci la risposta dal backend, se necessario
                // Puoi fare qualcosa qui se vuoi gestire la risposta dal backend
                refreshCatalogo();
            })
            .catch(error => {
                console.error('Errore:', error);
                alert('Si è verificato un errore durante l\'aggiunta delle copie del videogioco');
            });

        }
    });
    refreshCatalogo();
    chiudiModaleAggiunta();
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
            
            fetch('http://localhost:8080/negozio/vendiCopie', {
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
    chiudiModaleVendita();
}

function modificaPrezzo() {
    $('#modaleModificaPrezzo').modal('show');
}
function confermaModificaPrezzoVideogioco() {
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
            var prezzoDaModificare = prompt("Inserisci il nuovo prezzo per il videogioco '" + games[gameIndex].nome + "':");
            prezzoDaModificare = parseInt(prezzoDaModificare);

            if (isNaN(prezzoDaModificare) || prezzoDaModificare <= 0) {
                alert("Prezzo non valido per il videogioco '" + games[gameIndex].nome + "'.");
                return;
            }
            if (isNaN(prezzoDaModificare) || prezzoDaModificare <= 0) {
                alert("Il prezzo deve essere un numero positivo.");
                return;
            }
            // Chiamo il servizio "/negozio/findVideogioco" del BE per recuperare il videogioco da modificare (passando il nome)
            var giocoG = null;
            fetch('http://localhost:8080/negozio/findVideogioco?nome=' + encodeURIComponent(games[gameIndex].nome))
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore durante la ricerca del videogioco');
                    }
                    return response.json();
                })
                .then(data => {
                    // Utilizza i dati del videogioco trovato
                    console.log(data);
                    giocoG=data;
                    fetch('http://localhost:8080/negozio/updateVideogioco', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nomeG: giocoG.nomeG,
                            prezzoG: prezzoDaModificare,
                            quantitaG: giocoG.quantitaG
                        })
                    })
                    refreshCatalogo();
                    chiudiModaleModificaPrezzo();
                })
                .catch(error => {
                    console.error('Errore:', error);
                    alert('Si è verificato un errore durante la ricerca del videogioco');
                });
            games[gameIndex].prezzo = prezzoDaModificare;
            alert("Ecco il nuovo prezzo: " + prezzoDaModificare + " del videogioco '" + games[gameIndex].nome + "'.");
        }
    });
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
        
        // Effettua una richiesta al servizio backend per ottenere i dati
        $.ajax({
            url: 'http://localhost:8080/negozio/findDettaglioVideogioco?nome=' + encodeURIComponent(games[gameIndex].nome),
            method: 'GET',
            success: function(data) {
                var urlImmagine ="immagini_sfondo/" + data.nomeImmagine +"."+data.estensioneImmagine;
                immagine_dettaglio.src=urlImmagine;
                
                // Aggiorna dinamicamente i campi con i dati ricevuti dal backend
                $('#nome_videogioco').text(data.nome);
                $('#immagine_dettaglio').attr('src', urlImmagine);
                $('#descrizione_videogioco').text(data.descrizione);

                console.log(data);
            },
            error: function(xhr, status, error) {
                console.error('Errore durante la richiesta al findDettaglio:', error);
                $('#nome_videogioco').text('errore...');
                $('#immagine_dettaglio').attr('src', 'immagini_sfondo/error.png');
                $('#descrizione_videogioco').text('Gioco non trovato!');
            }
        });
    }
    $('#dv').modal('show');
}

function aggiungiVideogiocoCasuale() {
    $('#modaleInserisciVideogiocoCasuale').modal('show');
}
document.getElementById('newGameFormCasual').onsubmit = function(e) {
    e.preventDefault();

    // Effettua una richiesta POST al backend per inserire il nuovo videogioco
    fetch('http://localhost:8080/negozio/addVideogiocoCasuale', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore durante l\'inserimento del videogioco casuale');
        }
        else {
            return response.json(); // Converti la risposta in formato JSON
        }
    })
    .then(data => {
        // Assegna i valori restituiti ai campi del modulo
        document.getElementById('nomeCasuale').value = data.nomeG;
        document.getElementById('prezzoCasuale').value = data.prezzoG;
        document.getElementById('quantitaCasuale').value = data.quantitaG;
        refreshCatalogo();
    })
    .catch(error => {
        console.error('Errore:', error);
        alert('Si è verificato un errore durante l\'inserimento del videogioco casuale');
    });
}
function inserisciDatiCasuali() {
    // Simuliamo i dati generati casualmente
    var nuovoID = games.length+1;

    // Assegniamo i valori generati ai campi del modulo
    var nomeGiocoCasuale = document.getElementById('nomeCasuale').value;
    var prezzoGiocoCasuale = document.getElementById('prezzoCasuale').value;
    var quantitaGiocoCasuale = document.getElementById('quantitaCasuale').value;
    games.push({id: nuovoID, nome: nomeGiocoCasuale, prezzo: parseInt(prezzoGiocoCasuale), quantita: parseInt(quantitaGiocoCasuale)});

    var nuovoVideogioco = {
        nomeG: nomeGiocoCasuale,
        prezzoG: parseInt(prezzoGiocoCasuale),
        quantitaG: parseInt(quantitaGiocoCasuale)
    };

    fetch('http://localhost:8080/negozio/addVideogioco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuovoVideogioco)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore durante l\'inserimento del videogioco');
        }
    })
    .then(data => {
        // Effettua il refresh del catalogo o esegui altre azioni necessarie
        refreshCatalogo();
    })
    .catch(error => {
        console.error('Errore:', error);
        alert('Si è verificato un errore durante l\'inserimento del videogioco');
    });
}

function chiudiModaleInserisci() {
    $('#modaleInserisciVideogioco').modal('hide');
}
function chiudiModaleElimina() {
    $('#modaleEliminaVideogioco').modal('hide');
}
function chiudiModaleAggiunta() {
    $('#modaleAggiuntaVideogioco').modal('hide');
}
function chiudiModaleVendita() {
    $('#modaleVenditaVideogioco').modal('hide');
}
function chiudiModaleModificaPrezzo() {
    $('#modaleModificaPrezzo').modal('hide');
}
function chiudiModaleDettaglioVideogioco() {
    $('#dv').modal('hide');
}
function chiudiModaleInserisciCasuale() {
    $('#modaleInserisciVideogiocoCasuale').modal('hide');
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