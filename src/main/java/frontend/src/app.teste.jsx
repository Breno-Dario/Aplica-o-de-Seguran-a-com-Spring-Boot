import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
)

describe('App', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renderiza o título e o formulário', () => {
    render(<App />)
    expect(screen.getByText('Lista de Produtos')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nome do produto')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Preço')).toBeInTheDocument()
  })

  it('permite adicionar produto (simulado)', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    )

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ id: 1, nome: 'Cadeira Gamer', preco: 599.99 }),
      })
    )

    render(<App />)

    fireEvent.change(screen.getByPlaceholderText('Nome do produto'), {
      target: { value: 'Cadeira Gamer' },
    })
    fireEvent.change(screen.getByPlaceholderText('Preço'), {
      target: { value: '599.99' },
    })

    fireEvent.click(screen.getByText('Adicionar'))

    await waitFor(() =>
      expect(screen.getByText('Cadeira Gamer')).toBeInTheDocument()
    )
  })
})
