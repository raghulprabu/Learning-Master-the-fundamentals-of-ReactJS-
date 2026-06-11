import React from 'react';

/* Small, reusable, data-driven presentational pieces shared by every
   ConceptPage section. Keeping them here means each topic only has to
   provide content data — not hand-rolled markup. */

export const CodeBlock = ({ title, code, tone }) => {
  if (!code) return null;
  return (
    <div className={`code-block-wrap ${tone ? `tone-${tone}` : ''}`}>
      {title && <div className="code-block-title">{title}</div>}
      <pre className="code-block"><code>{code}</code></pre>
    </div>
  );
};

export const AnalogyBox = ({ icon = '💡', title = 'Real-World Analogy', text }) => {
  if (!text) return null;
  return (
    <div className="analogy-box">
      <div className="analogy-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
};

export const PointList = ({ items }) => {
  if (!items || !items.length) return null;
  return (
    <ul className="concept-points">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
};

export const FlowDiagram = ({ title, steps }) => {
  if (!steps || !steps.length) return null;
  return (
    <div className="flow-diagram">
      {title && <div className="flow-diagram-title">{title}</div>}
      <div className="flow-steps">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="flow-step">
              <div className="flow-step-icon">{step.icon}</div>
              <div className="flow-step-label">{step.label}</div>
              {step.note && <div className="flow-step-note">{step.note}</div>}
            </div>
            {i < steps.length - 1 && <div className="flow-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const ProsConsGrid = ({ pros, cons }) => {
  if (!pros && !cons) return null;
  return (
    <div className="pros-cons-grid">
      {pros && (
        <div className="pc-col pc-pros">
          <h4>✅ Advantages</h4>
          <ul>{pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      )}
      {cons && (
        <div className="pc-col pc-cons">
          <h4>⚠️ Disadvantages / Trade-offs</h4>
          <ul>{cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      )}
    </div>
  );
};

export const ComparisonGrid = ({ left, right }) => {
  if (!left && !right) return null;
  const Col = ({ data }) => (
    <div className={`comparison-col tone-${data.tone || 'neutral'}`}>
      <h4>{data.title}</h4>
      {data.code && <CodeBlock code={data.code} />}
      {data.note && <p className="comparison-note">{data.note}</p>}
    </div>
  );
  return (
    <div className="comparison-grid">
      {left && <Col data={left} />}
      {right && <Col data={right} />}
    </div>
  );
};

export const MistakesList = ({ items }) => {
  if (!items || !items.length) return null;
  return (
    <div className="mistakes-list">
      {items.map((m, i) => (
        <div className="mistake-card" key={i}>
          <h4>❌ {m.title}</h4>
          {(m.wrong || m.right) && (
            <div className="mistake-codes">
              {m.wrong && <CodeBlock title="Wrong" code={m.wrong} tone="bad" />}
              {m.right && <CodeBlock title="Better" code={m.right} tone="good" />}
            </div>
          )}
          {m.note && <p className="mistake-note">{m.note}</p>}
        </div>
      ))}
    </div>
  );
};

export const RealWorldExamples = ({ items }) => {
  if (!items || !items.length) return null;
  return (
    <div className="real-world-grid">
      {items.map((ex, i) => (
        <div className="real-world-card" key={i}>
          <div className="rw-icon">{ex.icon}</div>
          <h4>{ex.title}</h4>
          <p>{ex.description}</p>
          {ex.code && <CodeBlock code={ex.code} />}
        </div>
      ))}
    </div>
  );
};

export const BestPractices = ({ items }) => {
  if (!items || !items.length) return null;
  return (
    <ul className="best-practices">
      {items.map((b, i) => (
        <li key={i}><span className="bp-check">✅</span><span>{b}</span></li>
      ))}
    </ul>
  );
};

export const InterviewQA = ({ items }) => {
  if (!items || !items.length) return null;
  return (
    <div className="interview-qa">
      {items.map((qa, i) => (
        <details className="qa-item" key={i}>
          <summary>{qa.q}</summary>
          <p>{qa.a}</p>
        </details>
      ))}
    </div>
  );
};

export const FurtherReading = ({ items }) => {
  if (!items || !items.length) return null;
  return (
    <ul className="further-reading">
      {items.map((r, i) => (
        <li key={i}><strong>{r.label}:</strong> {r.note}</li>
      ))}
    </ul>
  );
};
