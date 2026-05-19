import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  Calendar,
  Activity,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  FileText,
  Trash2,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

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

const appId =
  typeof __app_id !== "undefined" && __app_id ? __app_id : "kap-zdravlja-app";

type TerminStatus = "Zakazano" | "Završeno" | "Otkazano";

type Termin = {
  id: string;
  pacijent: string;
  telefon: string;
  usluga: string;
  datum: string;
  vreme: string;
  adresa: string;
  terenski: boolean;
  napomena: string;
  saglasnost: boolean;
  status: TerminStatus;
};

type FormData = {
  pacijent: string;
  telefon: string;
  usluga: string;
  datum: string;
  vreme: string;
  adresa: string;
  terenski: boolean;
  napomena: string;
  saglasnost: boolean;
};

type Toast = {
  show: boolean;
  message: string;
  type: "success" | "error" | "";
};

const initialFormData: FormData = {
  pacijent: "",
  telefon: "",
  usluga: "Vitaminska bomba",
  datum: "",
  vreme: "",
  adresa: "",
  terenski: false,
  napomena: "",
  saglasnost: false,
};

const App = () => {
  const [activeTab, setActiveTab] = useState<"zakazi" | "lista" | "usluge">(
    "zakazi"
  );
  const [showQrModal, setShowQrModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [termini, setTermini] = useState<Termin[]>([]);
  const [filter, setFilter] = useState<
    "Aktivni" | "Završeni" | "Otkazani" | "Svi"
  >("Aktivni");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [toast, setToast] = useState<Toast>({
    show: false,
    message: "",
    type: "",
  });

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
        showToast(
          "Firebase anonymous login nije uključen ili nije podešen.",
          "error"
        );
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const terminiRef = collection(
      db,
      "artifacts",
      appId,
      "users",
      user.uid,
      "termini"
    );

    const unsubscribe = onSnapshot(
      terminiRef,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Termin[];

        setTermini(data);
      },
      (error) => {
        console.error("Firestore greška:", error);
        showToast("Proveri Firestore pravila u Firebase konzoli.", "error");
      }
    );

    return () => unsubscribe();
  }, [user]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleCreateTermin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      showToast("Korisnik još nije učitan. Sačekaj par sekundi.", "error");
      return;
    }

    if (!formData.pacijent.trim()) {
      showToast("Unesi ime pacijenta.", "error");
      return;
    }

    if (!formData.telefon.trim()) {
      showToast("Unesi broj telefona.", "error");
      return;
    }

    if (!formData.datum) {
      showToast("Izaberi datum.", "error");
      return;
    }

    if (!formData.vreme) {
      showToast("Izaberi vreme.", "error");
      return;
    }

    if (!formData.saglasnost) {
      showToast("Potrebna je saglasnost pacijenta.", "error");
      return;
    }

    try {
      await addDoc(
        collection(db, "artifacts", appId, "users", user.uid, "termini"),
        {
          ...formData,
          status: "Zakazano",
        }
      );

      setFormData(initialFormData);
      showToast("Termin je uspešno zakazan.", "success");
      setActiveTab("lista");
    } catch (error) {
      console.error("Greška pri zakazivanju:", error);
      showToast("Termin nije sačuvan. Proveri Firebase.", "error");
    }
  };

  const updateStatus = async (terminId: string, status: TerminStatus) => {
    if (!user) return;

    try {
      await updateDoc(
        doc(db, "artifacts", appId, "users", user.uid, "termini", terminId),
        { status }
      );

      showToast(`Status promenjen: ${status}`, "success");
    } catch (error) {
      console.error("Greška pri promeni statusa:", error);
      showToast("Status nije promenjen.", "error");
    }
  };

  const removeTermin = async (terminId: string) => {
    if (!user) return;

    try {
      await deleteDoc(
        doc(db, "artifacts", appId, "users", user.uid, "termini", terminId)
      );

      showToast("Termin je obrisan.", "success");
    } catch (error) {
      console.error("Greška pri brisanju:", error);
      showToast("Termin nije obrisan.", "error");
    }
  };

  const filteredTermini = termini.filter((termin) => {
    if (filter === "Svi") return true;
    if (filter === "Aktivni") return termin.status === "Zakazano";
    if (filter === "Završeni") return termin.status === "Završeno";
    if (filter === "Otkazani") return termin.status === "Otkazano";
    return true;
  });

  const renderZakazi = () => (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.titleRow}>
          <div>
            <p style={styles.kicker}>Kap Zdravlja</p>
            <h2 style={styles.title}>Novi termin</h2>
          </div>
          <PlusCircle color="#2563eb" />
        </div>

        <form onSubmit={handleCreateTermin} style={styles.form}>
          <input
            type="text"
            placeholder="Ime pacijenta"
            value={formData.pacijent}
            onChange={(e) =>
              setFormData({ ...formData, pacijent: e.target.value })
            }
            style={styles.input}
          />

          <input
            type="tel"
            placeholder="Telefon"
            value={formData.telefon}
            onChange={(e) =>
              setFormData({ ...formData, telefon: e.target.value })
            }
            style={styles.input}
          />

          <select
            value={formData.usluga}
            onChange={(e) =>
              setFormData({ ...formData, usluga: e.target.value })
            }
            style={styles.input}
          >
            <option>Vitaminska bomba</option>
            <option>Infuzija</option>
            <option>Injekcija</option>
            <option>Glutation 12000</option>
          </select>

          <div style={styles.gridTwo}>
            <input
              type="date"
              value={formData.datum}
              onChange={(e) =>
                setFormData({ ...formData, datum: e.target.value })
              }
              style={styles.input}
            />

            <input
              type="time"
              value={formData.vreme}
              onChange={(e) =>
                setFormData({ ...formData, vreme: e.target.value })
              }
              style={styles.input}
            />
          </div>

          <input
            type="text"
            placeholder="Adresa"
            value={formData.adresa}
            onChange={(e) =>
              setFormData({ ...formData, adresa: e.target.value })
            }
            style={styles.input}
          />

          <textarea
            placeholder="Napomena"
            value={formData.napomena}
            onChange={(e) =>
              setFormData({ ...formData, napomena: e.target.value })
            }
            style={{ ...styles.input, minHeight: 80 }}
          />

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={formData.terenski}
              onChange={(e) =>
                setFormData({ ...formData, terenski: e.target.checked })
              }
            />
            Terenska poseta
          </label>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={formData.saglasnost}
              onChange={(e) =>
                setFormData({ ...formData, saglasnost: e.target.checked })
              }
            />
            Pacijent je dao saglasnost
          </label>

          <button type="submit" style={styles.primaryButton}>
            Zakaži
          </button>
        </form>
      </div>
    </div>
  );

  const renderLista = () => (
    <div style={styles.page}>
      <div style={styles.titleRow}>
        <div>
          <p style={styles.kicker}>Pregled</p>
          <h2 style={styles.title}>Lista termina</h2>
        </div>
        <Calendar color="#2563eb" />
      </div>

      <div style={styles.filterRow}>
        {(["Aktivni", "Završeni", "Otkazani", "Svi"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            style={{
              ...styles.filterButton,
              ...(filter === item ? styles.filterButtonActive : {}),
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredTermini.length === 0 ? (
        <div style={styles.emptyCard}>
          <Calendar color="#2563eb" />
          <p>Nema termina za ovaj filter.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filteredTermini.map((termin) => (
            <div key={termin.id} style={styles.terminCard}>
              <div style={styles.terminHeader}>
                <div>
                  <h3 style={styles.terminName}>{termin.pacijent}</h3>
                  <p style={styles.terminService}>{termin.usluga}</p>
                </div>
                <span style={styles.badge}>{termin.status}</span>
              </div>

              <p style={styles.infoLine}>
                <Calendar size={16} /> {termin.datum} u {termin.vreme}
              </p>

              <p style={styles.infoLine}>
                <Phone size={16} /> {termin.telefon}
              </p>

              {termin.adresa && (
                <p style={styles.infoLine}>
                  <MapPin size={16} /> {termin.adresa}
                </p>
              )}

              {termin.napomena && <p style={styles.note}>{termin.napomena}</p>}

              <div style={styles.actionRow}>
                <button
                  style={styles.smallButton}
                  onClick={() => updateStatus(termin.id, "Završeno")}
                >
                  <CheckCircle2 size={16} /> Završeno
                </button>

                <button
                  style={styles.smallButton}
                  onClick={() => updateStatus(termin.id, "Otkazano")}
                >
                  <XCircle size={16} /> Otkaži
                </button>

                <button
                  style={styles.deleteButton}
                  onClick={() => removeTermin(termin.id)}
                >
                  <Trash2 size={16} /> Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUsluge = () => (
    <div style={styles.page}>
      <div style={styles.titleRow}>
        <div>
          <p style={styles.kicker}>Cenovnik</p>
          <h2 style={styles.title}>Usluge</h2>
        </div>
        <Activity color="#2563eb" />
      </div>

      <div style={styles.list}>
        {[
          ["Vitaminska bomba", "od 3000 RSD"],
          ["Infuzija", "od 2500 RSD"],
          ["Injekcija", "od 1000 RSD"],
          ["Glutation 12000", "cena po dogovoru"],
        ].map(([name, price]) => (
          <div key={name} style={styles.serviceCard}>
            <div>
              <h3 style={styles.terminName}>{name}</h3>
              <p style={styles.terminService}>Medicinska usluga</p>
            </div>
            <strong style={{ color: "#2563eb" }}>{price}</strong>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.appBackground}>
      <div style={styles.phoneShell}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>Privatna praksa</p>
            <h1 style={styles.headerTitle}>Kap Zdravlja</h1>
          </div>

          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            style={styles.iconButton}
          >
            <FileText />
          </button>
        </header>

        <main style={styles.main}>
          {activeTab === "zakazi" && renderZakazi()}
          {activeTab === "lista" && renderLista()}
          {activeTab === "usluge" && renderUsluge()}
        </main>

        <nav style={styles.bottomNav}>
          <button
            type="button"
            onClick={() => setActiveTab("lista")}
            style={styles.navButton}
          >
            <Calendar />
            <span>Termini</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("zakazi")}
            style={styles.addButton}
          >
            <PlusCircle />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("usluge")}
            style={styles.navButton}
          >
            <Activity />
            <span>Usluge</span>
          </button>
        </nav>

        {toast.show && (
          <div
            style={{
              ...styles.toast,
              background: toast.type === "error" ? "#dc2626" : "#16a34a",
            }}
          >
            {toast.message}
          </div>
        )}

        {showQrModal && (
          <div
            style={styles.modalBackdrop}
            onClick={() => setShowQrModal(false)}
          >
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <FileText size={44} color="#2563eb" />
              <h2>Kap Zdravlja</h2>
              <p style={{ color: "#64748b" }}>
                Ovde kasnije može da ide QR kod, PDF saglasnost ili dokument za
                pacijenta.
              </p>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                style={styles.primaryButton}
              >
                Zatvori
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  appBackground: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef4ff, #f8fafc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#0f172a",
  },
  phoneShell: {
    width: "100%",
    maxWidth: 430,
    height: "92vh",
    minHeight: 650,
    background: "#f8fafc",
    borderRadius: 28,
    boxShadow: "0 25px 80px rgba(15, 23, 42, 0.22)",
    overflow: "hidden",
    position: "relative",
    border: "1px solid #dbe3ef",
  },
  header: {
    height: 88,
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
  },
  kicker: {
    margin: "0 0 4px",
    fontSize: 12,
    color: "#64748b",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  iconButton: {
    width: 44,
    height: 44,
    border: 0,
    borderRadius: 14,
    background: "#eaf2ff",
    color: "#2563eb",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  main: {
    height: "calc(100% - 170px)",
    overflowY: "auto",
  },
  page: {
    padding: 18,
    paddingBottom: 28,
  },
  card: {
    background: "#ffffff",
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    padding: 20,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 900,
  },
  form: {
    display: "grid",
    gap: 12,
  },
  input: {
    width: "100%",
    border: "1px solid #dbe3ef",
    borderRadius: 15,
    padding: "13px 14px",
    background: "#f8fafc",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontWeight: 700,
    color: "#334155",
    fontSize: 14,
  },
  primaryButton: {
    width: "100%",
    border: 0,
    borderRadius: 16,
    padding: "14px 18px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    marginBottom: 16,
  },
  filterButton: {
    border: "1px solid #dbe3ef",
    background: "#ffffff",
    color: "#334155",
    borderRadius: 999,
    padding: "9px 13px",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  filterButtonActive: {
    background: "#2563eb",
    color: "#ffffff",
    borderColor: "#2563eb",
  },
  list: {
    display: "grid",
    gap: 13,
  },
  emptyCard: {
    minHeight: 230,
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: 24,
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    color: "#64748b",
    fontWeight: 700,
  },
  terminCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    padding: 16,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  },
  terminHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  terminName: {
    margin: "0 0 4px",
    fontSize: 17,
    fontWeight: 900,
  },
  terminService: {
    margin: 0,
    color: "#64748b",
    fontWeight: 700,
    fontSize: 14,
  },
  badge: {
    borderRadius: 999,
    padding: "6px 9px",
    background: "#eaf2ff",
    color: "#2563eb",
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  infoLine: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#475569",
    margin: "8px 0",
    fontWeight: 700,
    fontSize: 14,
  },
  note: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 10,
    color: "#475569",
  },
  actionRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 14,
  },
  smallButton: {
    border: "1px solid #dbe3ef",
    background: "#ffffff",
    borderRadius: 13,
    padding: 9,
    color: "#334155",
    fontWeight: 900,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  deleteButton: {
    gridColumn: "span 2",
    border: "1px solid #fecaca",
    background: "#fff5f5",
    borderRadius: 13,
    padding: 9,
    color: "#b91c1c",
    fontWeight: 900,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  serviceCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  bottomNav: {
    height: 82,
    background: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px 18px",
  },
  navButton: {
    border: 0,
    background: "transparent",
    color: "#64748b",
    display: "grid",
    justifyItems: "center",
    gap: 4,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 900,
  },
  addButton: {
    width: 62,
    height: 62,
    border: 0,
    borderRadius: 22,
    background: "#2563eb",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.25)",
  },
  toast: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 94,
    padding: "14px 16px",
    borderRadius: 17,
    color: "#ffffff",
    fontWeight: 900,
    zIndex: 20,
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.18)",
  },
  modalBackdrop: {
    position: "absolute",
    inset: 0,
    background: "rgba(15, 23, 42, 0.52)",
    display: "grid",
    placeItems: "center",
    padding: 22,
    zIndex: 30,
  },
  modal: {
    background: "#ffffff",
    borderRadius: 28,
    padding: 24,
    textAlign: "center",
    boxShadow: "0 22px 65px rgba(15, 23, 42, 0.32)",
  },
};

export default App;
