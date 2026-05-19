import fs from "fs";
import { PNG } from "pngjs";

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function setPixel(png, x, y, color) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = color.r;
  png.data[idx + 1] = color.g;
  png.data[idx + 2] = color.b;
  png.data[idx + 3] = color.a ?? 255;
}

function roundedRect(png, x, y, w, h, r, color) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      const dx = px < x + r ? x + r - px : px > x + w - r ? px - (x + w - r) : 0;
      const dy = py < y + r ? y + r - py : py > y + h - r ? py - (y + h - r) : 0;
      if (dx * dx + dy * dy <= r * r) setPixel(png, px, py, color);
    }
  }
}

function circle(png, cx, cy, radius, color) {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) setPixel(png, x, y, color);
    }
  }
}

function ellipse(png, cx, cy, rx, ry, color) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) setPixel(png, x, y, color);
    }
  }
}

function polygon(png, points, color) {
  const minY = Math.floor(Math.min(...points.map(p => p[1])));
  const maxY = Math.ceil(Math.max(...points.map(p => p[1])));

  for (let y = minY; y <= maxY; y++) {
    const nodes = [];
    let j = points.length - 1;

    for (let i = 0; i < points.length; i++) {
      const xi = points[i][0], yi = points[i][1];
      const xj = points[j][0], yj = points[j][1];

      if ((yi < y && yj >= y) || (yj < y && yi >= y)) {
        nodes.push(xi + ((y - yi) / (yj - yi)) * (xj - xi));
      }

      j = i;
    }

    nodes.sort((a, b) => a - b);

    for (let k = 0; k < nodes.length; k += 2) {
      if (nodes[k + 1] === undefined) break;
      for (let x = Math.floor(nodes[k]); x <= Math.ceil(nodes[k + 1]); x++) {
        setPixel(png, x, y, color);
      }
    }
  }
}

function makeIcon(size, fileName) {
  const png = new PNG({ width: size, height: size });

  const blue = { ...hexToRgb("#2563eb"), a: 255 };
  const white = { ...hexToRgb("#ffffff"), a: 255 };
  const light = { ...hexToRgb("#dbeafe"), a: 255 };

  roundedRect(
    png,
    Math.round(size * 0.045),
    Math.round(size * 0.045),
    Math.round(size * 0.91),
    Math.round(size * 0.91),
    Math.round(size * 0.22),
    blue
  );

  const cx = size / 2;
  const topY = size * 0.18;
  const bulbTop = size * 0.36;
  const bulbBottom = size * 0.78;
  const dropW = size * 0.44;

  polygon(
    png,
    [
      [cx, topY],
      [cx - dropW * 0.35, bulbTop + dropW * 0.18],
      [cx + dropW * 0.35, bulbTop + dropW * 0.18],
    ],
    white
  );

  ellipse(png, cx, size * 0.58, dropW / 2, (bulbBottom - bulbTop) / 2, white);
  circle(png, cx, size * 0.60, size * 0.14, light);

  roundedRect(
    png,
    Math.round(cx - size * 0.028),
    Math.round(size * 0.47),
    Math.round(size * 0.056),
    Math.round(size * 0.26),
    Math.round(size * 0.028),
    blue
  );

  roundedRect(
    png,
    Math.round(cx - size * 0.13),
    Math.round(size * 0.572),
    Math.round(size * 0.26),
    Math.round(size * 0.056),
    Math.round(size * 0.028),
    blue
  );

  fs.writeFileSync(fileName, PNG.sync.write(png));
}

makeIcon(192, "public/icon-192.png");
makeIcon(512, "public/icon-512.png");

console.log("Ikonice su napravljene:");
console.log("public/icon-192.png");
console.log("public/icon-512.png");
