const chart = `graph TD
A[Aerosolized Droplets] -->|"Gravity fall through chamber"| B[Neutral Air]`;
let processedChart = chart;
processedChart = processedChart.replace(/\("\s*([^"]+?)\s*"\)/g, '["$1"]');
processedChart = processedChart.replace(/--\s*"?([^"]+?)"?\s*-->/g, '-->|"$1"|');

const shapes = [
  { open: '\\[\\[', close: '\\]\\]', qOpen: '[["', qClose: '"]]' },
  { open: '\\(\\(', close: '\\)\\)', qOpen: '(("', qClose: '"))' },
  { open: '\\[', close: '\\]', qOpen: '["', qClose: '"]' },
  { open: '\\(', close: '\\)', qOpen: '("', qClose: '")' },
  { open: '\\{', close: '\\}', qOpen: '{"', qClose: '"}' },
];

shapes.forEach(({ open, close, qOpen, qClose }) => {
  const re = new RegExp(`([A-Za-z0-9\\-_]+)${open}([^\\r\\n\\[\\]\\(\\)\\{\\}]+?)${close}`, 'g');
  processedChart = processedChart.replace(re, (match, nodeId, label) => {
    const trimmed = label.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) return match;
    return `${nodeId}${qOpen}${trimmed.replace(/"/g, "'")}${qClose}`;
  });
});
console.log(processedChart);
