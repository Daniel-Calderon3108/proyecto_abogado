package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.CommentCaseRequest;
import com.example.proyecto_abogado.entities.CommentCase;

import java.util.List;

public interface ICommentCaseService {
    List<CommentCase> getCommentCaseByIdCase(Long id);
    CommentCase save(CommentCaseRequest commentCaseRequest);
}
