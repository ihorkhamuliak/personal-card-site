# Compare two package-lock.json files: changed versions (MAJOR flagged), removed/added top-level packages.
# Used 04.11.2026 to review 'npm audit fix'. Usage: py lockdiff.py old-lock.json package-lock.json
import json, sys
a = json.load(open(sys.argv[1], encoding='utf-8'))['packages']
b = json.load(open(sys.argv[2], encoding='utf-8'))['packages']
top = lambda k: k.count('node_modules/') == 1
ch, rem, add = [], [], []
for k, v in b.items():
    if k in a and a[k].get('version') != v.get('version'):
        maj = a[k].get('version', '0').split('.')[0] != v.get('version', '0').split('.')[0]
        ch.append(f"{'MAJOR ' if maj else ''}{k.replace('node_modules/', '')}: {a[k].get('version')} -> {v.get('version')}")
rem = [k for k in a if k not in b]
add = [k for k in b if k not in a]
print('changed', len(ch), '| removed', len(rem), '| added', len(add))
print('\n'.join(sorted(c for c in ch if 'MAJOR' in c or c.count('/') <= 1)[:40]))
print('removed top-level:', [k.replace('node_modules/', '') for k in rem if top(k)][:40])
print('added top-level:', [k.replace('node_modules/', '') for k in add if top(k)][:20])
print('root deps before/after equal:', a[''].get('dependencies') == b[''].get('dependencies'))
