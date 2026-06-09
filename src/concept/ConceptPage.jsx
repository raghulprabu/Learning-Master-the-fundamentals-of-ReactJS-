import React from 'react';
import './ConceptPage.css';
import {
  CodeBlock, AnalogyBox, PointList, FlowDiagram, ProsConsGrid,
  ComparisonGrid, MistakesList, RealWorldExamples, BestPractices,
  InterviewQA, FurtherReading
} from './Blocks';

/* Generic "section card" so every block of content (What is it?, Why
   used?, How it works…) renders with the same heading + card chrome. */
const Section = ({ icon, title, children }) => {
  if (!children) return null;
  return (
    <section className="concept-section">
      <div className="concept-card">
        <h2>{icon} {title}</h2>
        {children}
      </div>
    </section>
  );
};

/* Renders a "block of explanation": description paragraph(s), bullet
   points, an optional code sample and an optional real-world analogy.
   `whatIsIt`, `whyUsed`, `whenToUse`, `howItWorks` all share this shape. */
const Explanation = ({ data }) => {
  if (!data) return null;
  const paragraphs = Array.isArray(data.description) ? data.description : [data.description];
  return (
    <>
      {paragraphs.filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
      <PointList items={data.points} />
      {data.code && <CodeBlock title={data.code.title} code={data.code.snippet || data.code} />}
      {data.steps && (
        <ol style={{ paddingLeft: 22, color: '#374151', lineHeight: 1.8 }}>
          {data.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      )}
      <AnalogyBox icon={data.analogy?.icon} title={data.analogy?.title} text={data.analogy?.text} />
    </>
  );
};

/**
 * ConceptPage — the single template every learning topic is rendered through.
 * Feed it a structured `content` object (see src/content/*.js) and it lays
 * out a consistent zero-to-advanced explanation: what/why/when/how, a visual
 * flow diagram, real-world examples, pros & cons, common mistakes, best
 * practices and interview prep — matching the depth the rest of the app uses.
 */
const ConceptPage = ({ content }) => {
  if (!content) return null;
  const theme = content.theme || 'emerald';

  return (
    <div className={`concept-page theme-${theme}`}>
      <header className="concept-header">
        {content.icon && <div className="concept-icon">{content.icon}</div>}
        <h1>{content.title}</h1>
        {content.tagline && <p>{content.tagline}</p>}
        {content.meta && <span className="concept-meta">{content.meta}</span>}
      </header>

      <main className="concept-content">
        <Section icon="🤔" title="What is it?">
          <Explanation data={content.whatIsIt} />
        </Section>

        <Section icon="🎯" title="Why is it used?">
          <Explanation data={content.whyUsed} />
        </Section>

        <Section icon="🕐" title="When should you use it?">
          <Explanation data={content.whenToUse} />
        </Section>

        <Section icon="⚙️" title="How does it work?">
          <Explanation data={content.howItWorks} />
          <FlowDiagram title={content.flowDiagram?.title} steps={content.flowDiagram?.steps} />
        </Section>

        <Section icon="🚀" title="Real-world examples">
          {content.realWorldExamples?.intro && <p>{content.realWorldExamples.intro}</p>}
          <RealWorldExamples items={content.realWorldExamples?.items || content.realWorldExamples} />
        </Section>

        <Section icon="⚖️" title="Advantages & disadvantages">
          <ProsConsGrid pros={content.prosAndCons?.pros} cons={content.prosAndCons?.cons} />
        </Section>

        {content.comparison && (
          <Section icon="🔍" title={content.comparison.title || 'Before vs after'}>
            {content.comparison.intro && <p>{content.comparison.intro}</p>}
            <ComparisonGrid left={content.comparison.left} right={content.comparison.right} />
          </Section>
        )}

        <Section icon="🐞" title="Common mistakes">
          {content.commonMistakes?.intro && <p>{content.commonMistakes.intro}</p>}
          <MistakesList items={content.commonMistakes?.items || content.commonMistakes} />
        </Section>

        <Section icon="🏆" title="Best practices">
          <BestPractices items={content.bestPractices} />
        </Section>

        <Section icon="🎤" title="Interview questions">
          <InterviewQA items={content.interviewQuestions} />
        </Section>

        {content.summary && (
          <Section icon="📌" title="Summary">
            <Explanation data={content.summary} />
          </Section>
        )}

        <Section icon="📚" title="Further reading">
          <FurtherReading items={content.furtherReading} />
        </Section>
      </main>
    </div>
  );
};

export default ConceptPage;
