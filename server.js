const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const PORT = 3000;

server.use(jsonServer.bodyParser);
server.use(middlewares);

// GET method for messages
server.get("/messages", (req, res) => {
  const messages = router.db.get("messages").value();
  res.json(messages);
});

// POST method for messages
server.post("/messages", (req, res) => {
  const { message, user } = req.body;
  if (!message || !user) {
    res.status(400).json({ error: "Text and user are required fields" });
    return;
  }

  const newMessage = {
    id: Date.now(),
    message,
    user,
    createdAt: new Date().toISOString(),
  };

  router.db.get("messages").push(newMessage).write();

  res.status(201).json(newMessage);
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
