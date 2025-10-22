/**
 * Scraper Coto Digital - Node.js (Actualizado para Node 22+)
 * Busca el primer producto y guarda la info en JSON o TXT
 */

import puppeteer from "puppeteer";
import fs from "fs-extra";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function obtenerPrimerProducto(producto) {
  console.log(`\n🔍 Buscando: ${producto}\n`);

  const url = `https://www.cotodigital.com.ar/sitios/cdigi/browse?Ntt=${encodeURIComponent(producto)}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  console.log("🌐 Cargando Coto Digital...");
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  console.log("⏱️ Esperando productos...");
  // En lugar de page.waitForTimeout, usamos un delay manual
  await new Promise((resolve) => setTimeout(resolve, 6000));

  try {
    console.log("🔎 Extrayendo datos del primer producto...\n");

    const productoData = await page.evaluate(() => {
      const card = document.querySelector("catalogue-product");
      if (!card) return null;

      const nombre = card.querySelector("h3.nombre-producto")?.innerText.trim() || "Nombre no disponible";
      const precio = card.querySelector("h4.card-title")?.innerText.trim() || "Precio no disponible";
      const imagen = card.querySelector("img.product-image")?.src || null;
      const link = card.querySelector("a")?.href || window.location.href;

      return { nombre, precio, imagen, link };
    });

    await browser.close();

    if (!productoData) {
      console.log("❌ No se encontró el producto.");
      return null;
    }

    // Convertir precio a número
    let precioNumerico = 0;
    try {
      const limpio = productoData.precio.replace(/[^\d,\.]/g, "").replace(".", "").replace(",", ".");
      precioNumerico = parseFloat(limpio);
    } catch {}

    const resultado = {
      producto_buscado: producto,
      ...productoData,
      precio_numerico: precioNumerico,
      supermercado: "Coto Digital",
    };

    console.log("✅ PRODUCTO ENCONTRADO:");
    console.log("📦 Nombre:", resultado.nombre);
    console.log("💰 Precio:", resultado.precio);
    console.log("🖼️ Imagen:", resultado.imagen ? "✓" : "✗");
    console.log("🔗 Link:", resultado.link);
    console.log("=".repeat(70));

    return resultado;

  } catch (err) {
    console.error("❌ Error al procesar:", err.message);
    await browser.close();
    return null;
  }
}

async function guardarResultado(data, formato = "json") {
  if (!data) {
    console.log("⚠️ No hay datos para guardar");
    return;
  }

  const nombreArchivo = `producto_${data.producto_buscado}`;

  if (["json", "ambos"].includes(formato)) {
    await fs.writeJson(`${nombreArchivo}.json`, data, { spaces: 2 });
    console.log(`✓ Guardado: ${nombreArchivo}.json`);
  }

  if (["txt", "ambos"].includes(formato)) {
    const contenido = `
${"=".repeat(70)}
PRODUCTO: ${data.producto_buscado.toUpperCase()}
${"=".repeat(70)}

Nombre:       ${data.nombre}
Precio:       ${data.precio}
Supermercado: ${data.supermercado}
Link:         ${data.link}
Imagen:       ${data.imagen || "No disponible"}
${"=".repeat(70)}
`;
    await fs.writeFile(`${nombreArchivo}.txt`, contenido);
    console.log(`✓ Guardado: ${nombreArchivo}.txt`);
  }
}

// ────────────────────────────────────────────────
// EJECUCIÓN PRINCIPAL
// ────────────────────────────────────────────────
const rl = readline.createInterface({ input, output });

const producto = await rl.question("¿Qué producto buscás? (ej: leche, arroz): ");
if (!producto.trim()) {
  console.log("❌ Debes ingresar un producto");
  rl.close();
  process.exit(0);
}

const resultado = await obtenerPrimerProducto(producto);
if (resultado) {
  const opcion = await rl.question("\nFormato de guardado (1=JSON, 2=TXT, 3=Ambos, 4=Ninguno) [3]: ");
  const opciones = { "1": "json", "2": "txt", "3": "ambos", "4": "ninguno" };
  const formato = opciones[opcion.trim()] || "ambos";

  if (formato !== "ninguno") await guardarResultado(resultado, formato);
}

rl.close();
console.log("\n✅ Proceso completado.\n");
