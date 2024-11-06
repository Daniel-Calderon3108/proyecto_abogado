package com.example.proyecto_abogado.services.document;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.DTO.nameCase;
import com.example.proyecto_abogado.entities.CaseProcess;
import com.example.proyecto_abogado.entities.Document;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.repository.DocumentRepository;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class DocumentService implements IDocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @Override
    public Document store(MultipartFile file, DocumentRequest documentRequest, Long idCase) throws IOException {
        System.out.println("Iniciando almacenamiento del documento");

        /*String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo no puede estar vacío");
        }*/

        // Crear entidad Document
        Document newDocumento = new Document();
        newDocumento.setNameDocument(documentRequest.getNameDocument());
        newDocumento.setTypeDocument(documentRequest.getTypeDocument());
        newDocumento.setData(file.getBytes());
        newDocumento.setUserRegisterDocument(documentRequest.getUserRegisterDocument());
        newDocumento.setDateDocument(documentRequest.getDateDocument());
        newDocumento.setDateUpdateDocument(documentRequest.getDateUpdateDocument());
        newDocumento.setStatusDocument(documentRequest.getStatusDocument());
        newDocumento.setUserUpdateDocument(documentRequest.getUserUpdateDocument());

        // Buscar caso relacionado
        CaseProcess caseProcess = caseProcessRepository.findById(idCase)
                .orElseThrow(() -> new RuntimeException("Caso no encontrado"));

        System.out.println("Subiendo archivo a Google Drive...");
        String fileUrl = uploadFile(file); // Aquí estamos subiendo el archivo y obteniendo la URL
        System.out.println("Archivo subido, URL recibida: " + fileUrl);

        newDocumento.setUrlDocument(fileUrl); // Establece la URL en el documento
        newDocumento.setCaseProcess(caseProcess);

        Document savedDocument = documentRepository.save(newDocumento);
        System.out.println("Documento guardado en la base de datos con ID: " + savedDocument.getIdDocument());

        return savedDocument;
    }

        @Override
        public List<DocumentRequest> getAllFiles() {
            List<DocumentRequest> files = StreamSupport.stream(documentRepository.findAll().spliterator(), false)
                    .map(dbFile -> {
                        /* codigo para la descargar de archivos
                        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("api/documents/files/")
                                .path(dbFile.getId_document().toString())
                                .toUriString();*/

                        String fileUrl = dbFile.getUrlDocument();

                        return DocumentRequest.builder()
                                .idDocument(dbFile.getIdDocument())
                                .nameDocument(dbFile.getNameDocument())
                                .urlDocument(fileUrl) // Usa la URL de Google Drive almacenada
                                .typeDocument(dbFile.getTypeDocument())
                                .dateDocument(dbFile.getDateDocument())
                                .statusDocument(dbFile.getStatusDocument())
                                .userRegisterDocument(dbFile.getUserRegisterDocument())
                                .userUpdateDocument(dbFile.getUserUpdateDocument())
                                .dateUpdateDocument(dbFile.getDateUpdateDocument())
                                .nameIdCase(dbFile.getCaseProcess() != null ? new nameCase(dbFile.getCaseProcess()) : null)
                                .sizeDocument(dbFile.getData().length)
                                .build();
                    })
                    .collect(Collectors.toList());
            return files;
        }

        private Drive driveService;

        public DocumentService() throws Exception {
            // Cargar credenciales de Google desde el archivo JSON en el classpath
            InputStream credentialsStream = getClass().getClassLoader().getResourceAsStream("lawyerapidrive-c2742e9b72b7.json");

            if (credentialsStream == null) {
                throw new FileNotFoundException("Archivo de credenciales no encontrado en la ruta especificada");
            }

            GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream)
                    .createScoped(Collections.singleton(DriveScopes.DRIVE));

            // Convertir GoogleCredentials a HttpRequestInitializer usando HttpCredentialsAdapter
            driveService = new Drive.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    new HttpCredentialsAdapter(credentials)  // Aquí se convierte para Drive.Builder
            )
                    .setApplicationName("appLawFile")
                    .build();
        }

    @Override
    public Optional<Document> getFile(Long id) {
        return documentRepository.findById(id);
    }

    public String uploadFile(MultipartFile file) throws IOException {
        try {
            // Crear metadatos del archivo e incluir la carpeta de destino
            File fileMetadata = new File();
            fileMetadata.setName(file.getOriginalFilename());
            fileMetadata.setParents(Collections.singletonList("1QO_Hqr3GVYHcne9zAlOSQD7Acbt8u8BM")); // ID de la carpeta en Drive

            InputStreamContent mediaContent = new InputStreamContent(file.getContentType(), file.getInputStream());

            // Crear archivo en Drive
            File googleFile = driveService.files().create(fileMetadata, mediaContent)
                    .setFields("id")  // Elige solo el ID para obtener la URL
                    .execute();

            // Crear permiso de lectura pública
            Permission permission = new Permission().setType("anyone").setRole("reader");
            driveService.permissions().create(googleFile.getId(), permission).execute();

            // Retorna URL correcta para visualización en Google Drive
            return "https://drive.google.com/file/d/" + googleFile.getId() + "/view";

        } catch (GoogleJsonResponseException e) {
            System.out.println("Google API Error: " + e.getDetails().getMessage());
            throw new IOException("Error al subir archivo a Google Drive", e);
        }
    }

    @Override
    public Document findById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento No Encontrado"));
    }

    @Override
    public List<Document> findByName(String search) {
        return documentRepository.findByIdDocumentOrNameDocumentContainingIgnoreCase(convertStringToLongOrDefault(search),search);
    }

    // Convertir String a Long
    public static Long convertStringToLongOrDefault(String str) {
        try {
            return Long.parseLong(str);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}