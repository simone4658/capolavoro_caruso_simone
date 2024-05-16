package com.videogioco.model;

public class DettaglioVideogioco {
    private String nome;
    private String nomeImmagine;
    private String estensioneImmagine;
    private String descrizione;

    public DettaglioVideogioco(String nome, String nomeImmagine, String estensioneImmagine, String descrizione) {
        this.nome = nome;
        this.nomeImmagine = nomeImmagine;
        this.estensioneImmagine = estensioneImmagine;
        this.descrizione = descrizione;
    }

    public DettaglioVideogioco(){}

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeImmagine() {
        return nomeImmagine;
    }

    public void setNomeImmagine(String nomeImmagine) {
        this.nomeImmagine = nomeImmagine;
    }

    public String getEstensioneImmagine() {
        return estensioneImmagine;
    }

    public void setEstensioneImmagine(String estensioneImmagine) {
        this.estensioneImmagine = estensioneImmagine;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }
}
