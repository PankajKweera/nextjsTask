// server.js - JSON Server with sorting, filtering, pagination, and search
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/locations", (req, res) => {
  let locations = router.db.get("locations").value();
  const { _sort, _order = "asc", _page = 1, _limit = 5, q } = req.query;

  if (q) {
    locations = locations.filter(
      (loc) =>
        loc.name?.toLowerCase().includes(q.toLowerCase()) ||
        loc.code?.toLowerCase().includes(q.toLowerCase()) ||
        loc.country?.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (_sort && locations.length > 0) {
    locations = locations.sort((a, b) => {
      const valA = a[_sort]?.toString().toLowerCase() || "";
      const valB = b[_sort]?.toString().toLowerCase() || "";
      return _order === "desc" ? valB.localeCompare(valA) : valA.localeCompare(valB);
    });
  }

  const startIndex = (Number(_page) - 1) * Number(_limit);
  const paginatedResults = locations.slice(startIndex, startIndex + Number(_limit));

  res.setHeader("X-Total-Count", locations.length);
  res.json(paginatedResults);
});

server.use(router);
server.listen(5000, () => console.log("JSON Server running on port 5000"));
