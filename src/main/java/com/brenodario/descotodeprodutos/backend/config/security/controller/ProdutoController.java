package com.brenodario.descotodeprodutos.backend.config.security.controller;

import com.brenodario.descotodeprodutos.backend.config.security.controller.model.Produtos;
import com.brenodario.descotodeprodutos.backend.config.security.controller.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProdutoController {

    @Autowired
    private ProdutoRepository repository;

    @PostMapping
    public ResponseEntity<Produtos> salvar(@Valid @RequestBody Produtos produto) {
        produto.setValorTotal(produto.getPreco() - produto.getDesconto());
        Produtos salvo = repository.save(produto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(salvo.getId())
                .toUri();
        return ResponseEntity.created(location).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<Produtos>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produtos> buscarPorId(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produtos> atualizar(
            @PathVariable String id,
            @Valid @RequestBody Produtos produto) {

        return repository.findById(id)
                .map(existente -> {
                    existente.setNome(produto.getNome());
                    existente.setPreco(produto.getPreco());
                    existente.setDescricao(produto.getDescricao());
                    existente.setDesconto(produto.getDesconto());
                    existente.setQuantidadeEstoque(produto.getQuantidadeEstoque());
                    existente.setValorTotal(produto.getValorTotal());
                    return ResponseEntity.ok(repository.save(existente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}