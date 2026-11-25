import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });

  const loadProfile = async () => {
    const res = await getProfile();
    setUser(res.data);

    setForm({
      name: res.data.name,
      email: res.data.email,
      password: "",
      avatar: null,
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const update = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    if (form.password) fd.append("password", form.password);
    if (form.avatar) fd.append("avatar", form.avatar);

    const res = await updateProfile(fd);
    toast.success("Profile updated");
    setUser(res.data);
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h2>Your Profile</h2>

      <div style={box}>
        <img
          src={user.avatar || "https://via.placeholder.com/120"}
          alt="avatar"
          style={avatar}
        />

        <input
          type="file"
          onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
        />

        <input
          style={input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
        />

        <input
          style={input}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />

        <input
          style={input}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="New Password (optional)"
        />

        <button onClick={update} style={button}>
          Update Profile
        </button>
      </div>
    </div>
  );
}

const box = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  maxWidth: 500,
  marginTop: 20,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  margin: "8px 0",
};

const button = {
  width: "100%",
  padding: "10px",
  background: "black",
  color: "white",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  marginTop: 10,
};

const avatar = {
  width: 120,
  height: 120,
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: 15,
  border: "3px solid #eee",
};
