import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "../components/form-field";
import { useAuth } from "../contexts/auth-context";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("gggum999@gmail.com");
  const [password, setPassword] = React.useState("Lee50925092@");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h1>AdStream 로그인</h1>
        <p className="muted">이메일과 비밀번호로 관리자 대시보드에 접근합니다.</p>
        <FormField label="이메일">
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormField>
        <FormField label="비밀번호">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </FormField>
        {error ? <div className="error-banner">{error}</div> : null}
        <button className="button button-primary" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
        <div className="muted small">
          계정이 없나요? <Link to="/signup">회원가입</Link>
        </div>
      </form>
    </div>
  );
}
