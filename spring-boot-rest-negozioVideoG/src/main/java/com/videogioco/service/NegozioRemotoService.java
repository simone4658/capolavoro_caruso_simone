package com.videogioco.service;
import com.videogioco.model.DettaglioVideogioco;
import com.videogioco.model.DettaglioVideogiocoRemoto;
import com.videogioco.model.Videogioco;
import com.videogioco.model.VideogiocoRemoto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class NegozioRemotoService {
    private static final Logger logger = LogManager.getLogger(NegozioRemotoService.class);
    private String host = "http://10.110.115.22:8080";



    private final RestTemplate restTemplate;

    @Autowired
    public NegozioRemotoService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public List<Videogioco> getCatalogoRemoto() {
        String url = host+"/negozio/getCatalogo";
        ResponseEntity<VideogiocoRemoto[]> responseEntity = restTemplate.getForEntity(url, VideogiocoRemoto[].class);
        VideogiocoRemoto[] catalogoArray = responseEntity.getBody();
        List<VideogiocoRemoto> catalogoRemoto = Arrays.asList(catalogoArray);
        List<Videogioco> catalogo= new ArrayList<>();
        for (VideogiocoRemoto videogiocoRemoto: catalogoRemoto) {
            Videogioco videogioco= new Videogioco(videogiocoRemoto.getNomeG(), videogiocoRemoto.getPrezzoG(), videogiocoRemoto.getQuantitaG());
            catalogo.add(videogioco);
        }
        return catalogo;
    }

    public Videogioco findVideogiocoRemoto(String nomeVideogioco) {
        String url = host+"/negozio/findVideogioco?nomeVideogioco=" + nomeVideogioco;
        ResponseEntity<VideogiocoRemoto> responseEntity = restTemplate.getForEntity(url, VideogiocoRemoto.class);
        VideogiocoRemoto videogiocoRemoto = responseEntity.getBody();
        Videogioco videogioco= new Videogioco(videogiocoRemoto.getNomeG(), videogiocoRemoto.getPrezzoG(), videogiocoRemoto.getQuantitaG());
        return videogioco;
    }

    public Videogioco updateVideogiocoRemoto(Videogioco videogioco) {
        String url = host+"/negozio/updateVideogioco";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        VideogiocoRemoto videogiocoRemoto= new VideogiocoRemoto(videogioco.getNomeG(), videogioco.getPrezzoG(), videogioco.getQuantitaG());
        HttpEntity<VideogiocoRemoto> request = new HttpEntity<>(videogiocoRemoto, headers);
        restTemplate.postForEntity(url, request, VideogiocoRemoto.class);
        return videogioco;
    }

    public DettaglioVideogioco findDettaglioVideogiocoRemoto(String nome) {
        String url = host+"/negozio/findDettaglioVideogioco?nomeVideogioco=" + nome;
        ResponseEntity<DettaglioVideogiocoRemoto> responseEntity = restTemplate.getForEntity(url, DettaglioVideogiocoRemoto.class);
        DettaglioVideogiocoRemoto dettaglioVideogiocoRemoto = responseEntity.getBody();
        DettaglioVideogioco dettaglioVideogioco= new DettaglioVideogioco(dettaglioVideogiocoRemoto.getNomeVideogioco(), dettaglioVideogiocoRemoto.getNomeImmagine(), dettaglioVideogiocoRemoto.getEstensioneImmagine(), dettaglioVideogiocoRemoto.getDescrizione());
        return dettaglioVideogioco;
    }
}
