import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "../components/form-field";
import { useAuth } from "../contexts/auth-context";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(email, password, confirmPassword);
      navigate("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h1>AdStream 회원가입</h1>
        <p className="muted">사이트를 등록하고 SDK를 발급받을 수 있습니다.</p>
        <FormField label="이메일">
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormField>
        <FormField label="비밀번호" hint="최소 6자">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </FormField>
        <FormField label="비밀번호 확인">
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </FormField>
        {error ? <div className="error-banner">{error}</div> : null}
        <button className="button button-primary" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
        <div className="muted small">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </div>
      </form>
    </div>
  );
}
