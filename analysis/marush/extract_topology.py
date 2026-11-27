"""Extract the Marush dependency topology into analysis/marush/topology.json.

Usage (from the workspace root):  python analysis/marush/extract_topology.py

Reads legacy/marush (never writes there). Enumerates files with `git ls-files`
so the self-referencing legacy/ junction and build output are never walked.

Edges:
  call      C# type reference (scoped by ProjectReference + internal visibility),
            TS static import, template class -> email template file
  dispatch  DI interface -> implementation, lazy route import, frontend HTTP -> API
            controller, email link -> decision endpoint, IIS rewrite -> SSR server
  read/write  repository -> SQL table (EF IEntityTypeConfiguration + ToTable),
            mail client -> SMTP, captcha -> reCAPTCHA, auth -> browser storage
"""
import json, re, subprocess, sys, collections, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2] / "legacy" / "marush"
if not ROOT.exists():
    sys.exit(f"{ROOT} not found")
OUT = pathlib.Path(__file__).resolve().parent / "topology.json"
APP = "Site/Gmf.Marush.Care.App"

files = subprocess.run(["git", "-C", str(ROOT), "ls-files"], capture_output=True, text=True, check=True).stdout.split("\n")
files = [f for f in files if f and not f.startswith(("analysis/", "legacy/", ".claude/"))]
fileset = set(files)

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8-sig", errors="ignore")

def loc_of(rel):
    return sum(1 for line in read(rel).splitlines() if line.strip() and not line.strip().startswith("//"))

DOMAINS = {
    "D1": "Public site & treatment catalog", "D2": "Online booking", "D3": "Admin calendar",
    "D4": "Customer (CRM) management", "D5": "Identity & access", "D6": "Frontend shell / SSR / i18n",
    "D7": "Notifications & email", "D8": "Domain events & audit", "D9": "Persistence",
    "D10": "API hosting platform", "D11": "Ops / delivery", "DATA": "Data stores & external services",
}

def domain_of(rel):
    p = rel
    name = p.rsplit("/", 1)[-1]
    if p.startswith(APP):
        a = p[len(APP) + 1:]
        for prefix, d in [("src/app/features/home", "D1"), ("src/app/features/services", "D1"), ("src/app/features/gallery", "D1"),
                          ("src/app/features/contact", "D1"), ("src/app/features/errors", "D1"),
                          ("src/app/shared/models/services/treatments", "D1"), ("src/app/shared/components/treatments", "D1"),
                          ("src/app/features/appointment", "D2"), ("src/app/shared/routes/appointment-routes", "D2"),
                          ("src/app/features/admin/calendar", "D3"), ("src/app/features/admin/clients", "D4"),
                          ("src/app/features/admin/authentication", "D5"), ("src/app/shared/services/authentication", "D5"),
                          ("src/app/shared/services/captcha", "D5"), ("src/app/shared/guards", "D5")]:
            if a.startswith(prefix):
                return d
        return "D6"
    if p.startswith("Deployment/") or p.startswith("Gmf.Marush.Care.Host/") or "NodeJsRunnerService" in name or name == "web.config":
        return "D11"
    if p.startswith("Site/Gmf.Marush.Care.Infrastructure/Data/") or p.startswith("Site/Gmf.Marush.Care.Infrastructure/Migrations") \
            or "/Contracts/Repositories/" in p or p.startswith("Packages/Gmf.DDD.Common/"):
        return "D9"
    if p.startswith("Packages/Gmf.Mail.Common/") or "/Models/Templates/" in p or "/Resources/" in p:
        return "D7"
    if p.startswith("Packages/Gmf.Net.Core.Common/Persistence/Dispatchers") or p.startswith("Packages/Gmf.Net.Core.Common/Persistence/Handlers"):
        return "D8"
    for word, d in [("Appointment", "D2"), ("Calendar", "D3"), ("Customer", "D4"), ("Phone", "D4"), ("Treatment", "D2"),
                    ("User", "D5"), ("Jwt", "D5"), ("Authentication", "D5"), ("Notif", "D7"), ("Audit", "D8"),
                    ("DomainEvents", "D8"), ("Event", "D8")]:
        if word in name:
            return d
    if p.startswith("Site/Gmf.Marush.Care.Infrastructure/Injection"):
        return "D10"
    if p.startswith("Site/Gmf.Marush.Care.Domain/") or p.startswith("Site/Gmf.Marush.Care.Services/"):
        return "D9"
    return "D10"

# ---------- leaves ----------
leaves = {}          # id -> node
def add_leaf(nid, name, kind, rel, loc, language, domain):
    leaves[nid] = {"id": nid, "name": name, "kind": kind, "language": language, "loc": loc, "file": rel, "_domain": domain}

cs_files = [f for f in files if f.endswith(".cs") and "/Migrations/" not in f]
migrations_dir = "Site/Gmf.Marush.Care.Infrastructure/Migrations"
ts_files = [f for f in files if f.startswith(APP + "/src/") and f.endswith(".ts")]

for f in cs_files:
    add_leaf(f, pathlib.PurePosixPath(f).stem, "module", f, loc_of(f), "csharp", domain_of(f))
add_leaf(migrations_dir, "EF Migrations (InitialCreate)", "job", migrations_dir,
         sum(loc_of(f) for f in files if f.startswith(migrations_dir + "/")), "csharp", "D9")
for f in ts_files:
    base = f[:-3]
    loc = loc_of(f) + sum(loc_of(base + ext) for ext in (".html", ".scss") if base + ext in fileset)
    add_leaf(f, pathlib.PurePosixPath(f).stem, "module", f, loc, "typescript", domain_of(f))
styles_dir = APP + "/src/styles"
add_leaf(styles_dir, "Global styles (SCSS)", "module", styles_dir,
         sum(loc_of(f) for f in files if f.startswith(styles_dir + "/") and f.endswith(".scss")), "scss", "D6")
locale_dir = APP + "/src/locale"
add_leaf(locale_dir, "Translations sr/en/ru", "module", locale_dir,
         sum(loc_of(f) for f in files if f.startswith(locale_dir + "/")), "json", "D6")
email_dir = "Site/Gmf.Marush.Care.Api/Resources/Email Templates/"
for f in files:
    if f.startswith(email_dir) and f.endswith(".html"):
        add_leaf(f, pathlib.PurePosixPath(f).name, "screen", f, loc_of(f), "html", "D7")
for f in files:
    if f.startswith("Deployment/") and f.endswith((".yml", ".yaml")):
        add_leaf(f, pathlib.PurePosixPath(f).name, "job", f, loc_of(f), "yaml", "D11")
add_leaf("Site/Gmf.Marush.Care.Api/web.config", "web.config (IIS)", "job", "Site/Gmf.Marush.Care.Api/web.config",
         loc_of("Site/Gmf.Marush.Care.Api/web.config"), "xml", "D11")

stores = {}
def store(key, name):
    nid = f"ds:{key}"
    stores[nid] = {"id": nid, "name": name, "kind": "datastore"}
    return nid

edges = set()
def edge(s, t, kind):
    if s != t and s in leaves | stores and t in leaves | stores:
        edges.add((s, t, kind))
observations = []

# ---------- C# ----------
def strip_cs(text):
    text = re.sub(r"/\*.*?\*/", " ", text, flags=re.S)
    text = re.sub(r"//[^\n]*", " ", text)
    text = re.sub(r'@?\$?"(?:[^"\\\n]|\\.)*"', '""', text)
    return text

def project_of(rel):
    parts = rel.split("/")
    for i in range(len(parts), 0, -1):
        d = "/".join(parts[:i])
        cand = [f for f in files if f.startswith(d + "/") and f.endswith(".csproj") and f.count("/") == d.count("/") + 1]
        if cand:
            return cand[0]
    return None

projects = sorted(f for f in files if f.endswith(".csproj"))
proj_refs = {}
for p in projects:
    refs = re.findall(r'ProjectReference Include="([^"]+)"', read(p))
    base = pathlib.PurePosixPath(p).parent
    resolved = set()
    for r in refs:
        r = r.replace("\\", "/")
        parts = []
        for seg in (str(base) + "/" + r).split("/"):
            if seg == "..":
                parts.pop()
            elif seg not in (".", ""):
                parts.append(seg)
        resolved.add("/".join(parts))
    proj_refs[p] = resolved
def reach(p, seen=None):
    seen = seen or set()
    for r in proj_refs.get(p, ()):
        if r not in seen:
            seen.add(r)
            reach(r, seen)
    return seen
proj_reach = {p: reach(p) | {p} for p in projects}
file_proj = {f: project_of(f) for f in cs_files}

decl_re = re.compile(r"^\s*((?:public|internal|private|protected|sealed|abstract|static|partial|file|readonly|record|\s)*)\b(class|record|interface|struct)\s+(\w+)(?:<[^>{]*>)?(?:\s*\([^)]*\))?\s*(?::\s*([^{\n]+))?", re.M)
ns_re = re.compile(r"^\s*namespace\s+([\w.]+)", re.M)
using_re = re.compile(r"^\s*(?:global\s+)?using\s+(?:static\s+)?([\w.]+)\s*;", re.M)
types = collections.defaultdict(list)   # name -> [(file, ns, internal)]
bases = {}                              # file -> [base names]
cs_text, cs_ns, cs_usings = {}, {}, {}
for f in cs_files:
    raw = read(f)
    text = strip_cs(raw)
    cs_text[f] = text
    ns = (ns_re.search(raw) or [None, ""])[1] if ns_re.search(raw) else ""
    cs_ns[f] = ns
    cs_usings[f] = set(using_re.findall(raw))
    for mods, kind, name, base in decl_re.findall(text):
        internal = "public" not in mods
        types[name].append((f, ns, internal))
        if base:
            bases.setdefault(f, []).extend(re.findall(r"\b([A-Z]\w*)", base.split(" where ")[0]))

def ns_visible(src, ns):
    own = cs_ns[src]
    return ns == "" or own == ns or own.startswith(ns + ".") or ns in cs_usings[src] or any(u == ns for u in cs_usings[src])

ident_re = re.compile(r"\b([A-Z]\w*)\b")
ambiguous = collections.Counter()
for f in cs_files:
    used = set(ident_re.findall(cs_text[f]))
    used |= {u + "Attribute" for u in used}
    used -= {name for _, _, name, _ in decl_re.findall(cs_text[f])}   # a file's own declarations are not references
    for name in used:
        cands = [(tf, ns, internal) for tf, ns, internal in types.get(name, []) if tf != f]
        cands = [(tf, ns, i) for tf, ns, i in cands
                 if file_proj[tf] in proj_reach.get(file_proj[f], set()) and (not i or file_proj[tf] == file_proj[f])]
        if not cands:
            continue
        vis = [c for c in cands if ns_visible(f, c[1])] or cands
        if len(vis) > 1:
            ambiguous[name] += 1
        for tf, _, _ in vis[:1] if len(vis) > 1 else vis:
            edge(f, tf, "call")

# Extension methods: `x.Method(` resolves to the static class that declares `static T Method(this ...)`
ext_re = re.compile(r"\bstatic\s+[\w<>\[\],.?\s]+?\s+(\w+)\s*(?:<[^>]*>)?\s*\(\s*this\b")
COMMON = {"Add", "Get", "Set", "Contains", "Any", "Map", "Use", "Create", "ToString", "Equals", "Register", "Build"}
ext_methods = collections.defaultdict(set)
for f in cs_files:
    for name in ext_re.findall(cs_text[f]):
        if name not in COMMON:
            ext_methods[name].add(f)
for f in cs_files:
    for name in set(re.findall(r"\.(\w+)\s*(?:<[^>()]*>)?\s*\(", cs_text[f])):
        for tf in ext_methods.get(name, ()):
            if tf != f and file_proj[tf] in proj_reach.get(file_proj[f], set()):
                edge(f, tf, "call")

# DI: interface -> implementation (Autofac DefaultInterfaceRegistration / AsImplementedInterfaces)
iface_impls = collections.defaultdict(set)
for f, bl in bases.items():
    for b in bl:
        for tf, _, _ in types.get(b, []):
            if read(tf) and re.search(rf"\binterface\s+{b}\b", cs_text[tf]):
                iface_impls[tf].add(f)
for iface, impls in iface_impls.items():
    for impl in impls:
        edge(iface, impl, "dispatch")

# EF: Dto -> table
consts = {}
for f in cs_files:
    for name, val in re.findall(r'const\s+string\s+(\w+)\s*=\s*"([^"]+)"', read(f)):
        consts[name] = val
dto_table = {}
for f in cs_files:
    raw = read(f)
    m = re.search(r"IEntityTypeConfiguration<(\w+)>", raw)
    t = re.search(r'ToTable\(\s*("?)([\w]+)\1', raw)
    if m and t:
        table = t.group(2) if t.group(1) else consts.get(t.group(2), t.group(2))
        dto_table[m.group(1)] = table
        edge(f, store(f"sql:{table}", f"SQL table {table}"), "write")   # schema definition
write_re = re.compile(r"\.(Add|AddAsync|AddRange|Remove|RemoveRange|Update)\(|ExecuteUpdate|ExecuteDelete|\.Status\s*=|\.\w+\s*=\s*new\w*")
repo_files = [f for f in cs_files if "/Data/Repositories/" in f]
nav_name = {t: re.sub(r"^Customer(?=[A-Z])", "", t) for t in dto_table.values()}   # CustomerPhones -> .Phones
for f in repo_files:
    text = cs_text[f]
    fields = dict(re.findall(r"(_\w+)\s*=\s*context\.Set<(\w+)>\(\)", text))
    written = set()
    for line in text.splitlines():
        if not write_re.search(line):
            continue
        for dto, table in dto_table.items():
            if re.search(rf"\b{dto}\b", line) or re.search(rf"\.{nav_name[table]}\.(Add|Remove)", line) \
                    or any(fld in line and fdto == dto for fld, fdto in fields.items()):
                written.add(table)
    if written:   # entities constructed in a writing repository are inserted with the object graph, unless only attached as references
        for var, dto in re.findall(r"var\s+(\w+)\s*=\s*new\s+(\w+Dto)\b", text):
            if dto in dto_table and not re.search(rf"Attach\(\s*{var}\s*\)", text):
                written.add(dto_table[dto])
    for dto, table in dto_table.items():
        if re.search(rf"\b{dto}\b", text):
            sid = store(f"sql:{table}", f"SQL table {table}")
            edge(f, sid, "read")
            if table in written:
                edge(f, sid, "write")
for dto, table in dto_table.items():
    edge(migrations_dir, store(f"sql:{table}", f"SQL table {table}"), "write")

# External services
smtp = store("smtp", "SMTP server (MailKit)")
recaptcha = store("recaptcha", "Google reCAPTCHA Enterprise")
static_files = store("static-files", "Static files marushcare.com/files")
browser = store("browser-storage", "Browser localStorage (JWT)")
for f in cs_files:
    raw = read(f)
    if "SmtpClient" in raw:
        edge(f, smtp, "write")
    if "recaptchaenterprise" in raw:
        edge(f, recaptcha, "read")
# template class -> template html
for f in cs_files:
    for html in re.findall(r'"([\w-]+\.html)"', read(f)):
        tid = email_dir + html
        edge(f, tid, "call")

# ---------- TypeScript ----------
alias = {"@shared/": APP + "/src/app/shared/", "@features/": APP + "/src/app/features/", "@env": APP + "/src/environments/environment"}
def resolve_ts(src, spec):
    if spec.startswith("."):
        base = str(pathlib.PurePosixPath(src).parent / spec)
        parts = []
        for seg in base.split("/"):
            if seg == "..":
                parts.pop()
            elif seg not in (".", ""):
                parts.append(seg)
        target = "/".join(parts)
    else:
        target = None
        for k, v in alias.items():
            if spec == k or spec.startswith(k):
                target = v + spec[len(k):] if k.endswith("/") else v
                break
        if target is None:
            return None
    for cand in (target + ".ts", target + "/index.ts", target):
        if cand in leaves:
            return cand
    return None

controllers = {pathlib.PurePosixPath(f).stem.replace("Controller", "").lower(): f
               for f in cs_files if "/Controllers/" in f}
for f in ts_files:
    text = read(f)
    for spec in re.findall(r"""from\s+['"]([^'"]+)['"]""", text):
        t = resolve_ts(f, spec)
        if t:
            edge(f, t, "call")
    for spec in re.findall(r"""import\(\s*['"]([^'"]+)['"]\s*\)""", text):
        t = resolve_ts(f, spec)
        if t:
            edge(f, t, "dispatch")
    for ctrl in re.findall(r"apiUrl\}(\w+)", text):
        if ctrl.lower() in controllers:
            edge(f, controllers[ctrl.lower()], "dispatch")
    if "staticContentUrl" in text and not f.endswith("environment.ts"):
        edge(f, static_files, "read")
    if "localStorage" in text:
        edge(f, browser, "write")
        edge(f, browser, "read")
    if "recaptcha/enterprise" in text:
        edge(f, recaptcha, "read")
# component templates reference global style modules implicitly; styles imported by angular.json
edge(APP + "/src/main.ts", styles_dir, "call")
for f in ts_files:
    if "$localize" in read(f):
        edge(f, locale_dir, "read")

# ---------- config-driven edges ----------
appointment_ctrl = controllers.get("appointment")
edge(email_dir + "appointment-request.html", appointment_ctrl, "dispatch")    # owner's Accept/Reject links
webcfg = "Site/Gmf.Marush.Care.Api/web.config"
edge(webcfg, APP + "/src/server.ts", "dispatch")                              # IIS rewrite to the Node SSR server
edge(webcfg, "Site/Gmf.Marush.Care.Api/Program.cs", "dispatch")               # aspNetCore handler
node_runner = next(f for f in cs_files if f.endswith("NodeJsRunnerService.cs"))
edge(node_runner, APP + "/src/server.ts", "dispatch")                         # spawns node dist/server/server.mjs
for f in leaves:
    if f.startswith("Deployment/") and f.endswith((".yml", ".yaml")):
        text = read(f)
        for tpl in re.findall(r"""template:\s*['"]?([\w./-]+\.ya?ml)""", text):
            tpl = tpl.split("@")[0]
            cand = [x for x in leaves if x.startswith("Deployment/") and x.endswith(pathlib.PurePosixPath(tpl).name)]
            for c in cand:
                edge(f, c, "call")
        if "migrations bundle" in text or "efbundle" in text:
            edge(f, migrations_dir, "dispatch")
        if "web.config" in text or "publishWebProjects" in text:
            edge(f, webcfg, "dispatch")
host = "Gmf.Marush.Care.Host/Program.cs"
edge(host, "Site/Gmf.Marush.Care.Api/Program.cs", "dispatch")
edge(host, APP + "/src/main.ts", "dispatch")

# ---------- entry points & dead ends ----------
entry = set()
for f in cs_files:
    raw = read(f)
    if "/Controllers/" in f or f.endswith("/Program.cs") or re.search(r":\s*BackgroundService|IHostedService", raw):
        entry.add(f)
for f in ("main.ts", "main.server.ts", "server.ts"):
    entry.add(f"{APP}/src/{f}")
entry |= {t for s, t, k in edges if k == "dispatch" and s.startswith(APP + "/src/app/shared/routes/")}
entry |= {f for f in leaves if f.startswith("Deployment/") and f.endswith("azure-pipelines.yml") or f.endswith("azure-pipelines-analysis.yml")}
entry = {e for e in entry if e in leaves}

convention = re.compile(r"IDesignTimeDbContextFactory<|IEntityTypeConfiguration<|AbstractValidator<|:\s*Module\b|:\s*Migration\b|JsonConverter<|IStartupFilter|ActionFilterAttribute|ExceptionFilterAttribute|IAsyncActionFilter")
inbound = collections.Counter(t for _, t, _ in edges)
dead, suppressed = [], collections.Counter()
for nid, node in leaves.items():
    if nid in entry or inbound[nid]:
        continue
    if node["language"] == "csharp" and nid in cs_text and convention.search(cs_text[nid]):
        m = convention.search(cs_text[nid]).group(0)
        suppressed[m.split("<")[0].strip(": ")] += 1
        continue
    if nid.endswith(".d.ts") or nid.endswith("environment.development.ts"):
        continue
    dead.append(nid)

# ---------- tree ----------
by_domain = collections.defaultdict(list)
for nid, node in leaves.items():
    d = node.pop("_domain")
    by_domain[d].append(node)
children = [{"id": f"dom:{k}", "name": DOMAINS[k], "kind": "domain", "children": sorted(v, key=lambda n: n["id"])}
            for k, v in sorted(by_domain.items(), key=lambda kv: int(kv[0][1:]))]
children.append({"id": "dom:data", "name": DOMAINS["DATA"], "kind": "domain", "children": sorted(stores.values(), key=lambda n: n["id"])})

# ---------- observations ----------
writers = collections.defaultdict(set)
for s, t, k in edges:
    if k == "write" and t.startswith("ds:sql:") and "/Configurations/" not in s and s != migrations_dir:
        writers[t].add(pathlib.PurePosixPath(s).stem)
top_in = sorted(((inbound[n], n) for n in leaves), reverse=True)[:5]
fan_in = ", ".join(f"{pathlib.PurePosixPath(n).stem} ({c})" for c, n in top_in)
observations += [
    f"Highest fan-in nodes (most depended on): {fan_in}. Changes there ripple widest; they are the first candidates for characterization tests.",
    "Tables with more than one writing repository: " + ("; ".join(f"{t[7:]} <- {', '.join(sorted(w))}" for t, w in sorted(writers.items()) if len(w) > 1) or "none") + ".",
    "The production SSR server is a single child process started by NodeJsRunnerService and reached only through the IIS rewrite in web.config: one point of failure for every public page, with no restart or health check.",
    f"Convention-registered nodes kept out of deadEnds (they have no static inbound edge but are wired by assembly scanning / EF / FluentValidation): {dict(suppressed)}.",
    f"Ambiguous C# type names resolved to the first visible match (possible mis-wired edges): {dict(ambiguous) or 'none'}.",
    "CustomerController talks to repositories directly (no service layer), unlike the other three controllers; it is the cleanest extraction candidate for a service layer.",
]

# ---------- flows ----------
def find(stem, under=""):
    m = [n for n in leaves if pathlib.PurePosixPath(n).stem == stem and n.startswith(under)] + \
        [n for n in stores if n == stem]
    if not m:
        sys.exit(f"flow node not found: {stem} {under}")
    return m[0]
A, F = "Site/Gmf.Marush.Care.Api/", APP + "/src/app/features/"
def step(label, *ids):
    return {"label": label, "nodes": list(ids)}
flows = [
    {"name": "Book an appointment online", "persona": "Salon customer",
     "description": "A customer picks treatments and a time on the website and asks the salon to book it.",
     "steps": [
         step("Choose treatments, date and time", find("appointment-page", F), find("services-selector", F), find("summary", F)),
         step("Send the request with a captcha check", find("appointment", F + "appointment"), find("ValidateCaptchaAttribute"), find("AppointmentController")),
         step("Check the request is valid and inside the booking window", find("AppointmentRequestValidator"), find("AppointmentBookingWindow")),
         step("Save the customer and the requested appointment", find("Service", "Site/Gmf.Marush.Care.Services/Domain/Appointment"), find("AppointmentRepository"), "ds:sql:Appointments", "ds:sql:Customers"),
         step("Email the owner (with Accept/Reject links) and the customer", find("AppointmentNotificationService"), find("AppointmentRequestTemplate"), find("AppointmentSubmittedTemplate"), smtp),
         step("Show the request-sent page", find("request-sent-page", F)),
     ]},
    {"name": "Accept or reject a booking from email", "persona": "Salon owner",
     "description": "The owner opens the booking email and clicks Accept or Reject; the customer is told the outcome.",
     "steps": [
         step("Open the request email and click Accept or Reject", email_dir + "appointment-request.html", find("AppointmentController")),
         step("Record the decision while the request is still pending", find("AppointmentNotificationService"), find("AppointmentRepository"), "ds:sql:Appointments"),
         step("Email the customer the confirmation or rejection", find("AppointmentConfirmationTemplate"), find("AppointmentRejectionTemplate"), smtp),
         step("Land on the client-notified page", find("client-notified-page", F)),
     ]},
    {"name": "Run the weekly calendar", "persona": "Salon staff (admin)",
     "description": "Staff log in, see the week, add or move appointments and notes; moved clients get an email.",
     "steps": [
         step("Log in with captcha", find("login-page", F), find("authentication", APP), find("UserController"), find("UserService"), "ds:sql:Users", browser),
         step("Load the week grid", find("calendar-page", F), find("calendar", F + "admin/calendar"), find("CalendarController"), find("CalendarService"), find("CalendarRetrievalRepository"), "ds:sql:CalendarEntries"),
         step("Add or edit an entry in the dialog", find("calendar-entry-dialog", F), find("CalendarModificationRepository"), "ds:sql:CalendarEntries"),
         step("Reschedule: raise an event and email the client", find("AppointmentRescheduled"), find("AuditLoggingService"), find("AppointmentRescheduledHandler"), find("AppointmentRescheduledTemplate"), smtp),
     ]},
    {"name": "Look up and update a client record", "persona": "Salon staff (admin)",
     "description": "Staff search the client list, open a client, and save changed contact or treatment details.",
     "steps": [
         step("Search and page through clients", find("clients-page", F), find("clients", F + "admin/clients"), find("CustomerController"), find("CustomerRetrievalRepository"), "ds:sql:Customers"),
         step("Edit phones, emails and properties", find("clients-edit-page", F)),
         step("Save with captcha check", find("ValidateCaptchaAttribute"), find("CustomerModificationRepository"), "ds:sql:Customers", "ds:sql:CustomerPhones", "ds:sql:CustomerEmails"),
     ]},
]

topology = {
    "system": "Marush: Space of Care",
    "root": {"id": "sys", "name": "Marush: Space of Care", "kind": "system", "children": children},
    "edges": [{"source": s, "target": t, "kind": k} for s, t, k in sorted(edges)],
    "entryPoints": sorted(entry),
    "deadEnds": sorted(dead),
    "observations": observations,
    "flows": flows,
}
# keep existing descriptions on rerun
if OUT.exists():
    old = json.loads(OUT.read_text(encoding="utf-8"))
    desc = {}
    def walk(n):
        if "description" in n:
            desc[n["id"]] = n["description"]
        for c in n.get("children", []):
            walk(c)
    walk(old["root"])
    def apply(n):
        if n["id"] in desc:
            n["description"] = desc[n["id"]]
        for c in n.get("children", []):
            apply(c)
    apply(topology["root"])
ids = set(leaves) | set(stores)
assert all(e["source"] in ids and e["target"] in ids for e in topology["edges"])
assert all(n in ids for fl in flows for s in fl["steps"] for n in s["nodes"])
OUT.write_text(json.dumps(topology, indent=1, ensure_ascii=False), encoding="utf-8")

kinds = collections.Counter(k for _, _, k in edges)
print(f"leaves: {len(leaves)} modules/jobs/screens + {len(stores)} datastores in {len(children)} domains")
for c in children:
    print(f"  {c['name']}: {len(c['children'])}")
print(f"edges: {len(edges)} {dict(kinds)}")
print(f"entry points: {len(entry)}; dead-end candidates: {len(dead)}; convention-suppressed: {dict(suppressed)}")
for d in dead:
    print("  dead?", d)
print(f"ambiguous type names: {dict(ambiguous)}")
print(f"flows: {[f['name'] for f in flows]}")
print(f"wrote {OUT}")
