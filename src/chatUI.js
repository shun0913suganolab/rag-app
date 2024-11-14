import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "User", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("YOUR_AZURE_FUNCTION_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      const botMessage = { sender: "Bot", text: data.answer };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <Container maxWidth="sm" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        社内用RAGチャット
      </Typography>
      <Paper style={{ padding: "10px", maxHeight: "300px", overflow: "auto", marginBottom: "20px" }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemText primary={`${msg.sender}: ${msg.text}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="メッセージを入力"
        value={input}
        onChange={handleInputChange}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginTop: "10px" }}>
        送信
      </Button>
    </Container>
  );
};

export default ChatUI;
