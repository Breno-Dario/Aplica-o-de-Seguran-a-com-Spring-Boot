package backend.java.com.testedev.security.repository;

import backend.java.com.testedev.security.model.Produtos;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProdutoRepository extends MongoRepository<Produtos, String> {


}
