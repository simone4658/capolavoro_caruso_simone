package com.videogioco.controller;
import com.videogioco.model.DettaglioVideogioco;
import com.videogioco.model.Videogioco;
import com.videogioco.service.DatabaseService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Random;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/negozio")
@CrossOrigin(origins = "*")
public class NegozioController {

    @Autowired
    private DatabaseService databaseService;
    private static final Logger logger = LogManager.getLogger(NegozioController.class);

    @GetMapping("/getCatalogo")
    public List<Videogioco> getCatalogo() {
        logger.info("chiamato servizio getCatalogo");
        List<Videogioco> catalogo = databaseService.findAll();
        return catalogo;
    }

    @PostMapping("/addVideogioco")
    public ResponseEntity<Void> addVideogioco(@RequestBody Videogioco videogioco) {
        logger.info("chiamato servizio addVideogioco");
        databaseService.addVideogioco(videogioco);
        return ResponseEntity.created(null).build();
    }

    @GetMapping("/findVideogioco")
    public Videogioco findVideogioco(@RequestParam String nome){
        logger.info("chiamato servizio findVideogioco");
        Videogioco videogioco = databaseService.findVideogioco(nome);
        return videogioco;
    }

    @PostMapping("/updateVideogioco")
    public Videogioco updateVideogioco(@RequestBody Videogioco videogioco){
        logger.info("chiamato servizio updateVideogioco");
        databaseService.updateVideogioco(videogioco);
        return videogioco;
    }

    @PostMapping("/deleteVideogioco")
    public ResponseEntity<Void> deleteVideogioco(@RequestParam String nomeV){
        logger.info("chiamato servizio deleteVideogioco");
        databaseService.deleteVideogioco(nomeV);
        return ResponseEntity.created(null).build();
    }

    @PostMapping("/aggiungiCopie")
    public Videogioco aggiungiCopie(@RequestParam String nomeVideogioco, @RequestParam String numeroCopie){
        logger.info("chiamato servizio aggiungiCopie");
        Videogioco videogioco = databaseService.findVideogioco(nomeVideogioco);
        int nuovaQuantita = videogioco.getQuantitaG() + Integer.parseInt(numeroCopie);
        videogioco.setQuantitaG(nuovaQuantita);
        databaseService.updateVideogioco(videogioco);
        return videogioco;
    }

    @PostMapping("/vendiCopie")
    public Videogioco vendiCopie(@RequestParam String nomeVideogioco, @RequestParam String numeroCopie){
        logger.info("chiamato servizio vendiCopie");
        Videogioco videogioco = databaseService.findVideogioco(nomeVideogioco);
        int numeroCopieInt = Integer.parseInt(numeroCopie);
        if (videogioco.getQuantitaG()>=numeroCopieInt) {
            int nuovaQuantita2 = videogioco.getQuantitaG() - numeroCopieInt;
            videogioco.setQuantitaG(nuovaQuantita2);
            databaseService.updateVideogioco(videogioco);
        }
        return videogioco;
    }

    @GetMapping("/findDettaglioVideogioco")
    public DettaglioVideogioco findDettaglioVideogioco(@RequestParam String nome){
        logger.info("chiamato servizio findDettaglioVideogioco");
        DettaglioVideogioco dettaglioVideogioco = databaseService.findDettaglioVideogioco(nome);
        return dettaglioVideogioco;
    }

    /* Funzione ausiliaria per generare nomi casuali
    private String generaNomeCasuale(int lunghezza) {
        StringBuilder nomeCasuale = new StringBuilder();
        String caratteri = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        Random random = new Random();
        for (int i = 0; i < lunghezza; i++) {
            nomeCasuale.append(caratteri.charAt(random.nextInt(caratteri.length())));
        }
        return nomeCasuale.toString();
    }

    @GetMapping("/addVideogiocoCasuale")
    public ResponseEntity<Videogioco> addVideogiocoCasuale() {
        logger.info("Chiamato servizio addVideogiocoCasuale");

        // Genera un nome casuale per il videogioco
        String nomeCasuale = generaNomeCasuale(10); // Esempio: generiamo un nome di 10 caratteri

        // Genera un prezzo casuale (tra 1 e 60)
        int prezzoCasuale = new Random().nextInt(60) + 1;

        // Genera una quantità casuale (tra 1 e 100)
        int quantitaCasuale = new Random().nextInt(100) + 1;

        // Crea un nuovo videogioco con i valori generati casualmente
        Videogioco videogiocoCasuale = new Videogioco(nomeCasuale, prezzoCasuale, quantitaCasuale);

        // Restituisci il videogioco generato come risposta
        return ResponseEntity.ok(videogiocoCasuale);
    }*/

    @GetMapping("/addVideogiocoCasuale")
    public Videogioco addVideogiocoCasuale() {
        logger.info("chiamato servizio addVideogiocoCasuale");
        Videogioco videogioco = new Videogioco();

        Random random = new Random();
        // Genera un nome casuale scegliendolo da un array
        String[] nomi = {"GTA V", "FIFA 23", "Call of Duty", "Assassin's Creed", "The Last of Us"};
        String nomeCasuale = nomi[random.nextInt(nomi.length)];
        videogioco.setNomeG(nomeCasuale);

        // Genera un prezzo casuale
        int prezzoCasuale = random.nextInt(90) + 1;
        videogioco.setPrezzoG(prezzoCasuale);

        // Genera una quantità casuale
        int quantitaCasuale = random.nextInt(100) + 1;
        videogioco.setQuantitaG(quantitaCasuale);

        return videogioco;
    }

}
