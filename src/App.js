import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-body");
    } else {
      document.body.classList.remove("dark-body");
    }
  }, [darkMode]);

  const validateQuestion = (text) => {
    const regex1 = /^¿.*\?$/;
    const regex2 = /.+\?$/;
    return regex1.test(text) || regex2.test(text);
  };

  const playSound = (answerText) => {
    const audio = new Audio(`/sounds/${answerText}.mp3`);
    audio.play();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAnswer(null);
    setLoading(true);

    if (!validateQuestion(question.trim())) {
      setError("La pregunta debe estar entre signos de interrogación o terminar con '?'");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://yesno.wtf/api");
      setAnswer(response.data);
      playSound(response.data.answer);

      setHistory((prev) => [
        ...prev,
        {
          question: question.trim(),
          answer: response.data.answer,
          image: response.data.image,
        },
      ]);
    } catch (err) {
      setError("Error al consultar la API. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <div className="darkmode-wrapper">
        <button
          className="darkmode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>

      <img src="./perro.png" alt="Pregúntame algo" className="titulo-img" />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Consultando..." : "Preguntar"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading && <div className="spinner"></div>}
      {answer && (
        <div className="answer">
          <h2>{answer.answer.toUpperCase()}</h2>
          <img src={answer.image} alt={answer.answer} />
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h3>Historial de preguntas</h3>
          <ul>
            {(showFullHistory ? history : history.slice(-3)).map((item, index) => (
              <li key={index}>
                <p>
                  <strong>{item.question}</strong> → {item.answer.toUpperCase()}
                </p>
                <img src={item.image} alt={item.answer} />
              </li>
            ))}
          </ul>
          {history.length > 3 && (
            <button
              className="toggle-history-btn"
              onClick={() => setShowFullHistory(!showFullHistory)}
            >
              {showFullHistory ? "Ocultar historial" : "Ver historial completo"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;


