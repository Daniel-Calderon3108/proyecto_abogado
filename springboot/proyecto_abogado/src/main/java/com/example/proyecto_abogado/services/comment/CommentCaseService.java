package com.example.proyecto_abogado.services.comment;

import com.example.proyecto_abogado.DTO.CommentCaseRequest;
import com.example.proyecto_abogado.entities.CaseProcess;
import com.example.proyecto_abogado.entities.CommentCase;
import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.repository.CommentCaseRepository;
import com.example.proyecto_abogado.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentCaseService implements ICommentCaseService {

    @Autowired
    private CommentCaseRepository commentCaseRepository;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public List<CommentCase> getCommentCaseByIdCase(Long id) { return commentCaseRepository.findByCaseProcess_IdCaseOrderByLastUpdateDesc(id); }

    @Override
    public CommentCase save(CommentCaseRequest commentCaseRequest) {

        CommentCase newCommentCase = new CommentCase();

        newCommentCase.setDescription(commentCaseRequest.getDescription());
        newCommentCase.setImportant(commentCaseRequest.isImportant());
        newCommentCase.setDateRegister(commentCaseRequest.getDateRegister());
        newCommentCase.setLastUpdate(commentCaseRequest.getLastUpdate());
        newCommentCase.setUpdate(false);

        CaseProcess caseProcess = caseProcessRepository.findById(commentCaseRequest.getIdCase())
                .orElseThrow(() -> new RuntimeException("No encontro el caso"));

        newCommentCase.setCaseProcess(caseProcess);

        User user = userRepository.findById(commentCaseRequest.getIdUser())
                .orElseThrow(() -> new RuntimeException("No se encontro el usuario"));

        newCommentCase.setUser(user);

        return commentCaseRepository.save(newCommentCase);
    }
}
