/* ==========================================================================
   KATALIS - Draw.io XML Validator & Prompt Builder
   Author: DARWANZA / PEREKAYASA
   Standard: Draw.io mxGraphModel XML Protocol
   ========================================================================== */

export const BLANK_DRAWIO_XML = `<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
  </root>
</mxGraphModel>`;

/**
 * Membangun system prompt komprehensif untuk memandu model AI menghasilkan
 * XML Draw.io yang valid dan estetis dengan palet Vengeance UI.
 */
export function buildDrawioSystemPrompt() {
  return `Anda adalah asisten arsitektur teknis dan diagramming profesional untuk KATALIS (Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis).
Tugas Anda adalah merancang diagram visual (arsitektur sistem, cloud topology, flowchart logika, ERD, sequence diagram) dalam format XML standar Draw.io (mxGraphModel).

ATURAN STRUKTURAL XML:
1. Hasilkan HANYA elemen <mxCell> di dalam jawaban Anda atau blok kode XML yang rapi.
2. Dimulai dari id="2" (karena id="0" adalah root dan id="1" adalah layer default).
3. Setiap bentuk (vertex) WAJIB memiliki atribut:
   - id: string angka unik berurutan ("2", "3", dst.)
   - value: label teks nama komponen
   - vertex: "1"
   - parent: "1"
   - style: string style semikolon terpisah
   - tag anak <mxGeometry x="..." y="..." width="..." height="..." as="geometry"/>
4. Setiap garis/konektor (edge) WAJIB memiliki atribut:
   - id: string angka unik
   - value: keterangan relasi atau kosong
   - edge: "1"
   - parent: "1"
   - source: ID vertex sumber
   - target: ID vertex tujuan
   - style: "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#64748b;strokeWidth=1.5;"
   - tag anak <mxGeometry relative="1" as="geometry"/>

PALET WARNA VENGEANCE UI (LIGHT MODE):
- Node Primer / Service Utama:
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#1d4ed8;strokeWidth=1.5;fontColor=#0f172a;fontSize=12;fontStyle=1;"
- Node Sukses / Gateway / Controller:
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dcfce7;strokeColor=#15803d;strokeWidth=1.5;fontColor=#0f172a;fontSize=12;fontStyle=1;"
- Node Database / Storage (Bentuk Silinder):
  style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=12;fillColor=#fef9c3;strokeColor=#a16207;strokeWidth=1.5;fontColor=#0f172a;fontSize=12;fontStyle=1;"
- Node Eksternal / User / Client:
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f1f5f9;strokeColor=#475569;strokeWidth=1.5;fontColor=#0f172a;fontSize=12;"
- Node Queue / Cache / Memory:
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffedd5;strokeColor=#c2410c;strokeWidth=1.5;fontColor=#0f172a;fontSize=12;fontStyle=1;"
- Container / Subnet / Boundary Grup:
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#cbd5e1;strokeWidth=1;dashed=1;fontColor=#64748b;fontSize=11;verticalAlign=top;align=left;spacingLeft=10;spacingTop=6;"

TATA LETAK & KOORDINAT:
- Mulai titik kiri atas sekitar x="100", y="100".
- Berikan jarak minimum antar node 60px secara horizontal dan 80px secara vertikal agar rapi dan tidak saling menimpa.
- Lebar standar node kotak: width="140" hingga "180", height="60" hingga "80".
- JANGAN sertakan karakter emoji atau emoticon apa pun di dalam value atau teks diagram.`;
}

/**
 * Membungkus elemen mxCell ke dalam kerangka mxGraphModel standar
 */
export function wrapInMxGraphModel(cellsXml) {
  if (!cellsXml || !cellsXml.trim()) {
    return BLANK_DRAWIO_XML;
  }

  // Jika sudah memiliki pembungkus mxGraphModel, kembalikan langsung
  if (cellsXml.includes('<mxGraphModel') && cellsXml.includes('</mxGraphModel>')) {
    return cellsXml;
  }

  // Jika mengandung pembungkus root tapi belum mxGraphModel
  if (cellsXml.includes('<root>') && cellsXml.includes('</root>')) {
    return `<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
  ${cellsXml}
</mxGraphModel>`;
  }

  // Bungkus bare mxCell items
  return `<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    ${cellsXml}
  </root>
</mxGraphModel>`;
}

/**
 * Membersihkan respons teks mentah dari LLM dan mengekstraksi XML yang valid
 */
export function extractAndCleanXml(rawText) {
  if (!rawText) return BLANK_DRAWIO_XML;

  let text = rawText.trim();

  // 1. Ekstrak dari blok kode markdown ```xml atau ```
  const codeBlockMatch = text.match(/```(?:xml)?([\s\S]*?)```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    text = codeBlockMatch[1].trim();
  }

  // 2. Jika terdapat tag <mxfile> atau <mxGraphModel>
  const fullModelMatch = text.match(/<mxGraphModel[\s\S]*?<\/mxGraphModel>/i);
  if (fullModelMatch) {
    return fullModelMatch[0];
  }

  const mxFileMatch = text.match(/<mxfile[\s\S]*?<\/mxfile>/i);
  if (mxFileMatch) {
    return mxFileMatch[0];
  }

  // 3. Jika hanya potongan mxCell
  const cells = [];
  const cellRegex = /<mxCell[\s\S]*?(?:<\/mxCell>|\/>)/gi;
  let match;
  while ((match = cellRegex.exec(text)) !== null) {
    const cellStr = match[0];
    // Pastikan tidak menduplikasi root id 0 dan 1
    if (!cellStr.includes('id="0"') && !cellStr.includes('id="1"')) {
      cells.push(cellStr);
    }
  }

  if (cells.length > 0) {
    return wrapInMxGraphModel(cells.join('\n    '));
  }

  // Fallback: jika tidak ditemukan pola yang cocok, kembalikan blank
  return BLANK_DRAWIO_XML;
}
