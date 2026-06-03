import { useEffect, useState } from 'react';
import './App.css';

const categorias = [
  {
    nome: 'Hortifruti',
    imagem: '/categorias/hortifruti.png',
  },
  {
    nome: 'Açougue',
    imagem: '/categorias/acougue.png',
  },
  {
    nome: 'Padaria',
    imagem: '/categorias/padaria.png',
  },
  {
    nome: 'Alimentos',
    imagem: '/categorias/alimentos.png',
  },
  {
    nome: 'Limpeza',
    imagem: '/categorias/limpeza.png',
  },
  {
    nome: 'Bebidas',
    imagem: '/categorias/bebidas.png',
  },
];

function App() {
  const [itens, setItens] = useState(() => {
    const itensSalvos = localStorage.getItem('listaDeCompras');

    if (itensSalvos) {
      return JSON.parse(itensSalvos);
    }

    return [];
  });

  const [categoria, setCategoria] = useState('Hortifruti');
  const [quantidade, setQuantidade] = useState(1);
  const [nome, setNome] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Hortifruti');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    localStorage.setItem('listaDeCompras', JSON.stringify(itens));
  }, [itens]);

  function adicionarItem(event) {
    event.preventDefault();

    const nomeFormatado = nome.trim().toUpperCase();

    if (!nomeFormatado) {
      setAviso('Digite o nome do item.');
      return;
    }

    if (quantidade <= 0) {
      setAviso('A quantidade precisa ser maior que zero.');
      return;
    }

    const itemJaExiste = itens.some(
      (item) => item.nome === nomeFormatado && item.categoria === categoria,
    );

    if (itemJaExiste) {
      setAviso('Este produto já está na lista.');
      return;
    }

    const novoItem = {
      id: Date.now(),
      nome: nomeFormatado,
      quantidade: Number(quantidade),
      categoria,
      marcado: false,
    };

    setItens([...itens, novoItem]);
    setNome('');
    setQuantidade(1);
    setCategoriaAtiva(categoria);
  }

  function alternarMarcado(id) {
    const itensAtualizados = itens.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          marcado: !item.marcado,
        };
      }

      return item;
    });

    setItens(itensAtualizados);
  }

  function excluirItem(id) {
    const itensAtualizados = itens.filter((item) => item.id !== id);
    setItens(itensAtualizados);
  }

  function editarItem(id) {
    const itemEncontrado = itens.find((item) => item.id === id);

    const novoNome = prompt('Digite o novo nome:', itemEncontrado.nome);
    const novaQuantidade = prompt('Digite a nova quantidade:', itemEncontrado.quantidade);

    if (!novoNome || !novaQuantidade) {
      return;
    }

    const nomeFormatado = novoNome.trim().toUpperCase();
    const quantidadeFormatada = Number(novaQuantidade);

    if (!nomeFormatado || quantidadeFormatada <= 0) {
      setAviso('Nome ou quantidade inválida.');
      return;
    }

    const itemDuplicado = itens.some(
      (item) =>
        item.id !== id &&
        item.nome === nomeFormatado &&
        item.categoria === itemEncontrado.categoria,
    );

    if (itemDuplicado) {
      setAviso('Este produto já está na lista.');
      return;
    }

    const itensAtualizados = itens.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          nome: nomeFormatado,
          quantidade: quantidadeFormatada,
        };
      }

      return item;
    });

    setItens(itensAtualizados);
  }

  function limparLista() {
    const confirmar = confirm('Tem certeza que deseja limpar toda a lista?');

    if (confirmar) {
      setItens([]);
      localStorage.removeItem('listaDeCompras');
    }
  }

  const itensDaCategoria = itens.filter((item) => item.categoria === categoriaAtiva);

  return (
    <main className="app">
      <section className="card">
        <h1>Lista de Compras</h1>
        <p className="subtitulo">Organize seus itens por categoria</p>

        <form onSubmit={adicionarItem} className="formulario">
          <label>
            Categoria
            <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
              {categorias.map((cat) => (
                <option key={cat.nome} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantidade
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(event) => setQuantidade(event.target.value)}
            />
          </label>

          <label>
            Nome do item
            <input
              type="text"
              placeholder="Ex: arroz"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </label>

          <button type="submit" className="botao-principal">
            Adicionar item
          </button>
        </form>

        {aviso && (
          <div className="aviso">
            <p>{aviso}</p>
            <button onClick={() => setAviso('')}>OK</button>
          </div>
        )}
      </section>

      <section className="categorias">
        {categorias.map((cat) => (
          <button
            key={cat.nome}
            className={categoriaAtiva === cat.nome ? 'categoria ativa' : 'categoria'}
            onClick={() => setCategoriaAtiva(cat.nome)}
          >
            <span className="imagem-categoria">
              <img src={cat.imagem} alt="" />
            </span>
            <span>{cat.nome}</span>
          </button>
        ))}
      </section>

      <section className="lista">
        <div className="topo-lista">
          <h2>{categoriaAtiva}</h2>

          {itens.length > 0 && (
            <button className="botao-limpar" onClick={limparLista}>
              Limpar tudo
            </button>
          )}
        </div>

        {itensDaCategoria.length === 0 ? (
          <p className="lista-vazia">Nenhum item nessa categoria.</p>
        ) : (
          <ul>
            {itensDaCategoria.map((item) => (
              <li key={item.id} className={item.marcado ? 'item marcado' : 'item'}>
                <div className="info-item">
                  <input
                    type="checkbox"
                    checked={item.marcado}
                    onChange={() => alternarMarcado(item.id)}
                  />

                  <div>
                    <strong>{item.nome}</strong>
                    <span>Quantidade: {item.quantidade}</span>
                  </div>
                </div>

                <div className="acoes">
                  <button onClick={() => editarItem(item.id)}>Editar</button>
                  <button onClick={() => excluirItem(item.id)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
