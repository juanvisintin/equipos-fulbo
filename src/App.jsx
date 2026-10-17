import React, { useState } from "react";

const ERROR_MESSAGE = "Error. Ingresá un número, nabo.";

function App() {
  const [quantityInput, setQuantityInput] = useState("");
  const [playerCount, setPlayerCount] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState(null);
  const [error, setError] = useState("");

  function handleQuantitySubmit(event) {
    event.preventDefault();

    const count = Number(quantityInput);
    if (
      !Number.isSafeInteger(count) ||
      count < 1 ||
      quantityInput.trim() === ""
    ) {
      setError(ERROR_MESSAGE);
      setPlayerCount(null);
      setPlayers([]);
      setTeams(null);
      return;
    }

    setError("");
    setPlayerCount(count);
    setPlayers(Array.from({ length: count }, () => ""));
    setTeams(null);
  }

  function handlePlayerChange(index, name) {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player, playerIndex) =>
        playerIndex === index ? name : player,
      ),
    );
    setTeams(null);
    setError("");
  }

  function handleDraw(event) {
    event.preventDefault();

    if (players.some((player) => player.trim() === "")) {
      setError(ERROR_MESSAGE);
      setTeams(null);
      return;
    }

    const shuffledPlayers = [...players];
    for (let index = shuffledPlayers.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledPlayers[index], shuffledPlayers[randomIndex]] = [
        shuffledPlayers[randomIndex],
        shuffledPlayers[index],
      ];
    }

    const splitPoint = Math.ceil(shuffledPlayers.length / 2);
    setTeams({
      team1: shuffledPlayers.slice(0, splitPoint),
      team2: shuffledPlayers.slice(splitPoint),
    });
    setError("");
  }

  function handleReset() {
    setQuantityInput("");
    setPlayerCount(null);
    setPlayers([]);
    setTeams(null);
    setError("");
  }

  return (
    <main>
      <section className="intro" aria-labelledby="page-title">
        <img
          className="hero-image"
          src="/hero.png"
          alt=""
        />
        <div className="hero-shading" aria-hidden="true" />
        <h1 id="page-title">Equipos para el fulbo</h1>
      </section>

      <div className="page-shell">
        <section className="draw-card" aria-labelledby="setup-title">
          <div className="card-heading">
            <span className="step-number">01</span>
            <div>
              <h2 id="setup-title">¿Cuántos juegan?</h2>
            </div>
          </div>

          <form className="quantity-form" onSubmit={handleQuantitySubmit}>
            <label className="visually-hidden" htmlFor="player-count">
              Cantidad de jugadores
            </label>
            <input
              id="player-count"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="Ej. 10"
              value={quantityInput}
              onChange={(event) => setQuantityInput(event.target.value)}
            />
            <button className="button button-dark" type="submit">
              Confirmar <span aria-hidden="true">→</span>
            </button>
          </form>

          {error && (
            <p className="error-message" role="alert">{error}</p>
          )}

          {playerCount !== null && (
            <form className="players-form" onSubmit={handleDraw}>
              <div className="players-heading">
                <div>
                  <p className="section-kicker">UNO POR UNO</p>
                  <h2>Pasá la lista</h2>
                </div>
                <span className="player-count">{playerCount} JUGADORES</span>
              </div>

              {playerCount % 2 !== 0 && (
                <p className="disclaimer">
                  La cantidad es impar. Un equipo va a quedar con un jugador
                  más que el otro.
                </p>
              )}

              <div className="players-grid">
                {players.map((player, index) => (
                  <div className="player-input" key={index}>
                    <label htmlFor={`player-${index}`}>
                      {String(index + 1).padStart(2, "0")}
                    </label>
                    <input
                      id={`player-${index}`}
                      type="text"
                      placeholder={`Nombre del jugador ${index + 1}`}
                      value={player}
                      onChange={(event) =>
                        handlePlayerChange(index, event.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              <button className="button draw-button" type="submit">
                <span className="button-ball" aria-hidden="true">⚽</span>
                Armar equipos
                <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
        </section>

        {teams && (
          <section className="results" aria-live="polite">
            <div className="results-heading">
              <h2>Listo, nene</h2>
            </div>
            <div className="team-grid">
              <TeamCard
                name="Equipo 1"
                players={teams.team1}
                variant="green"
              />
              <TeamCard
                name="Equipo 2"
                players={teams.team2}
                variant="orange"
              />
            </div>
            <button
              className="button button-outline"
              type="button"
              onClick={handleReset}
            >
              Hacer otro sorteo
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function TeamCard({ name, players, variant }) {
  return (
    <article className={`team-card team-card-${variant}`}>
      <div className="team-heading">
        <span className="team-dot" />
        <h3>{name}</h3>
        <span className="team-total">{players.length} JUG.</span>
      </div>
      <ul>
        {players.map((player, index) => (
          <li key={`${player}-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {player.trim()}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default App;
