import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { loginMember, loginAdmin } from "../../services/authService";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import gymBackground from '../../assets/images/9.jpeg';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setIsLoading(true);

    try {
      let res;
      if (role === "member") {
        res = await loginMember({ email: emailOrUsername, password });
      } else {
        res = await loginAdmin({ username: emailOrUsername, password });
      }

      // res harus return { token, role, user }
      login(res);

      if (res.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/member", { replace: true });
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Login gagal, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${gymBackground})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }}>
      <Card style={{
        width: "100%", maxWidth: 380, padding: 25,
        backgroundColor: "rgba(0, 0, 0, 0.7)", borderRadius: 15,
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)", color: "#f8f9fa"
      }}>
        <h3 className="text-center mb-3 text-info">FitHub — Login</h3>
        {err && <Alert variant="danger" className="text-center">{err}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Email / Username</Form.Label>
            <Form.Control
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder={role === "member" ? "Masukkan email" : "Masukkan username"}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Login sebagai</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
          <Button type="submit" className="w-100 mb-3" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>
        </Form>
        <div className="text-center mt-3 text-white-50">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          <hr />
          <Link to="/">Kembali ke Beranda</Link>
        </div>
      </Card>
    </div>
  );
}
