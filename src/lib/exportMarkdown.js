import { ARCS } from '../data/content.js';

const orDash = (v) => (v && String(v).trim() ? v : '—');

// Renders the project into the crit-prep-template.md structure from the skill.
export function projectToMarkdown(project) {
  const { intake, narrative, boards, script, defense, meta } = project;
  const name = meta.projectName?.trim() || 'Untitled Project';
  const arc = ARCS.find((a) => a.id === narrative.arc) || ARCS[0];

  const L = [];
  L.push(`# Crit Prep — ${name}`);
  L.push('');

  // 1. one-liner
  L.push('## 1. The one-liner');
  L.push('The whole project in one sentence a non-architect would understand:');
  L.push('');
  L.push(`> ${orDash(intake.oneLiner)}`);
  L.push('');

  // 2. basics
  L.push('## 2. Project basics');
  L.push(`- **Brief / program:** ${orDash(intake.brief)}`);
  L.push(`- **Site:** ${orDash(intake.site)}`);
  L.push(`- **Concept / big idea:** ${orDash(intake.concept)}`);
  L.push(
    `- **Crit format:** ${orDash(intake.format)} — **Time limit:** ${orDash(intake.timeLimit)} min — **Level:** ${orDash(intake.level)}`
  );
  if (intake.progress?.trim()) L.push(`- **Where it’s at:** ${intake.progress}`);
  L.push('');

  // 3. narrative spine
  L.push('## 3. Narrative spine');
  L.push(`Chosen arc: **${arc.name}**`);
  L.push('');
  L.push('| Beat | What I say here |');
  L.push('|---|---|');
  arc.beats.forEach(([label]) => {
    L.push(`| ${label} | ${orDash(narrative.beats[label])} |`);
  });
  L.push('');
  L.push('Through-line check — beats that don’t yet trace back to the concept:');
  L.push('');
  L.push(`> ${orDash(narrative.throughLineFlags)}`);
  L.push('');

  // 4. board plan
  L.push('## 4. Board plan');
  L.push('One idea per board. Biggest drawing = most important point.');
  L.push('');
  L.push('| Board | Job in the story | Anchor drawing(s) | Supporting material |');
  L.push('|---|---|---|---|');
  boards.items.forEach((b, i) => {
    L.push(`| ${i + 1} | ${orDash(b.job)} | ${orDash(b.anchor)} | ${orDash(b.support)} |`);
  });
  L.push('');
  L.push('### Orthographic set — ordered broad to fine');
  L.push('| Drawing | Type | Scale | Board | Aligns with |');
  L.push('|---|---|---|---|---|');
  boards.orthographics.forEach((o) => {
    L.push(
      `| ${orDash(o.drawing)} | ${orDash(o.type)} | ${orDash(o.scale)} | ${orDash(o.board)} | ${orDash(o.aligns)} |`
    );
  });
  L.push('');

  // 5. script
  L.push('## 5. Speaking script');
  L.push('Paced to the time limit. `[CUT]` marks lines that can be dropped live if running over.');
  L.push('');
  L.push('```');
  script.cues.forEach((c) => {
    L.push(`[${c.time || '—'} — Board ${c.board || '—'}]${c.cut ? ' [CUT]' : ''}`);
    L.push(c.text?.trim() ? c.text.trim() : '');
    L.push('');
  });
  L.push('```');
  L.push('');
  L.push('Closing line (restates what the project proves):');
  L.push('');
  L.push(`> ${orDash(script.closingLine)}`);
  L.push('');

  // 6. defense
  L.push('## 6. Defense drill');
  L.push('The questions I least want to be asked, with my acknowledge → reason → tie-back answer:');
  L.push('');
  if (defense.questions.length === 0) {
    L.push('_(none added yet)_');
  } else {
    defense.questions.forEach((qq, i) => {
      L.push(`${i + 1}. **Q (${orDash(qq.cat)}):** ${orDash(qq.q)}`);
      L.push(`   **A:** ${orDash(qq.a)}`);
    });
  }
  L.push('');
  L.push('Precedents I can name and what I took from each:');
  defense.precedents.forEach((p) => L.push(`- ${orDash(p)}`));
  L.push('');
  L.push('The obvious alternative I rejected, and why:');
  L.push(`> ${orDash(defense.rejectedAlternative)}`);
  L.push('');

  return L.join('\n');
}

export function downloadMarkdown(project) {
  const md = projectToMarkdown(project);
  const safe = (project.meta.projectName || 'crit-prep').trim().replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safe || 'crit-prep'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
