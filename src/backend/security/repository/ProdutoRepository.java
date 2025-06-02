package backend.security.repository;

import backend.security.model.Produtos;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProdutoRepository extends MongoRepository<Produtos, String> {


}
