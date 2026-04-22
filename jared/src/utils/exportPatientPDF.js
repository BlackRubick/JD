// Utilidad para exportar datos de paciente a PDF - Psyiooneer
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Paleta de marca Psyiooneer ──────────────────────────────────────────────
const BRAND = {
  primary:    [67,  97,  238],
  secondary:  [114, 9,   183],
  accent:     [76,  201, 240],
  dark:       [17,  17,  34],
  mid:        [72,  72,  110],
  light:      [240, 242, 255],
  white:      [255, 255, 255],
  divider:    [220, 224, 255],
};

// Helpers
const setFill   = (doc, arr) => doc.setFillColor(...arr);
const setDraw   = (doc, arr) => doc.setDrawColor(...arr);
const setTColor = (doc, arr) => doc.setTextColor(...arr);
const setFont   = (doc, style = 'normal', size = 11) => {
  doc.setFont('helvetica', style);
  doc.setFontSize(size);
};

// Header
function drawHeader(doc, folio) {
  const W = doc.internal.pageSize.getWidth();

  setFill(doc, BRAND.primary);
  doc.rect(0, 0, W, 42, 'F');

  setFill(doc, BRAND.secondary);
  doc.rect(0, 0, 6, 42, 'F');

  setFill(doc, BRAND.accent);
  doc.rect(0, 39, W, 3, 'F');

  setFont(doc, 'bold', 20);
  setTColor(doc, BRAND.white);
  doc.text('Psyiooneer', 14, 18);

  setFont(doc, 'normal', 8);
  setTColor(doc, [200, 210, 255]);
  doc.text('Plataforma de evaluación psicológica', 14, 25);

  setFont(doc, 'bold', 9);
  const folioText = `FOLIO: ${folio}`;
  const tw = doc.getTextWidth(folioText);
  doc.text(folioText, W - 14 - tw, 22);

  setFont(doc, 'normal', 8);
  const fecha = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const fw = doc.getTextWidth(fecha);
  doc.text(fecha, W - 14 - fw, 30);
}

// Footer
function drawFooter(doc, pageNum, totalPages) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  setFill(doc, BRAND.light);
  doc.rect(0, H - 16, W, 16, 'F');

  setFill(doc, BRAND.accent);
  doc.rect(0, H - 16, W, 1.5, 'F');

  setFont(doc, 'normal', 8);
  setTColor(doc, BRAND.mid);
  doc.text('Psyiooneer · Reporte confidencial de paciente', 14, H - 6);

  const paginaText = `Página ${pageNum} de ${totalPages}`;
  const pw = doc.getTextWidth(paginaText);
  doc.text(paginaText, W - 14 - pw, H - 6);
}

// Section title
function sectionTitle(doc, text, y) {
  const W = doc.internal.pageSize.getWidth();

  setFill(doc, BRAND.light);
  doc.rect(10, y - 5, W - 20, 10, 'F');

  setFill(doc, BRAND.primary);
  doc.rect(10, y - 5, 3, 10, 'F');

  setFont(doc, 'bold', 10);
  setTColor(doc, BRAND.primary);
  doc.text(text.toUpperCase(), 17, y + 1.5);

  return y + 10;
}

// Info row
function infoRow(doc, label, value, x, y, colWidth) {
  setFont(doc, 'bold', 8);
  setTColor(doc, BRAND.mid);
  doc.text(label, x, y);

  setFont(doc, 'normal', 9);
  setTColor(doc, BRAND.dark);

  const displayVal = value || '—';
  const split = doc.splitTextToSize(displayVal, colWidth - 4);
  doc.text(split[0], x, y + 5);

  return split.length > 1 ? y + 12 : y + 10;
}

// Patient card
function drawPatientCard(doc, profile, age, sex, folio, startY) {
  const W = doc.internal.pageSize.getWidth();
  const colW = (W - 28) / 3;

  const fields = [
    ['Nombre', profile.name || ''],
    ['Folio', folio || ''],
    ['Edad', age ? `${age} años` : ''],
    ['Sexo', sex || ''],
    ['Correo', profile.email || ''],
    ['Teléfono', ''],
  ];

  let y = startY;
  const rows = Math.ceil(fields.length / 3);

  setFill(doc, BRAND.white);
  setDraw(doc, BRAND.divider);
  doc.roundedRect(10, y - 2, W - 20, rows * 16 + 6, 3, 3, 'FD');

  fields.forEach(([label, val], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    infoRow(doc, label, val, 14 + col * colW, y + 6 + row * 16, colW);
  });

  return y + rows * 16 + 10;
}

// Record
function drawRecord(doc, record, startY) {
  const W = doc.internal.pageSize.getWidth();
  const colW = (W - 28) / 2;

  const fields = [
    ['CURP', record.curp || ''],
    ['Teléfono', record.phone || ''],
    ['Nacionalidad', record.nationality || ''],
    ['Lugar de nacimiento', record.birthplace || ''],
    ['Municipio/Estado', record.state || ''],
    ['Localidad', record.city || ''],
    ['Código postal', record.postal_code || ''],
    ['Dirección', record.address_line || ''],
    ['Alergias', record.allergies || ''],
    ['Padecimientos crónicos', record.chronic_conditions || ''],
    ['Medicación actual', record.current_medications || ''],
    ['Notas clínicas', record.notes || ''],
  ];

  let y = startY;
  const rows = Math.ceil(fields.length / 2);

  setFill(doc, BRAND.white);
  setDraw(doc, BRAND.divider);
  doc.roundedRect(10, y - 2, W - 20, rows * 16 + 6, 3, 3, 'FD');

  fields.forEach(([label, val], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    infoRow(doc, label, val, 14 + col * colW, y + 6 + row * 16, colW);
  });

  return y + rows * 16 + 10;
}

// EXPORT PRINCIPAL
export function exportPatientPDF(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const { folio, age, sex, tests, profile, record } = data;

  drawHeader(doc, folio);

  let y = 52;

  setFont(doc, 'bold', 14);
  setTColor(doc, BRAND.dark);
  doc.text('Reporte de Paciente', 14, y);

  setFont(doc, 'normal', 9);
  setTColor(doc, BRAND.mid);
  doc.text('Información confidencial generada por Psyiooneer', 14, y + 7);
  y += 16;

  y = sectionTitle(doc, 'Datos generales', y);
  y = drawPatientCard(doc, profile, age, sex, folio, y);

  y = sectionTitle(doc, 'Expediente clínico', y);
  y = drawRecord(doc, record, y);

  // TABLA
  if (tests?.length) {
    if (y > 220) {
      doc.addPage();
      drawHeader(doc, folio);
      y = 52;
    }

    y = sectionTitle(doc, 'Historial de evaluaciones', y);

    autoTable(doc, {
      startY: y,
      head: [['Test', 'Fecha', 'Puntaje', 'Interpretación']],
      body: tests.map(t => [
        t.name || '',
        t.date ? new Date(t.date).toLocaleDateString('es-MX') : '—',
        t.score ?? '—',
        t.interpretation || '—',
      ]),
    });
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`Psyiooneer_Paciente_${folio}.pdf`);
}