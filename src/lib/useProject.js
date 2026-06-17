import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'crit-prep-project-v1';

export const emptyProject = () => ({
  meta: {
    projectName: '',
    updatedAt: null,
  },
  intake: {
    oneLiner: '',
    brief: '',
    site: '',
    concept: '',
    format: 'pin-up', // pin-up | screen
    timeLimit: 12,
    level: '',
    progress: '',
    conceptNotes: '', // working notes when surfacing a concept
  },
  narrative: {
    arc: 'default',
    beats: {}, // keyed by beat label -> text
    throughLineFlags: '',
  },
  boards: {
    items: [
      { id: 'b1', job: '', anchor: '', support: '' },
      { id: 'b2', job: '', anchor: '', support: '' },
      { id: 'b3', job: '', anchor: '', support: '' },
    ],
    orthographics: [
      { id: 'o1', drawing: 'Site plan', type: 'site', scale: '', board: '', aligns: '' },
      { id: 'o2', drawing: 'Ground floor plan', type: 'plan', scale: '', board: '', aligns: '' },
      { id: 'o3', drawing: 'Section', type: 'section', scale: '', board: '', aligns: '' },
    ],
    checklist: {}, // index -> bool
  },
  script: {
    cues: [
      { id: 's1', time: '0:00', board: '1', text: '', cut: false },
    ],
    closingLine: '',
  },
  defense: {
    questions: [], // { id, cat, q, a }
    precedents: ['', ''],
    rejectedAlternative: '',
  },
});

// Migrate/merge a loaded object onto the current shape so older saves don't break.
function hydrate(loaded) {
  const base = emptyProject();
  if (!loaded || typeof loaded !== 'object') return base;
  return {
    ...base,
    ...loaded,
    meta: { ...base.meta, ...(loaded.meta || {}) },
    intake: { ...base.intake, ...(loaded.intake || {}) },
    narrative: { ...base.narrative, ...(loaded.narrative || {}) },
    boards: { ...base.boards, ...(loaded.boards || {}) },
    script: { ...base.script, ...(loaded.script || {}) },
    defense: { ...base.defense, ...(loaded.defense || {}) },
  };
}

export function useProject() {
  const [project, setProject] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? hydrate(JSON.parse(raw)) : emptyProject();
    } catch {
      return emptyProject();
    }
  });

  useEffect(() => {
    try {
      const toSave = { ...project, meta: { ...project.meta, updatedAt: Date.now() } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      /* storage may be unavailable; ignore */
    }
  }, [project]);

  // Update a top-level section by merging a partial.
  const patch = useCallback((section, partial) => {
    setProject((p) => ({ ...p, [section]: { ...p[section], ...partial } }));
  }, []);

  const reset = useCallback(() => setProject(emptyProject()), []);

  const load = useCallback((obj) => setProject(hydrate(obj)), []);

  return { project, setProject, patch, reset, load };
}
