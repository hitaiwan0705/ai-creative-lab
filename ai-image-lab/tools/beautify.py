"""
兩段式「美顏」刺激物產生器（教學用）
同一張原圖、同一個人，只控制「美化強度」這一個變因，產生 light / heavy 兩級。
做法模仿常見美顏 App：磨皮、提亮美白、放大眼睛、瘦臉（V 臉）。

用法：python3 beautify.py images/original.jpg images/
需求：opencv-python-headless<5, numpy
"""
import sys, os
import cv2
import numpy as np

LEVELS = {
    #            磨皮   提亮  去飽和  眼睛放大  瘦臉位移(臉寬比例)  下巴上提
    "light": dict(smooth=0.45, bright=0.05, desat=0.06, eye=0.10, slim=0.025, chin=0.010),
    "heavy": dict(smooth=0.90, bright=0.13, desat=0.18, eye=0.26, slim=0.070, chin=0.035),
}


def detect(img):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    fc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = fc.detectMultiScale(g, 1.1, 5, minSize=(img.shape[1] // 6,) * 2)
    if len(faces) == 0:
        raise SystemExit("找不到臉")
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    ec = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")
    eyes = ec.detectMultiScale(g[y:y + h // 2 + h // 10, x:x + w], 1.1, 8, minSize=(w // 8,) * 2)
    eyes = sorted(eyes, key=lambda e: e[0])[:2]
    if len(eyes) < 2:  # 後備：依臉框比例估計
        eyes = [(int(w * .22), int(h * .30), int(w * .2), int(w * .2)), (int(w * .58), int(h * .30), int(w * .2), int(w * .2))]
    centers = [(x + ex + ew / 2, y + ey + eh / 2, ew) for ex, ey, ew, eh in eyes]
    return (x, y, w, h), centers


def gauss(X, Y, cx, cy, sigma):
    return np.exp(-((X - cx) ** 2 + (Y - cy) ** 2) / (2 * sigma * sigma))


def beautify(img, p):
    (x, y, w, h), eyes = detect(img)
    H, W = img.shape[:2]
    X, Y = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
    dx = np.zeros_like(X); dy = np.zeros_like(Y)   # 反向映射位移：輸出像素到原圖取樣點的偏移

    # 1) 瘦臉：兩側臉頰下緣往中線推、下巴往上收（高斯權重，平滑無接縫）
    cx = x + w / 2
    for side in (-1, 1):
        for fy, k in ((0.60, 0.8), (0.76, 1.0), (0.90, 0.7)):
            g = gauss(X, Y, cx + side * w * 0.42, y + h * fy, w * 0.16)
            dx += side * w * p["slim"] * k * g          # 取樣點往外 → 內容往內
    g = gauss(X, Y, cx, y + h * 1.02, w * 0.18)
    dy += h * p["chin"] * g                               # 取樣點往下 → 下巴往上

    # 2) 放大眼睛：取樣點往眼睛中心收
    for ex, ey, ew in eyes:
        g = gauss(X, Y, ex, ey, ew * 0.42)
        dx -= (X - ex) * p["eye"] * g
        dy -= (Y - ey) * p["eye"] * g

    mapx, mapy = X + dx, Y + dy
    out = cv2.remap(img, mapx, mapy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

    # 3) 臉部遮罩（橢圓、羽化），避開眼睛與嘴
    mask = np.zeros((H, W), np.float32)
    cv2.ellipse(mask, (int(cx), int(y + h * .55)), (int(w * .46), int(h * .62)), 0, 0, 360, 1, -1)
    keep = np.zeros_like(mask)
    for ex, ey, ew in eyes:
        cv2.ellipse(keep, (int(ex), int(ey)), (int(ew * .55), int(ew * .35)), 0, 0, 360, 1, -1)
    cv2.ellipse(keep, (int(cx), int(y + h * .80)), (int(w * .17), int(h * .07)), 0, 0, 360, 1, -1)
    mask = np.clip(mask - keep, 0, 1)
    # 只保留膚色像素（YCrCb 膚色範圍），避免頭髮被磨皮、提亮成灰綠色
    ycc = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    skin = cv2.inRange(ycc, (60, 133, 77), (255, 180, 135)).astype(np.float32) / 255
    skin = cv2.remap(skin, mapx, mapy, cv2.INTER_LINEAR)
    mask = mask * cv2.GaussianBlur(skin, (0, 0), w * 0.01)
    mask = cv2.GaussianBlur(mask, (0, 0), w * 0.03)[..., None]

    # 4) 磨皮：雙邊濾波，依強度與原圖混合
    d = int(w * 0.03) | 1
    smooth = cv2.bilateralFilter(out, d, 40 + 60 * p["smooth"], d)
    smooth = cv2.bilateralFilter(smooth, d, 40 + 60 * p["smooth"], d)
    a = mask * p["smooth"]
    out = (out * (1 - a) + smooth * a).astype(np.uint8)

    # 5) 提亮、美白（降飽和）— 臉部為主，全圖帶一點
    hls = cv2.cvtColor(out, cv2.COLOR_BGR2HLS).astype(np.float32)
    wgt = mask[..., 0]                    # 只作用在臉部，避免頭髮變灰
    hls[..., 1] = np.clip(hls[..., 1] + 255 * p["bright"] * wgt, 0, 255)
    hls[..., 2] = np.clip(hls[..., 2] * (1 - p["desat"] * wgt), 0, 255)
    out = cv2.cvtColor(hls.astype(np.uint8), cv2.COLOR_HLS2BGR)
    return out


if __name__ == "__main__":
    src, outdir = sys.argv[1], sys.argv[2]
    img = cv2.imread(src)
    for name, p in LEVELS.items():
        res = beautify(img, p)
        path = os.path.join(outdir, f"beautified-{name}.jpg")
        cv2.imwrite(path, res, [cv2.IMWRITE_JPEG_QUALITY, 84, cv2.IMWRITE_JPEG_PROGRESSIVE, 1])
        print("saved", path)
