"""Render topology.json: Mermaid exports (call-graph, data-lineage, critical-path) and TOPOLOGY.html.

  python analysis/marush/render_map.py <path to topology-viewer.html template>
"""
import collections, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
t = json.loads((HERE / "topology.json").read_text(encoding="utf-8"))

domain_of, name_of, kind_of = {}, {}, {}
def walk(n, dom=None):
    if n.get("kind") == "domain":
        dom = n
    for c in n.get("children", []):
        walk(c, dom)
    if "children" not in n:
        domain_of[n["id"]] = dom
        name_of[n["id"]] = n["name"]
        kind_of[n["id"]] = n["kind"]
walk(t["root"])

def mid(s):
    return re.sub(r"\W", "_", s)

def label(s):
    return s.replace('"', "'")

# --- call-graph.mmd: domain level ---
agg = collections.Counter()
for e in t["edges"]:
    if e["kind"] in ("call", "dispatch"):
        a, b = domain_of[e["source"]], domain_of[e["target"]]
        if a["id"] != b["id"]:
            agg[(a["id"], b["id"], e["kind"])] += 1
entry_domains = collections.Counter(domain_of[n]["id"] for n in t["entryPoints"])
top = sorted(agg.items(), key=lambda kv: -kv[1])[:40]
doms = {d["id"]: d["name"] for d in t["root"]["children"]}
lines = ["graph TD"]
for did, name in doms.items():
    if did == "dom:data":
        continue
    ep = f" — {entry_domains[did]} entry points" if entry_domains[did] else ""
    lines.append(f'  {mid(did)}["{label(name)}{ep}"]')
for (a, b, k), n in top:
    arrow = "-->" if k == "call" else "-.->"
    lines.append(f"  {mid(a)} {arrow}|{n}| {mid(b)}")
lines.append("  classDef entry fill:#cc785c,color:#fff,stroke:#cc785c")
for did in doms:
    if entry_domains[did]:
        lines.append(f"  class {mid(did)} entry")
(HERE / "call-graph.mmd").write_text("\n".join(lines) + "\n", encoding="utf-8")

# --- data-lineage.mmd: programs to stores ---
lin = sorted({(e["source"], e["target"], e["kind"]) for e in t["edges"]
              if e["kind"] in ("read", "write") and e["target"].startswith("ds:")
              and "/Configurations/" not in e["source"] and "Migrations" not in e["source"]})
lines = ["graph LR"]
for nid in sorted({s for s, _, _ in lin} | {d for _, d, _ in lin}):
    shape = f'[("{label(name_of[nid])}")]' if nid.startswith("ds:") else f'["{label(name_of[nid])}"]'
    lines.append(f"  {mid(nid)}{shape}")
for s, d, k in lin[:40]:
    lines.append(f"  {mid(s)} {'==>|write|' if k == 'write' else '-.->|read|'} {mid(d)}")
lines.append(f"  %% {len(lin)} read/write edges ({min(len(lin), 40)} shown); EF configurations and migrations (schema owners) omitted")
(HERE / "data-lineage.mmd").write_text("\n".join(lines) + "\n", encoding="utf-8")

# --- critical-path.mmd: primary flow ---
flow = t["flows"][0]
lines = ["flowchart TD", f'  %% {flow["name"]} ({flow["persona"]}); no production telemetry, so no p50/p99']
prev = None
for i, s in enumerate(flow["steps"], 1):
    nodes = ", ".join(name_of[n] for n in s["nodes"])
    lines.append(f'  S{i}["{i}. {label(s["label"])}<br/><small>{label(nodes)}</small>"]')
    if prev:
        lines.append(f"  {prev} --> S{i}")
    prev = f"S{i}"
(HERE / "critical-path.mmd").write_text("\n".join(lines) + "\n", encoding="utf-8")

# --- TOPOLOGY.html from the plugin template ---
tpl_path = pathlib.Path(sys.argv[1])
tpl = tpl_path.read_text(encoding="utf-8")
marker = "/*__TOPOLOGY_DATA__*/ null"
assert marker in tpl, f"injection marker not found in {tpl_path}"
data = json.dumps(t, ensure_ascii=False)
# topology.json comes from untrusted source text: escape <, >, & so it cannot close the <script> block.
data = data.replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
(HERE / "TOPOLOGY.html").write_text(tpl.replace(marker, "/*__TOPOLOGY_DATA__*/ " + data), encoding="utf-8")
print("wrote call-graph.mmd, data-lineage.mmd, critical-path.mmd, TOPOLOGY.html")
