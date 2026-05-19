import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  FileText,
  ChevronRight,
  Trash2,
  Share2,
  Download,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : {
        apiKey: "AIzaSyAExX8zutm-Ds6fvtpMeFktC-LhaCPpZbo",
        authDomain: "kapzdravlja.firebaseapp.com",
        projectId: "kapzdravlja",
        storageBucket: "kapzdravlja.firebasestorage.app",
        messagingSenderId: "581368970579",
        appId: "1:581368970579:web:173d14dda26fb3da13b5a6",
        measurementId: "G-7ZDG79KQ6R",
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

const App = () => {
  const [activeTab, setActiveTab] = useState("zakazi");
  const [showQrModal, setShowQrModal] = useState(false);
  const [user, setUser] = useState(null);
  const [termini, setTermini] = useState([]);
  const [filter, setFilter] = useState("Aktivni");
  const [formData, setFormData] = useState({
    pacijent: "",
    telefon: "",
    usluga: "Vitaminska bomba",
    datum: "",
    vreme: "",
    adresa: "",
    terenski: false,
    napomena: "",
    saglasnost: false,
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth greška:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, "artifacts", appId, "users", user.uid, "termini");
    return onSnapshot(q, (snapshot) => {
      setTermini(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, [user]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const renderZakazi = () => (
    <div className="p-4 pb-24">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold mb-4">Novi termin</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!formData.saglasnost)
              return showToast("Potrebna saglasnost!", "error");
            await addDoc(
              collection(db, "artifacts", appId, "users", user.uid, "termini"),
              { ...formData, status: "Zakazano" }
            );
            showToast("Zakazano!", "success");
            setActiveTab("lista");
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Ime pacijenta"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, pacijent: e.target.value })
            }
          />
          <input
            type="date"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, datum: e.target.value })
            }
          />
          <input
            type="time"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, vreme: e.target.value })
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              onChange={(e) =>
                setFormData({ ...formData, saglasnost: e.target.checked })
              }
            />
            Pravna saglasnost
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            Zakazi
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] relative">
        <header className="p-5 border-b flex justify-between items-center">
          <h1 className="text-xl font-black">Kap Zdravlja</h1>
          <button onClick={() => setShowQrModal(true)}>
            <FileText />
          </button>
        </header>
        <main>
          {activeTab === "zakazi" ? (
            renderZakazi()
          ) : (
            <p className="p-5">Lista termina ovde...</p>
          )}
        </main>
        <nav className="absolute bottom-0 w-full flex justify-around p-4 bg-white border-t">
          <button onClick={() => setActiveTab("lista")}>
            <Calendar />
          </button>
          <button onClick={() => setActiveTab("zakazi")}>
            <PlusCircle className="w-10 h-10 text-blue-600" />
          </button>
          <button onClick={() => setActiveTab("usluge")}>
            <Activity />
          </button>
        </nav>
      </div>
    </div>
  );
};
