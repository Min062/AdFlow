import React from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { FormField } from "../components/form-field";

export function AdCreatePage() {
  const navigate = useNavigate();
  const today = new Date();
  const oneMonthLater = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const [form, setForm] = React.useState({
    title: "",
    imageUrl: "https://dummyimage.com/640x360/111827/ffffff&text=AdStream+Creative",
    clickUrl: "https://example.com",
    isActive: true,
    startAt: today.toISOString().slice(0, 16),
    endAt: oneMonthLater.toISOString().slice(0, 16),
    targetType: "all"
  });
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      await apiRequest("/api/ads", {
        method: "POST",
        body: {
          ...form,
          startAt: new Date(form.startAt).toISOString(),
          endAt: new Date(form.endAt).toISOString()
        }
      });
      navigate("/ads");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "광고 생성 실패");
    }
  }

  return (
    <div className="page-shell narrow">
      <div className="page-header">
        <div>
          <h1>광고 등록</h1>
          <p className="muted">MVP에서는 내부 운영자가 광고 데이터를 직접 추가합니다.</p>
        </div>
      </div>
      <form className="card form-grid" onSubmit={onSubmit}>
        <FormField label="광고 제목">
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </FormField>
        <FormField label="이미지 URL">
          <input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
        </FormField>
        <FormField label="클릭 URL">
          <input value={form.clickUrl} onChange={(event) => setForm({ ...form, clickUrl: event.target.value })} />
        </FormField>
        <div className="two-column">
          <FormField label="시작 시각">
            <input type="datetime-local" value={form.startAt} onChange={(event) => setForm({ ...form, startAt: event.target.value })} />
          </FormField>
          <FormField label="종료 시각">
            <input type="datetime-local" value={form.endAt} onChange={(event) => setForm({ ...form, endAt: event.target.value })} />
          </FormField>
        </div>
        <label className="checkbox-row">
          <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
          <span>즉시 활성화</span>
        </label>
        {error ? <div className="error-banner">{error}</div> : null}
        <button className="button button-primary">광고 생성</button>
      </form>
    </div>
  );
}
