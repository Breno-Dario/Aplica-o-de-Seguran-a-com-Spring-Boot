describe('Cadastro de produtos', () => {
  it('adiciona um produto', () => {
    cy.visit('http://localhost:5173') // ajuste a porta se necessário

    cy.get('input[placeholder="Nome do produto"]').type('Notebook Lenovo')
    cy.get('input[placeholder="Preço"]').type('3200.50')
    cy.contains('Adicionar').click()

    cy.contains('Notebook Lenovo')
    cy.contains('R$ 3.200,50')
  })
})
