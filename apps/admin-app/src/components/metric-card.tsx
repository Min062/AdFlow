export function MetricCard(props: { label: string; value: string; hint?: string }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{props.label}</div>
      <div className="metric-value">{props.value}</div>
      {props.hint ? <div className="metric-hint">{props.hint}</div> : null}
    </div>
  );
}
