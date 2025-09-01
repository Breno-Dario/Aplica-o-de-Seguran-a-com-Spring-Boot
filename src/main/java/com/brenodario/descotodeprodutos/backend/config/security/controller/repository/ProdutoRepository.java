package com.brenodario.descotodeprodutos.backend.config.security.controller.repository;

import com.brenodario.descotodeprodutos.backend.config.security.controller.model.Produtos;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProdutoRepository extends MongoRepository<Produtos, String> {


}