package backend.java.com.testedev.security.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Document(collection = "produtos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Produtos {

    @MongoId(FieldType.OBJECT_ID)
    private String id;

    @NotBlank(message = "Nome é obrigatório")
    @Field(name = "nome")
    private String nome;


    @Positive(message = "Preço deve ser positivo")
    @Field(name = "preco")
    private double preco;

    @NotBlank(message = "Descrição é obrigatório")
    @Field(name = "descricao")
    private String descricao;

    @Positive(message = "Desconto não pode ser negativo")
    @Field(name = "desconto")
    private double desconto;

    @NotNull(message = "Quantidade em estoque é obrigatório")
    @Min(value = 0, message = "Quantidade em estoque não pode ser negativo")
    @Field(name = "quantidade_estoque")
    private Integer quantidadeEstoque;

    @Field(name = "valor_total")
    private double valorTotal;
}