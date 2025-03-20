import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:8000/h2c/chatBot", {
        question,
      });

      const formattedResponse = res.data.result
        .replace(/\n/g, "<br />") // Preserve line breaks
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Make text bold

      setResponse(formattedResponse);
    } catch (error) {
      setResponse("❌ Error fetching response. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Ask AI</h1>
      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleAsk} style={styles.button}>
        Ask
      </button>
      <div style={styles.responseContainer}>
        {loading ? (
          <div style={styles.loader}></div>
        ) : (
          <p style={{ color: "#000" }} dangerouslySetInnerHTML={{ __html: response }}></p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    width: "300px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  responseContainer: {
    marginTop: "20px",
    padding: "15px",
    width: "50%",
    margin: "20px auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
    minHeight: "50px",
    fontSize: "16px",
    textAlign: "left",
    lineHeight: "1.5",
    color: "#000", // Ensures text remains black
  },
  loader: {
    width: "25px",
    height: "25px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "auto",
  },
};

export default App;
