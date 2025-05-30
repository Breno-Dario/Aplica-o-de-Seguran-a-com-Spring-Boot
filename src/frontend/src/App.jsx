import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [produtos, setProdutos] = useState([])
  const [erro, setErro] = useState(null)

  // Estados para criar produto
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [desconto, setDesconto] = useState('')
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('')

  // Estados para editar produto
  const [editando, setEditando] = useState(null)
  const [nomeEditado, setNomeEditado] = useState('')
  const [descricaoEditado, setDescricaoEditado] = useState('')
  const [precoEditado, setPrecoEditado] = useState('')
  const [descontoEditado, setDescontoEditado] = useState('')
  const [quantidadeEstoqueEditado, setQuantidadeEstoqueEditado] = useState('')

  useEffect(() => {
    buscarProdutos()
  }, [])

  const buscarProdutos = () => {
    fetch("http://localhost:8080/api/produtos")
      .then(res => {
        if (!res.ok) throw new Error("Erro na resposta da API")
        return res.json()
      })
      .then(setProdutos)
      .catch(error => {
        console.error("Erro ao buscar produtos:", error)
        setErro("Não foi possível carregar os produtos.")
      })
  }

  const handleAdicionar = (e) => {
    e.preventDefault()

    const novoProduto = {
      nome,
      descricao,
      preco: parseFloat(preco),
      desconto: parseFloat(desconto),
      quantidadeEstoque: parseInt(quantidadeEstoque)
    }

    fetch("http://localhost:8080/api/produtos", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao adicionar produto")
        return res.json()
      })
      .then(produtoCriado => {
        setProdutos([...produtos, produtoCriado])
        setNome('')
        setDescricao('')
        setPreco('')
        setDesconto('')
        setQuantidadeEstoque('')
      })
      .catch(error => {
        console.error("Erro ao adicionar produto:", error)
        setErro("Erro ao adicionar produto.")
      })
  }

  const iniciarEdicao = (produto) => {
    setEditando(produto.id)
    setNomeEditado(produto.nome)
    setDescricaoEditado(produto.descricao)
    setPrecoEditado(produto.preco.toString())
    setDescontoEditado(produto.desconto.toString())
    setQuantidadeEstoqueEditado(produto.quantidadeEstoque.toString())
  }

  const cancelarEdicao = () => {
    setEditando(null)
    setNomeEditado('')
    setDescricaoEditado('')
    setPrecoEditado('')
    setDescontoEditado('')
    setQuantidadeEstoqueEditado('')
  }

  const salvarEdicao = (id) => {
    const produtoAtualizado = {
      nome: nomeEditado,
      descricao: descricaoEditado,
      preco: parseFloat(precoEditado),
      desconto: parseFloat(descontoEditado),
      quantidadeEstoque: parseInt(quantidadeEstoqueEditado)
    }

    fetch(`http://localhost:8080/api/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoAtualizado)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar produto")
        return res.json()
      })
      .then(produtoAtualizado => {
        setProdutos(produtos.map(p => p.id === id ? produtoAtualizado : p))
        cancelarEdicao()
      })
      .catch(error => {
        console.error("Erro ao atualizar produto:", error)
        setErro("Erro ao atualizar produto.")
      })
  }

  const handleDeletar = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return

    fetch(`http://localhost:8080/api/produtos/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao excluir produto")
        setProdutos(produtos.filter(p => p.id !== id))
      })
      .catch(error => {
        console.error("Erro ao deletar produto:", error)
        setErro("Erro ao deletar produto.")
      })
  }

  const formatarReais = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="container">
      <h1>Lista de Produtos</h1>

      {erro && <p className="erro">{erro}</p>}

      <form className="form-adicionar" onSubmit={handleAdicionar}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          step="0.01"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Desconto (%)"
          step="0.01"
          value={desconto}
          onChange={e => setDesconto(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantidade em estoque"
          value={quantidadeEstoque}
          onChange={e => setQuantidadeEstoque(e.target.value)}
          required
        />
        <p className="valor-total">
          Valor Total: {formatarReais(
            (parseFloat(preco || '0') * (1 - parseFloat(desconto || '0') / 100))
          )}
        </p>

        <button type="submit">Adicionar</button>
      </form>

      {produtos.length > 0 ? (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              {editando === produto.id ? (
                <form className="form-edicao" onSubmit={e => { e.preventDefault(); salvarEdicao(produto.id) }}>
                  <label>
                    Nome:
                    <input
                      type="text"
                      value={nomeEditado}
                      onChange={e => setNomeEditado(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Descrição:
                    <input
                      type="text"
                      value={descricaoEditado}
                      onChange={e => setDescricaoEditado(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Preço:
                    <input
                      type="number"
                      step="0.01"
                      value={precoEditado}
                      onChange={e => setPrecoEditado(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Desconto (%):
                    <input
                      type="number"
                      step="0.01"
                      value={descontoEditado}
                      onChange={e => setDescontoEditado(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Estoque:
                    <input
                      type="number"
                      value={quantidadeEstoqueEditado}
                      onChange={e => setQuantidadeEstoqueEditado(e.target.value)}
                      required
                    />
                  </label>
                  <p className="valor-total">
                    Valor Total: {formatarReais(
                      (parseFloat(precoEditado || '0') * (1 - parseFloat(descontoEditado || '0') / 100))
                    )}
                  </p>

                  <div className="botoes-edicao">
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={cancelarEdicao}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <div className="produto-info">
                  <div><strong>Nome:</strong> {produto.nome}</div>
                  <div><strong>Descrição:</strong> {produto.descricao}</div>
                  <div><strong>Preço com desconto:</strong> <span className="preco">{formatarReais(produto.preco * (1 - produto.desconto / 100))}</span></div>
                  <div><strong>Desconto:</strong> {produto.desconto}%</div>
                  <div><strong>Estoque:</strong> {produto.quantidadeEstoque}</div>

                  <div className="botoes">
                    <button className="editar" onClick={() => iniciarEdicao(produto)}>Alterar</button>
                    <button className="deletar" onClick={() => handleDeletar(produto.id)}>Deletar</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !erro && <p>Carregando produtos...</p>
      )}
    </div>
  )
}

export default App
