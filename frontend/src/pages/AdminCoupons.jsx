import { useEffect, useState } from "react";
import { createCoupon, getAllCoupons, deleteCoupon } from "../api";
import toast from "react-hot-toast";

export default function AdminCoupons() {
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: 10,
    minPurchase: 0,
    maxDiscount: 0,
    expiresAt: "",
    active: true,
    usageLimit: 0,
    oneTimePerUser: false,
  });

  const [coupons, setCoupons] = useState([]);

  const load = async () => {
    try {
      const res = await getAllCoupons();
      setCoupons(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    try {
      await createCoupon(form);
      toast.success("Coupon created");
      setForm({
        code: "",
        type: "percent",
        value: 10,
        minPurchase: 0,
        maxDiscount: 0,
        expiresAt: "",
        active: true,
        usageLimit: 0,
        oneTimePerUser: false,
      });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
      console.log(err);
    }
  };

  const remove = async (id) => {
    try {
      await deleteCoupon(id);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <h2>Admin — Coupons</h2>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ flex: 1, background: "white", padding: 16, borderRadius: 10 }}>
          <h3>Create Coupon</h3>

          <input placeholder="CODE" value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            style={input} />

          <select value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})} style={input}>
            <option value="percent">Percent</option>
            <option value="flat">Flat</option>
          </select>

          <input type="number" placeholder="Value" value={form.value}
            onChange={(e)=>setForm({...form, value: Number(e.target.value)})} style={input} />

          <input type="number" placeholder="Min Purchase" value={form.minPurchase}
            onChange={(e)=>setForm({...form, minPurchase: Number(e.target.value)})} style={input} />

          <input type="number" placeholder="Max Discount (0=no cap)" value={form.maxDiscount}
            onChange={(e)=>setForm({...form, maxDiscount: Number(e.target.value)})} style={input} />

          <input type="datetime-local" value={form.expiresAt}
            onChange={(e)=>setForm({...form, expiresAt: e.target.value})} style={input} />

          <input type="number" placeholder="Usage Limit (0 unlimited)" value={form.usageLimit}
            onChange={(e)=>setForm({...form, usageLimit: Number(e.target.value)})} style={input} />

          <label style={{display:"flex", gap:8, alignItems:"center"}}>
            <input type="checkbox" checked={form.oneTimePerUser}
              onChange={(e)=>setForm({...form, oneTimePerUser: e.target.checked})} />
            One-time per user
          </label>

          <label style={{display:"flex", gap:8, alignItems:"center"}}>
            <input type="checkbox" checked={form.active}
              onChange={(e)=>setForm({...form, active: e.target.checked})} />
            Active
          </label>

          <button style={btn} onClick={submit}>Create Coupon</button>
        </div>

        <div style={{ flex: 2 }}>
          <h3>Existing Coupons</h3>
          {coupons.map((c) => (
            <div key={c._id} style={{background:"white", padding:12, borderRadius:8, marginBottom:10}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <strong>{c.code}</strong> — {c.type === "percent" ? `${c.value}%` : `₹${c.value}`}
                  <div style={{opacity:0.8}}>
                    Min ₹{c.minPurchase} • Max discount ₹{c.maxDiscount || "∞"} • Uses: {c.usedCount}/{c.usageLimit || "∞"}
                  </div>
                  <div style={{opacity:0.8}}>Expires: {new Date(c.expiresAt).toLocaleString()}</div>
                </div>

                <div>
                  <button style={{...btn, background:"red"}} onClick={()=>remove(c._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 10,
};

const btn = {
  padding: "10px 14px",
  background: "#ff9900",
  border: "none",
  color: "white",
  borderRadius: 8,
  cursor: "pointer",
};
