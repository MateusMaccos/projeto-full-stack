import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import BroadcastOnPersonalIcon from "@mui/icons-material/BroadcastOnPersonal";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  DocumentData,
  getDocs,
} from "firebase/firestore";
import { db } from "../../Services/Firebase";
import { useNavigate } from "react-router-dom";

interface Contato {
  id: number;
  nome: string;
  telefone: string;
}

interface Conexao {
  id: number;
  nome: string;
  contatos: Contato[];
}

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

const Menu = () => {
  const navigate = useNavigate();
  const [conexoes, setConexoes] = useState<Conexao[]>([]);
  const [novaConexao, setNovaConexao] = useState("");
  const [user, setUser] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const userData = await FetchUserData();
      if (userData) {
        const connectionsRef = collection(
          db,
          "users",
          userData!.id,
          "connections"
        );
        getDocs(connectionsRef).then((snapshot) => {
          if (snapshot.empty) return;
          let connectionId: number;

          snapshot.forEach((doc) => {
            const docData = doc.data();
            if (!conexoes.map((c) => c.nome).includes(docData.connectionName)) {
              const nova: Conexao = {
                id: Date.now(),
                nome: docData.connectionName,
                contatos: [],
              };
              connectionId = nova.id;
              setConexoes([...conexoes, nova]);
              setNovaConexao("");
            }
            conexoes.map((c) => {
              if (c.nome === docData.connectionName) {
                connectionId = c.id;
                if (
                  !c.contatos.map((c) => c.telefone).includes(docData.phone)
                ) {
                  adicionarContato(connectionId, docData.name, docData.phone);
                }
              }
            });
          });
        });
      }
      console.log(userData);
      setUser(userData);
      setLoading(false);
    };

    getUser();
  }, [conexoes]);

  const adicionarConexao = () => {
    if (!novaConexao.trim()) return;
    const nova: Conexao = {
      id: Date.now(),
      nome: novaConexao,
      contatos: [],
    };
    setConexoes([...conexoes, nova]);
    setNovaConexao("");
  };

  const removerConexao = (id: number) => {
    setConexoes(conexoes.filter((c) => c.id !== id));
  };

  const adicionarContato = (
    conexaoId: number,
    nome: string,
    telefone: string
  ) => {
    if (!nome.trim() || !telefone.trim()) return;

    setConexoes((prevConexoes) =>
      prevConexoes.map((conexao) =>
        conexao.id === conexaoId
          ? {
              ...conexao,
              contatos: [
                ...conexao.contatos,
                { id: Date.now(), nome, telefone },
              ],
            }
          : conexao
      )
    );
  };

  const removerContato = (conexaoId: number, contatoId: number) => {
    setConexoes((prevConexoes) =>
      prevConexoes.map((conexao) =>
        conexao.id === conexaoId
          ? {
              ...conexao,
              contatos: conexao.contatos.filter((c) => c.id !== contatoId),
            }
          : conexao
      )
    );
  };

  return !loading ? (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">
          Gerenciar Conexões - {user!.name}
        </h1>
        <div
          className="hover:cursor-pointer"
          onClick={() => navigate("/broadcast")}
        >
          <BroadcastOnPersonalIcon />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="text-black border p-2 flex-1 rounded bg-white placeholder-black"
          placeholder="Nome da Conexão"
          value={novaConexao}
          onChange={(e) => setNovaConexao(e.target.value)}
        />
        <button
          onClick={adicionarConexao}
          className="bg-[#9f6bf3] text-white px-4 py-2 rounded hover:cursor-pointer"
        >
          Adicionar
        </button>
      </div>

      {conexoes.map((conexao) => (
        <div key={conexao.id} className="border p-4 mb-4 rounded">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{conexao.nome}</h2>
            <button
              onClick={() => removerConexao(conexao.id)}
              className="text-red-500"
            >
              Remover
            </button>
          </div>

          <AdicionarContato
            conexao={conexao}
            user={user!}
            adicionarContato={adicionarContato}
          />

          {conexao.contatos.length > 0 && (
            <ul className="mt-2">
              {conexao.contatos.map((contato) => (
                <li
                  key={contato.id}
                  className="flex justify-between border-b py-2"
                >
                  <span>
                    {contato.nome} - {contato.telefone}
                  </span>
                  <button
                    onClick={() => removerContato(conexao.id, contato.id)}
                    className="text-red-500"
                  >
                    <DeleteIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-blue h-2.5 rounded-full w-3"></div>
    </div>
  );
};
const AdicionarContato = ({
  conexao,
  user,
  adicionarContato,
}: {
  conexao: Conexao;
  user: DocumentData;
  adicionarContato: (conexaoId: number, nome: string, telefone: string) => void;
}) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const handleAdicionar = async () => {
    adicionarContato(conexao.id, nome, telefone);
    try {
      const conexaoRef = await addDoc(
        collection(db, "users", user.id, "connections"),
        {
          name: nome,
          phone: telefone,
          connectionName: conexao.nome,
        }
      );
      console.log("Conexao id:", conexaoRef.id);
    } catch (error) {
      alert("Erro ao adicionar contato");
      console.log(error);
    }
    setNome("");
    setTelefone("");
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        placeholder="Nome"
        className="text-black border p-2 flex-1 rounded bg-white placeholder-black"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="text"
        placeholder="Telefone"
        className="text-black border p-2 flex-1 rounded bg-white placeholder-black"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />
      <button
        onClick={handleAdicionar}
        className="bg-green-500 text-black px-4 py-2 rounded"
      >
        +
      </button>
    </div>
  );
};

export default Menu;
