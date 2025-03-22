import { useState, useEffect } from "react";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../Services/Firebase";

type Contact = {
  id: number;
  name: string;
};

type Message = {
  id: number;
  content: string;
  status: "Agendada" | "Enviada";
  sendAt: Date;
};

const BroadcastMessages = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [sendAt, setSendAt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const FetchUserData = async () => {
    const storedUser = localStorage.getItem("user");
    const uid = storedUser ? JSON.parse(storedUser).uid : null;

    if (!uid) {
      console.log("Não achou!");
      return null;
    }

    try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? { id: uid, ...docSnap.data() } : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const userData = await FetchUserData();
      if (!userData) return;

      try {
        const connectionsRef = collection(
          db,
          "users",
          userData.id,
          "connections"
        );
        const snapshot = await getDocs(connectionsRef);

        if (snapshot.empty) return;

        const contactsList: Contact[] = snapshot.docs.map((doc) => ({
          id: Number(doc.id),
          name: doc.data().name,
        }));

        setContacts(contactsList);
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
      }
    };

    getUser();
  }, []);

  const toggleContactSelection = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const scheduleMessage = () => {
    if (!message || !sendAt || selectedContacts.length === 0) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: message,
      status: "Agendada",
      sendAt: new Date(sendAt),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setSendAt("");
    setSelectedContacts([]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.status === "Agendada" && new Date(msg.sendAt) <= new Date()
            ? { ...msg, status: "Enviada" }
            : msg
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="margin-top-100 p-10 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Envio de Mensagens</h2>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Digite a mensagem"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="datetime-local"
        className="w-full p-2 border rounded mt-2"
        value={sendAt}
        onChange={(e) => setSendAt(e.target.value)}
      />
      <h3 className="mt-4 font-semibold">Selecionar Contatos:</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => toggleContactSelection(contact.id)}
            className={`px-4 py-2 border rounded ${
              selectedContacts.includes(contact.id)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {contact.name}
          </button>
        ))}
      </div>
      <button
        className="mt-4 w-full bg-green-500 text-white p-2 rounded"
        onClick={scheduleMessage}
      >
        Agendar Mensagem
      </button>

      <h2 className="text-xl font-bold mt-6">Mensagens Agendadas</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">Nenhuma mensagem agendada</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="p-2 mt-2 border rounded">
            <p>{msg.content}</p>
            <p className="text-sm text-gray-500">Status: {msg.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BroadcastMessages;
