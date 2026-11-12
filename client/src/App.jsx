import { useEffect, useState } from "react";
import Card from "./Card.jsx";

function App() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("Criatura");
  const [attack, setAttack] = useState("");

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:3000/api/cartas")

      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.error("Erro:", err);
        setError(err.message);
      })

      .finally(() => setLoading(false));
  }, []);

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  function pickRandom() {
    if (cards.length > 0) {
      setRandomCard(cards[Math.floor(Math.random() * cards.length)]);
    }
  }

  async function addCard(e) {
    e.preventDefault();

    if (!name.trim() || attack === "") {
      return;
    }

    const newCard = {
      name: name.trim(),
      type: type,
      attack: Number(attack),
      defense: 0
    };

    try {
      const response = await fetch("http://localhost:3000/api/cartas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newCard)
      });

      if (!response.ok) {
        throw new Error("Erro HTTP: " + response.status);
      }

      const savedCard = await response.json();

      setCards((prevCards) => [...prevCards, savedCard]);

      setName("");
      setType("Criatura");
      setAttack("");

    } catch (err) {
      console.error("Erro ao adicionar carta:", err);
      setError(err.message);
    }
  }

  if (loading) {
    return <main><p>Carregar cartas</p></main>
  }
  if (error) {
    return <main><p>Erro: {error}</p></main>;
  }
  return (
    <main>
      <h1>A minha coleção</h1>

      <p>
        Tenho {cards.length} cartas · a mostrar {visible.length}
      </p>

      <div>
        <button onClick={() => setFilter("Todas")}>Todas</button>
        <button onClick={() => setFilter("Criatura")}>Só criaturas</button>
        <button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar pelo nome…"
      />

      {visible.length === 0 ? (
        <p>Nenhuma carta corresponde.</p>
      ) : (
        <ul>
          {visible.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </ul>
      )}

      <h2>Carta à sorte</h2>
      <button onClick={pickRandom}>Escolher outra</button>
      {randomCard && (
        <p>
          <b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack} ·
          defesa {randomCard.defense}
        </p>
      )}
      <h2>Adicionar carta</h2>

      <form onSubmit={addCard}>
        <input
          type="text"
          placeholder="Nome da carta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Criatura">Criatura</option>
          <option value="Feitiço">Feitiço</option>
        </select>

        <input
          type="number"
          placeholder="Ataque"
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
          min="0"
          required
        />

        <button type="submit">Adicionar carta</button>
      </form>
    </main>
  );
}

export default App;