export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(404).json({ error: 'API endpoint not found' });
}
