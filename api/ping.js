module.exports = async function handler(req, res) {
  res.setHeader('content-type', 'application/json')
  res.statusCode = 200
  return res.end(JSON.stringify({ ok: true, now: new Date().toISOString() }))
}
