#!/usr/bin/env python3
"""產品意象拆解圖自我檢查。

用法：python3 check.py <輸出.html>
檢查外部資源、DATA 內容規則（部件數、字數、證據等級、數據來源），以及色票對比。
有錯誤時以代碼 1 結束。
"""
import json
import re
import sys

ERRORS, WARNINGS = [], []


def luminance(hex_color):
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    rgb = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def extract_data(html):
    """取出 DATA 物件，轉成 JSON 可解析的形式（模板以 JS 物件字面值撰寫）。"""
    m = re.search(r"const DATA = (\{.*?\n\});", html, re.S)
    if not m:
        ERRORS.append("找不到 DATA 物件；請保留模板的 `const DATA = {...};` 結構。")
        return None
    src = re.sub(r"^\s*//.*$", "", m.group(1), flags=re.M)
    src = re.sub(r"'((?:[^'\\]|\\.)*)'", lambda s: json.dumps(s.group(1)), src)
    src = re.sub(r"([{,]\s*)([A-Za-z_]\w*)\s*:", r'\1"\2":', src)
    src = re.sub(r",(\s*[}\]])", r"\1", src)
    try:
        return json.loads(src)
    except json.JSONDecodeError as e:
        ERRORS.append(f"DATA 無法解析（{e}）；請只用模板中的寫法修改內容。")
        return None


def check_external(html):
    for url in re.findall(r"""(?:href|src)\s*=\s*["'](https?:)?//""", html):
        ERRORS.append("發現外部資源連結（href/src 指向網址）；輸出檔必須可離線。")
        break
    if re.search(r"@import|fonts\.googleapis|fonts\.gstatic|cdn\.", html):
        ERRORS.append("發現網路字體或 CDN 引用。")


def check_data(data):
    parts = data.get("parts", [])
    if not 4 <= len(parts) <= 6:
        ERRORS.append(f"部件數為 {len(parts)}，應為 4–6 個。")
    for i, p in enumerate(parts, 1):
        tag = f"部件 {i}（{p.get('name', '?')}）"
        ev = p.get("evidence")
        if ev not in ("觀察", "推論", "數據"):
            ERRORS.append(f"{tag} 的 evidence 必須是 觀察／推論／數據。")
        if ev == "數據" and not p.get("source"):
            ERRORS.append(f"{tag} 標為數據但沒有 source；請補上量表、n、來源、年份，或改為推論。")
        if ev == "推論" and not re.search(r"可能|傾向|或許|也許", p.get("desc", "")):
            WARNINGS.append(f"{tag} 為推論，說明建議使用「可能／傾向」等保留語氣。")
        if len(p.get("name", "")) > 6:
            ERRORS.append(f"{tag} 名稱超過 6 字。")
        if len(p.get("desc", "")) > 18:
            ERRORS.append(f"{tag} 說明超過 18 字（{len(p['desc'])} 字），請改寫。")
        if not p.get("shape") and not p.get("image"):
            ERRORS.append(f"{tag} 沒有 shape 或 image。")
        if re.search(r"\d+\s*%", p.get("desc", "")) and ev != "數據":
            ERRORS.append(f"{tag} 說明含百分比，但不是數據等級。")
    for k in data.get("kansei", []):
        has_mean = isinstance(k.get("mean"), (int, float))
        if has_mean and not k.get("source"):
            ERRORS.append(f"意象「{k.get('left')}—{k.get('right')}」有平均數但沒有 source。")
        if has_mean and not 1 <= k["mean"] <= k.get("scale", 7):
            ERRORS.append(f"意象「{k.get('left')}—{k.get('right')}」平均數超出量表範圍。")
    if len(data.get("kansei", [])) > 3:
        WARNINGS.append("意象語彙超過 3 組，分析容易失焦。")


def check_contrast(html):
    tokens = dict(re.findall(r"--([\w-]+):\s*#([0-9A-Fa-f]{6})", html))
    paper = tokens.get("paper")
    if not paper:
        return
    for name, minimum in (("ink", 4.5), ("ink-soft", 4.5), ("observe", 4.5), ("infer", 4.5), ("data", 4.5)):
        if name in tokens and contrast(tokens[name], paper) < minimum:
            ERRORS.append(f"--{name} 對紙底對比 {contrast(tokens[name], paper):.2f}:1，低於 {minimum}:1。")


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    with open(sys.argv[1], encoding="utf-8") as f:
        html = f.read()
    check_external(html)
    check_contrast(html)
    data = extract_data(html)
    if data:
        check_data(data)
    for w in WARNINGS:
        print("⚠️ ", w)
    for e in ERRORS:
        print("❌", e)
    if not ERRORS:
        print("✅ 通過自我檢查" + ("（有提醒）" if WARNINGS else ""))
    sys.exit(1 if ERRORS else 0)


if __name__ == "__main__":
    main()
