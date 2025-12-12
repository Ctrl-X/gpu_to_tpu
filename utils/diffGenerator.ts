import { diffLines } from 'diff';
import { DiffRow } from '../types';

export const generateDiffRows = (oldText: string, newText: string): DiffRow[] => {
  const changes = diffLines(oldText, newText, { newlineIsToken: false });
  const rows: DiffRow[] = [];

  let leftLineNum = 1;
  let rightLineNum = 1;

  // We need to iterate and align changes.
  // A simple strategy: Iterate changes. 
  // If removed, put on left. If added, put on right. 
  // If we have a block of removed followed by added (or vice versa), align them.

  let i = 0;
  while (i < changes.length) {
    const change = changes[i];

    if (!change.added && !change.removed) {
      // Unchanged
      const lines = change.value.split('\n');
      if (lines[lines.length - 1] === '') lines.pop(); // Remove trailing empty split

      for (const line of lines) {
        rows.push({
          left: { lineNumber: leftLineNum++, content: line, type: 'unchanged' },
          right: { lineNumber: rightLineNum++, content: line, type: 'unchanged' },
        });
      }
      i++;
    } else {
      // It's either added or removed.
      // Check if next change acts as a replacement (e.g., removed then added)
      const current = change;
      const next = i + 1 < changes.length ? changes[i + 1] : null;

      const isReplacement =
        (current.removed && next?.added) ||
        (current.added && next?.removed);

      if (isReplacement && next) {
        // Handle replacement block
        const removedChange = current.removed ? current : next;
        const addedChange = current.added ? current : next;

        const removedLines = removedChange.value.split('\n');
        if (removedLines[removedLines.length - 1] === '') removedLines.pop();

        const addedLines = addedChange.value.split('\n');
        if (addedLines[addedLines.length - 1] === '') addedLines.pop();

        const maxCount = Math.max(removedLines.length, addedLines.length);

        for (let j = 0; j < maxCount; j++) {
          const leftContent = removedLines[j];
          const rightContent = addedLines[j];

          rows.push({
            left: leftContent !== undefined
              ? { lineNumber: leftLineNum++, content: leftContent, type: 'removed' }
              : { lineNumber: null, content: '', type: 'empty' },
            right: rightContent !== undefined
              ? { lineNumber: rightLineNum++, content: rightContent, type: 'added' }
              : { lineNumber: null, content: '', type: 'empty' },
          });
        }
        i += 2; // Skip both
      } else {
        // Just one side changed (insertion or deletion without immediate replacement)
        const lines = change.value.split('\n');
        if (lines[lines.length - 1] === '') lines.pop();

        for (const line of lines) {
          if (change.removed) {
            rows.push({
              left: { lineNumber: leftLineNum++, content: line, type: 'removed' },
              right: { lineNumber: null, content: '', type: 'empty' },
            });
          } else {
            rows.push({
              left: { lineNumber: null, content: '', type: 'empty' },
              right: { lineNumber: rightLineNum++, content: line, type: 'added' },
            });
          }
        }
        i++;
      }
    }
  }

  return rows;
};