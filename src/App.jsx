import React, { useRef, useState } from "react";

const ERROR_MESSAGE = "Ingresá al menos 2 jugadores para armar los equipos.";

function App() {
  const [players, setPlayers] = useState([""]);
  const [pastedList, setPastedList] = useState("");
  const [teams, setTeams] = useState(null);
  const [error, setError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const pastedListRef = useRef(null);
  const lastPlayerInputRef = useRef(null);
  const resultsRef = useRef(null);

  function resizePastedList(textarea) {
    if (!textarea) {
      return;
    }

    const styles = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(styles.lineHeight) || 19.5;
    const verticalPadding =
      Number.parseFloat(styles.paddingTop) +
      Number.parseFloat(styles.paddingBottom);
    const verticalBorder =
      Number.parseFloat(styles.borderTopWidth) +
      Number.parseFloat(styles.borderBottomWidth);
    const maxHeight = lineHeight * 11 + verticalPadding + verticalBorder;

    if (textarea.getBoundingClientRect().height > maxHeight + 1) {
      return;
    }

    textarea.style.height = "auto";
    const contentHeight = textarea.scrollHeight + verticalBorder;
    const minHeight = Number.parseFloat(styles.minHeight) || 0;
    textarea.style.height = `${Math.max(
      minHeight,
      Math.min(contentHeight, maxHeight),
    )}px`;
    textarea.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden";
  }

  function parseWhatsAppList(text) {
    return text
      .split(/\r?\n/)
      .map((line) => {
        const cleanedLine = line
          .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, "")
          .trim();
        const playerMatch = cleanedLine.match(
          /^(?:\d+\s*[.)-]\s*|[-–—]\s*)(.+)$/,
        );
        return playerMatch ? playerMatch[1].trim() : "";
      })
      .filter((name) => name.length > 0);
  }

  function loadWhatsAppList(text) {
    const names = parseWhatsAppList(text);
    if (names.length === 0) {
      setError("No encontré nombres para cargar en la lista.");
      setPlayers([""]);
      setPastedList("");
      setTeams(null);
      setCopyFeedback("");
      return;
    }

    setPlayers([...names, ""]);
    setTeams(null);
    setError("");
    setCopyFeedback("");
  }

  function scrollToSection(sectionRef, block = "start") {
    window.requestAnimationFrame(() => {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
      sectionRef.current?.scrollIntoView({ behavior, block });
    });
  }

  function handlePlayerChange(index, name) {
    const isLastInput = index === players.length - 1;
    setPlayers((currentPlayers) => {
      const updatedPlayers = currentPlayers.map((player, playerIndex) =>
        playerIndex === index ? name : player,
      );

      if (isLastInput && name.length > 0) {
        updatedPlayers.push("");
      }

      return updatedPlayers;
    });
    setTeams(null);
    setError("");

    if (isLastInput && name.length > 0) {
      scrollToSection(lastPlayerInputRef, "nearest");
    }
  }

  function handleDraw(event) {
    event.preventDefault();

    const filledPlayers = players
      .map((player) => player.trim())
      .filter((player) => player.length > 0);

    if (filledPlayers.length < 2) {
      setError(ERROR_MESSAGE);
      setTeams(null);
      return;
    }

    const shuffledPlayers = [...filledPlayers];
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
    setCopyFeedback("");
    setError("");
    scrollToSection(resultsRef);
  }

  async function handleCopyTeams() {
    setCopyFeedback("");
    const text = `⚽ Equipos para el fulbo\n\n*Equipo 1*\n${teams.team1
      .map((player) => `- ${player.trim()}`)
      .join("\n")}\n\n*Equipo 2*\n${teams.team2
      .map((player) => `- ${player.trim()}`)
      .join("\n")}\n\n--\nArmado con https://equipos-fulbo.vercel.app/`;

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          setCopyFeedback("¡Equipos copiados! Ya podés pegarlos en el chat.");
          return;
        } catch {
          // Try the legacy clipboard API when browser permissions block access.
        }
      }

      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      let copied;
      try {
        copied = document.execCommand("copy");
      } finally {
        textArea.remove();
      }

      if (!copied) {
        throw new Error("El navegador no permitió copiar los equipos.");
      }

      setCopyFeedback("¡Equipos copiados! Ya podés pegarlos en el chat.");
    } catch {
      setCopyFeedback("No se pudieron copiar los equipos. Probá de nuevo.");
    }
  }

  function handleReset() {
    setPlayers([""]);
    setPastedList("");
    setTeams(null);
    setCopyFeedback("");
    setError("");
  }

  const filledPlayerCount = players.filter(
    (player) => player.trim() !== "",
  ).length;

  return (
    <div className="app-shell">
      <main className="app-main">
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
                <h2 id="setup-title">¿Quiénes juegan?</h2>
              </div>
            </div>

            <form className="players-form" onSubmit={handleDraw}>
              <div className="players-heading">
                <div>
                  <p className="section-kicker">UNO POR UNO</p>
                  <h2>Pasá la lista</h2>
                </div>
                <span className="player-count">
                  {filledPlayerCount} JUGADORES
                </span>
              </div>

              <div className="paste-list">
                <label htmlFor="whatsapp-list">Formato de la lista</label>
                <p className="paste-list-help">
                  Un jugador por línea, con número y punto (1. Juan) o guion
                  (- Juan). Se ignoran títulos y líneas sin ese formato.
                </p>
                <textarea
                  ref={pastedListRef}
                  id="whatsapp-list"
                  rows="5"
                  placeholder="Pegá acá la lista de WhatsApp..."
                  value={pastedList}
                  onChange={(event) => {
                    setPastedList(event.target.value);
                    setError("");
                    resizePastedList(event.currentTarget);
                  }}
                  onPaste={(event) => {
                    const text = event.clipboardData.getData("text");
                    event.preventDefault();
                    setPastedList(text);
                    loadWhatsAppList(text);
                    window.requestAnimationFrame(() => {
                      resizePastedList(pastedListRef.current);
                    });
                  }}
                />
                <button
                  className="button button-outline paste-list-button"
                  type="button"
                  onClick={() => loadWhatsAppList(pastedList)}
                >
                  Cargar lista
                </button>
              </div>

              <div className="players-grid">
                {players.map((player, index) => (
                  <div className="player-input" key={index}>
                    <label htmlFor={`player-${index}`}>
                      {String(index + 1).padStart(2, "0")}
                    </label>
                    <input
                      ref={
                        index === players.length - 1
                          ? lastPlayerInputRef
                          : null
                      }
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

              {error && (
                <p className="error-message" role="alert">{error}</p>
              )}

              <button className="button draw-button" type="submit">
                <span className="button-ball" aria-hidden="true">⚽</span>
                Armar equipos
                <span aria-hidden="true">→</span>
              </button>
            </form>
          </section>

          {teams && (
            <section className="results" aria-live="polite" ref={resultsRef}>
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
              <div className="results-actions">
                <button
                  className="button button-outline"
                  type="button"
                  onClick={handleReset}
                >
                  Hacer otro sorteo
                </button>
                <button
                  className="button button-outline button-copy"
                  type="button"
                  onClick={handleCopyTeams}
                >
                  Copiar equipos
                </button>
              </div>
              {copyFeedback && (
                <p className="copy-feedback" role="status" aria-live="polite">
                  {copyFeedback}
                </p>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <p className="footer-tagline">
          Hecho para resolver las discusiones del doparti ⚽
        </p>
        <p className="footer-credit">Desarrollado por Juan Visintin</p>
        <nav className="footer-links" aria-label="Links útiles">
          <a
            href="https://github.com/juanvisintin/equipos-fulbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Repositorio
          </a>
          <a
            href="https://github.com/juanvisintin"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </footer>
    </div>
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
