package com.videogioco.controller;
import com.videogioco.model.DettaglioVideogioco;
import com.videogioco.model.Videogioco;
import com.videogioco.model.VideogiocoRemoto;
import com.videogioco.service.NegozioRemotoService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/negozio-remoto")
@CrossOrigin(origins = "*")
public class NegozioRemotoController {
    @Autowired
    private NegozioRemotoService negozioRemotoService;
    private static final Logger logger = LogManager.getLogger(NegozioController.class);

    @GetMapping("/getCatalogoRemoto")
    public List<Videogioco> getCatalogoRemoto() {
        logger.info("chiamato servizio getCatalogoRemoto");
        List<Videogioco> catalogo = negozioRemotoService.getCatalogoRemoto();
        return catalogo;
    }

    @PostMapping("/vendiCopieRemoto")
    public Videogioco vendiCopieRemoto(@RequestParam String nomeVideogioco, @RequestParam String numeroCopie){
        logger.info("chiamato servizio vendiCopie");
        Videogioco videogioco = negozioRemotoService.findVideogiocoRemoto(nomeVideogioco);
        int numeroCopieInt = Integer.parseInt(numeroCopie);
        if (videogioco.getQuantitaG()>=numeroCopieInt) {
            int nuovaQuantita2 = videogioco.getQuantitaG() - numeroCopieInt;
            videogioco.setQuantitaG(nuovaQuantita2);
            negozioRemotoService.updateVideogiocoRemoto(videogioco);
        }
        return videogioco;
    }

    @PostMapping("/findDettaglioVideogiocoRemoto")
    public DettaglioVideogioco findDettaglioVideogiocoRemoto(String nome) {
        logger.info("chiamato servizio findDettaglioVideogiocoRemoto");
        DettaglioVideogioco dettaglioVideogioco = negozioRemotoService.findDettaglioVideogiocoRemoto(nome);
        return dettaglioVideogioco;
    }
}
