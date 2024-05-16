package com.videogioco.service;
import com.videogioco.model.Videogioco;
import org.springframework.stereotype.Service;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import java.util.ArrayList;
import java.util.List;

@Service
public class CatalogoService {
    private static final Logger logger = LogManager.getLogger(CatalogoService.class);
    private List<Videogioco>catalogo;
    public List<Videogioco>creaCatalogo(){
        catalogo= new ArrayList<>();
        aggiungiVideogioco("The Last Of Us: Parte I", 50, 8);
        aggiungiVideogioco("Super Mario Wonder", 37, 10);
        aggiungiVideogioco("Marvel's Spider 2", 62, 9);
        aggiungiVideogioco("Call Of Duty: Modern Warfare III", 78, 11);
        aggiungiVideogioco("Watch Dogs Legion", 45, 7);
        aggiungiVideogioco("The Last Of Us: Parte II", 55, 20);
        aggiungiVideogioco("Grand Theft Auto V", 40, 6);
        aggiungiVideogioco("Minecraft", 59, 4);
        return catalogo;
    }
    public void aggiungiVideogioco(String nomeG, int prezzoG, int quantitaG){
        Videogioco videogioco= new Videogioco(nomeG, prezzoG, quantitaG);
        logger.info("Sto aggiungendo il gioco " + nomeG + " che costa " + prezzoG + "€ e ho " + quantitaG + " copie");
        catalogo.add(videogioco);
        logger.info("Gioco Aggiunto!");
    }
    public void stampaCatalogo(){
        logger.info("Ecco il catalogo dei nostri videogiochi-->");
        for (Videogioco videogioco : catalogo) {
            logger.info("/* " + videogioco.getNomeG() + " | " + videogioco.getPrezzoG() + "€" + " | " + videogioco.getQuantitaG() + " copie" + " */");
        }
    }
    public void aggiungiVideogiocoAlCatalogo (Videogioco videogioco) {
        catalogo.add(videogioco);
        logger.info("Ho aggiunto il videogioco!");
    }
    public void rifornisciVideogioco (String nomeVideogioco, int numeroCopie) {
        for (Videogioco videogioco : catalogo) {
            if (videogioco.getNomeG().equals(nomeVideogioco)) {
                videogioco.aggiungiCopieVideogioco(numeroCopie);
            }
        }
    }
    public Videogioco cercaVideogioco (String nomeVideogioco) {
        System.out.println();
        logger.info("Ricerca videogioco...");
        for (Videogioco videogioco : catalogo) {
            if (videogioco.getNomeG().equals(nomeVideogioco)) {
                System.out.println();
                logger.info("Videogioco trovato");
                return videogioco;
            }
        }
        return null;
    }
    public int getPrezzoVideogioco (String nomeVideogioco) {
        int prezzoG=-1;
        System.out.println();
        logger.info("Ricerca prezzo videogioco...");
        Videogioco videogioco= cercaVideogioco(nomeVideogioco);
        if (videogioco!=null) {
            prezzoG = videogioco.getPrezzoG();
            System.out.println();
            logger.info("Il prezzo e' di: " + prezzoG);
        }
        return prezzoG;
    }

    public void sovrascriviPrezzo (String nomeVideogioco, int nuovoPrezzo) {
        System.out.println();
        logger.info("Modifica prezzo videogioco... ");
        Videogioco videogioco= cercaVideogioco(nomeVideogioco);
        if (videogioco!=null) {
            videogioco.setPrezzoG(nuovoPrezzo);
        }
        else {
            logger.info("Videogioco non trovato");
        }
    }

    public void vendiVideogioco (String nomeVideogioco, int numeroCopie) {
        System.out.println();
        logger.info("Vendita videogioco in corso... ");
        Videogioco videogioco= cercaVideogioco(nomeVideogioco);
        if (videogioco!=null) {
            if (videogioco.getQuantitaG() >= numeroCopie) {
                videogioco.vendiCopie(numeroCopie);
            }
            else {
                logger.info("Mi dispiace, ne ho solo " + videogioco.getQuantitaG() +
                                   " copie, non posso venderne " + numeroCopie);
            }
        }
        else {
            logger.info("Gioco non trovato");
        }
    }
}