package com.videogioco.service;
import com.videogioco.controller.NegozioController;
import com.videogioco.model.DettaglioVideogioco;
import com.videogioco.model.Videogioco;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class DatabaseService {
    private static final Logger logger = LogManager.getLogger(DatabaseService.class);
    private static final String DB_URL = "jdbc:mysql://localhost:3306/negoziovideogioco";
    private static final String USER = "root";
    private static final String PASSWORD = "";

    public static Connection getConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(DB_URL, USER, PASSWORD);
        }
        catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Videogioco> findAll () {
        List<Videogioco> lv = null;
        Connection connessione = getConnection();
        try {
            System.out.println();
            logger.info("Inizializzazione connessione");
            Statement statement = connessione.createStatement();
            String query = "SELECT * FROM VIDEOGIOCO";
            ResultSet resultSet = statement.executeQuery(query);
            System.out.println();
            logger.info("Avviamento lista");
            lv = new ArrayList<>();
            while (resultSet.next()) {
                String nome = resultSet.getString("NOME");
                int prezzo = resultSet.getInt("PREZZO");
                int quantita = resultSet.getInt("QUANTITÀ");
                System.out.println();
                logger.info("Videogame's info!" + " NomeV: " + nome + " PrezzoV: " + prezzo + " QuantitàV: " + quantita);

                //qui creiamo il videogioco con Videogioco(nome, prezzo, quantita) e lo aggiungiamo alla lista
                Videogioco videogioco = new Videogioco(nome, prezzo, quantita);
                lv.add(videogioco);
                System.out.println();
                logger.info("Videogioco aggiunto con successo!");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                connessione.close(); // Chiude la connessione
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return lv;
    }
    public void addVideogioco(Videogioco videogioco) {
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD)) {
            String query = "INSERT INTO VIDEOGIOCO (NOME, PREZZO, QUANTITÀ) VALUES (?, ?, ?)";
            try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
                preparedStatement.setString(1, videogioco.getNomeG());
                preparedStatement.setDouble(2, videogioco.getPrezzoG());
                preparedStatement.setInt(3, videogioco.getQuantitaG());

                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    logger.info("Videogioco inserito correttamente!");
                } else {
                    logger.info("Errore durante l'inserimento del videogioco");
                }
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }
    public Videogioco findVideogioco(String nome) {
        Videogioco videogioco = null;
        try (Connection connection = getConnection()) {
            String query = "SELECT * FROM VIDEOGIOCO WHERE NOME = ?";
            try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
                preparedStatement.setString(1, nome);

                ResultSet resultSet = preparedStatement.executeQuery();
                while (resultSet.next()) {
                    int prezzo = resultSet.getInt("PREZZO");
                    int quantita = resultSet.getInt("QUANTITÀ");

                    videogioco = new Videogioco();
                    videogioco.setNomeG(nome);
                    videogioco.setPrezzoG(prezzo);
                    videogioco.setQuantitaG(quantita);
                }
                resultSet.close();
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return videogioco;
    }
    public DettaglioVideogioco findDettaglioVideogioco(String nome) {
        DettaglioVideogioco dettagliovideogioco = null;
        try (Connection connection = getConnection()) {
            String query = "SELECT * FROM DETTAGLIO_VIDEOGIOCO WHERE NOME = ?";
            try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
                preparedStatement.setString(1, nome);

                ResultSet resultSet = preparedStatement.executeQuery();
                while (resultSet.next()) {
                    dettagliovideogioco = new DettaglioVideogioco();
                    dettagliovideogioco.setNome(nome);
                    dettagliovideogioco.setNomeImmagine(resultSet.getString("NOME_IMMAGINE"));
                    dettagliovideogioco.setEstensioneImmagine(resultSet.getString("ESTENSIONE_IMMAGINE"));
                    dettagliovideogioco.setDescrizione(resultSet.getString("DESCRIZIONE"));
                }
                resultSet.close();
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return dettagliovideogioco;
    }

    public void updateVideogioco(Videogioco videogioco) {
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD)) {
            String query = "UPDATE VIDEOGIOCO SET PREZZO = ?, QUANTITÀ = ? WHERE NOME = ?";
            try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
                preparedStatement.setDouble(1, videogioco.getPrezzoG());
                preparedStatement.setInt(2, videogioco.getQuantitaG());
                preparedStatement.setString(3, videogioco.getNomeG());

                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    logger.info("Videogioco aggiornato correttamente!");
                }
                else {
                    logger.info("Nessun videogioco trovato con il nome specificato");
                }
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }
    public void deleteVideogioco(String nomeV) {
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD)) {
            String query = "DELETE FROM VIDEOGIOCO WHERE NOME = ?";
            try (PreparedStatement preparedStatement = connection.prepareStatement(query)) {
                preparedStatement.setString(1, nomeV);

                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    logger.info("Videogioco rimosso correttamente!");
                }
                else {
                    logger.info("Nessun videogioco trovato con il nome specificato");
                }
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }
}