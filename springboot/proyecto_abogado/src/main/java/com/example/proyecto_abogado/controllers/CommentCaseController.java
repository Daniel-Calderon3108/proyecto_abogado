package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.CommentCaseRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.CommentCase;
import com.example.proyecto_abogado.repository.CommentCaseRepository;
import com.example.proyecto_abogado.services.comment.ICommentCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequestMapping("api/commentCase")
@RestController
public class CommentCaseController {

    @Autowired
    private ICommentCaseService service;

    @Autowired
    private CommentCaseRepository commentCaseRepository;

    // EndPoint Listar Comentarios Por Caso
    @GetMapping("{id}")
    public List<CommentCaseRequest> getCommentCaseByIdCase(@PathVariable Long id) throws IOException {
        List<CommentCase> commentsCases = service.getCommentCaseByIdCase(id);
        List<CommentCaseRequest> commentsCaseRequest = commentsCases.stream().map(CommentCaseRequest::new)
                .collect(Collectors.toList());
            // Recorrer todos los comentarios del DTO
            for (CommentCaseRequest commentCase : commentsCaseRequest) {

                String uploadPath = "photos_users";
                Path path = Paths.get(uploadPath).resolve(commentCase.getPhotoUser()).normalize();

                Resource resource = new UrlResource(path.toUri());

                if (resource.exists() && resource.isReadable()) {
                    byte[] fileBytes = Files.readAllBytes(path);
                    // Asignar los bytes al comentario DTO
                    commentCase.setResource(fileBytes);
                }
            }
        // Crear JSON personalizado
        return commentsCaseRequest;
    }

    // EndPoint Crear Comentario
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody CommentCaseRequest commentCaseRequest) {
        System.out.println("Comentario Recibido : " + commentCaseRequest);
        try{
            CommentCase commentCase = service.save(commentCaseRequest);
            return ResponseEntity.ok(new Response(true, "Se creo el comentario exitosamente", commentCase));
        }catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al crear comentario "
                    + e.getMessage()));
        }
    }

    // EndPoint Actualizar Comentario
    @PutMapping("update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CommentCaseRequest commentCaseRequest) {
        System.out.println("Se actualizara el comentario #" + id + " con los datos " + commentCaseRequest);
        try {
            Optional<CommentCase> commentCaseData = commentCaseRepository.findById(id);

            if(commentCaseData.isPresent()) {
                CommentCase updateCommentCase = commentCaseData.get();
                updateCommentCase.setDescription(commentCaseRequest.getDescription());
                updateCommentCase.setLastUpdate(commentCaseRequest.getLastUpdate());
                updateCommentCase.setUpdate(true);
                commentCaseRepository.save(updateCommentCase);
                return ResponseEntity.ok(new Response(true, "Se actualizo el comentario con exito."));
            }
            return ResponseEntity.status(404).body(new Response(false, "No se encontro el comentario"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al actualizar comentario "
                    + e.getMessage()));
        }
    }

    // EndPoint Quitar/Marcar Como Importante
    @PutMapping("update/important/{id}")
    public ResponseEntity<?> updateImportantComment(@PathVariable Long id, @RequestBody CommentCaseRequest commentCaseRequest) {
        try {
            Optional<CommentCase> commentCaseData = commentCaseRepository.findById(id);

            if(commentCaseData.isPresent()) {
                CommentCase updateCommentCase = commentCaseData.get();
                updateCommentCase.setImportant(!updateCommentCase.isImportant());
                updateCommentCase.setLastUpdate(commentCaseRequest.getLastUpdate());
                commentCaseRepository.save(updateCommentCase);
                return ResponseEntity.ok(new Response(true, "Se actualizo el comentario con exito."));
            }
            return ResponseEntity.status(404).body(new Response(false, "No se encontro el comentario"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al actualizar comentario "
                    + e.getMessage()));
        }
    }

    // EndPoint Eliminar Comentario
    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deleteCommentCase(@PathVariable Long id) {
        try{
            Optional<CommentCase> deleteCommentCase = commentCaseRepository.findById(id);

            if(deleteCommentCase.isPresent()) {
                commentCaseRepository.deleteById(id);
                return ResponseEntity.ok(new Response(true,"Se elimino comentario con exito."));
            }
            return ResponseEntity.status(404).body(new Response(false, "No se encontro el comentario"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al eliminar comentario "
                    + e.getMessage()));
        }
    }
}
