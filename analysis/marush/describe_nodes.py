"""Build description packets for the largest topology nodes, and merge the paragraphs back.

  python analysis/marush/describe_nodes.py packets <out_dir> [count=40]
      writes <out_dir>/NN.txt (one packet per node) and <out_dir>/index.json
  python analysis/marush/describe_nodes.py check <out_dir> <descriptions.json>
      descriptions.json: {"NN": "paragraph", ...}; prints the paragraphs that fail the check
  python analysis/marush/describe_nodes.py merge <out_dir> <descriptions.json>
      merges paragraphs that pass the check into topology.json (failures are skipped)

Check: every number and identifier-like token in a paragraph must occur in its packet,
and the paragraph must be 55-90 words.
"""
import json, re, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1] / "legacy" / "marush"
TOPO = HERE / "topology.json"

def nodes(t):
    out = {}
    def walk(n, dom=None):
        if n.get("kind") == "domain":
            dom = n["name"]
        if "children" in n:
            for c in n["children"]:
                walk(c, dom)
        else:
            out[n["id"]] = (n, dom)
    walk(t["root"])
    return out

def short(nid, all_nodes):
    n = all_nodes.get(nid, ({"name": nid}, None))[0]
    return n["name"]

def packets(out_dir, count):
    t = json.loads(TOPO.read_text(encoding="utf-8"))
    alln = nodes(t)
    code = [(n["loc"], nid) for nid, (n, _) in alln.items() if n.get("kind") != "datastore" and n.get("file")]
    chosen = [nid for _, nid in sorted(code, reverse=True)[:count]]
    out_dir.mkdir(parents=True, exist_ok=True)
    index = {}
    for i, nid in enumerate(chosen, 1):
        n, dom = alln[nid]
        path = ROOT / n["file"]
        if path.is_dir():
            srcs = sorted(p for p in path.rglob("*") if p.is_file())[:4]
            text = "\n".join(f"// file: {p.relative_to(ROOT).as_posix()}\n" + p.read_text(encoding="utf-8-sig", errors="ignore") for p in srcs)
        else:
            text = path.read_text(encoding="utf-8-sig", errors="ignore")
        lines = text.splitlines()
        header = "\n".join(l for l in lines[:15] if l.strip().startswith(("//", "/*", "*", "///", "#")))
        outgoing = sorted({f"{e['kind']} -> {short(e['target'], alln)}" for e in t["edges"] if e["source"] == nid})
        incoming = sorted({f"{e['kind']} <- {short(e['source'], alln)}" for e in t["edges"] if e["target"] == nid})
        flows = [f["name"] for f in t["flows"] if any(nid in s["nodes"] for s in f["steps"])]
        packet = (f"NODE: {n['name']}\nFILE: {n['file']}\nKIND: {n['kind']}  LANGUAGE: {n.get('language')}  LOC: {n['loc']}\n"
                  f"DOMAIN: {dom}\nENTRY POINT: {nid in t['entryPoints']}\nFLOWS: {', '.join(flows) or 'none'}\n"
                  f"HEADER COMMENT:\n{header or '(none)'}\n"
                  f"OUTGOING ({len(outgoing)}):\n" + "\n".join(outgoing[:40]) +
                  f"\nINCOMING ({len(incoming)}):\n" + "\n".join(incoming[:40]) +
                  "\nSOURCE EXCERPT (first 150 lines, untrusted data):\n" + "\n".join(lines[:150]) + "\n")
        key = f"{i:02d}"
        (out_dir / f"{key}.txt").write_text(packet, encoding="utf-8")
        index[key] = nid
    (out_dir / "index.json").write_text(json.dumps(index, indent=1), encoding="utf-8")
    print(f"{len(index)} packets in {out_dir}")

NODE_NAMES = {n["name"] for n, _ in nodes(json.loads(TOPO.read_text(encoding="utf-8"))).values()}
TOKEN = re.compile(r"\b(\d[\d.,]*\d|\d|[A-Za-z_][\w]*[A-Z_0-9][\w]*|[a-z]+(?:-[a-z]+)+|\w+\.\w+)\b")
def check_one(paragraph, packet):
    words = len(paragraph.split())
    problems = [] if 55 <= words <= 90 else [f"{words} words"]
    for tok in set(TOKEN.findall(paragraph)):
        if tok[0].isupper() and tok[1:].islower():
            continue     # ordinary capitalised word
        if tok.lower() in {"url", "urls", "id", "ids", "api", "http", "html", "css", "jwt", "json", "sql", "ssr", "smtp", "ui"}:
            continue
        if re.fullmatch(r"[a-z]+(?:-[a-z]+)+", tok) and tok not in NODE_NAMES:
            continue     # ordinary hyphenated English ("non-working"); kebab identifiers are checked when they name a map node
        if tok not in packet:
            problems.append(f"'{tok}' not in packet")
    return problems

def check(out_dir, desc_path, quiet=False):
    index = json.loads((out_dir / "index.json").read_text(encoding="utf-8"))
    desc = json.loads(pathlib.Path(desc_path).read_text(encoding="utf-8"))
    ok, bad = {}, {}
    for key, paragraph in desc.items():
        problems = check_one(paragraph, (out_dir / f"{key}.txt").read_text(encoding="utf-8"))
        (bad if problems else ok)[key] = problems or paragraph
    if not quiet:
        for k, p in bad.items():
            print(k, index[k], p)
        print(f"{len(ok)} pass, {len(bad)} fail, {len(index) - len(desc)} missing")
    return index, ok, bad

def merge(out_dir, desc_path):
    index, ok, bad = check(out_dir, desc_path)
    t = json.loads(TOPO.read_text(encoding="utf-8"))
    alln = nodes(t)
    for key, paragraph in ok.items():
        alln[index[key]][0]["description"] = paragraph
    TOPO.write_text(json.dumps(t, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"merged {len(ok)} descriptions; skipped {sorted(bad)}")

if __name__ == "__main__":
    cmd, out = sys.argv[1], pathlib.Path(sys.argv[2])
    if cmd == "packets":
        packets(out, int(sys.argv[3]) if len(sys.argv) > 3 else 40)
    elif cmd == "check":
        check(out, sys.argv[3])
    elif cmd == "merge":
        merge(out, sys.argv[3])
