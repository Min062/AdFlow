import React from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { FormField } from "../components/form-field";
import type { Site } from "../types/api";

export function SiteCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    name: "",
    domain: "",
    description: "",
    revenueSharePercentForPublisher: 70,
    adstreamFeePercent: 30
  });
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      const data = await apiRequest<{ site: Site }>("/api/sites", {
        method: "POST",
        body: form
      });
      navigate(`/sites/${data.site.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "사이트 생성 실패");
    }
  }

  return (
    <div className="page-shell narrow">
      <div className="page-header">
        <div>
          <h1>사이트 등록</h1>
          <p className="muted">AdStream SDK를 붙일 퍼블리셔 사이트를 생성합니다.</p>
        </div>
      </div>
      <form className="card form-grid" onSubmit={onSubmit}>
        <FormField label="사이트 이름">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </FormField>
        <FormField label="도메인">
          <input value={form.domain} onChange={(event) => setForm({ ...form, domain: event.target.value })} />
        </FormField>
        <FormField label="설명">
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </FormField>
        <div className="two-column">
          <FormField label="퍼블리셔 몫(%)">
            <input
              type="number"
              value={form.revenueSharePercentForPublisher}
              onChange={(event) => setForm({ ...form, revenueSharePercentForPublisher: Number(event.target.value) })}
            />
          </FormField>
          <FormField label="AdStream 수수료(%)">
            <input
              type="number"
              value={form.adstreamFeePercent}
              onChange={(event) => setForm({ ...form, adstreamFeePercent: Number(event.target.value) })}
            />
          </FormField>
        </div>
        {error ? <div className="error-banner">{error}</div> : null}
        <button className="button button-primary">생성하기</button>
      </form>
    </div>
  );
}
