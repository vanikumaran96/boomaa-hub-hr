import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, AlignmentType, WidthType, BorderStyle, ShadingType,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";
import type { PayrollSummary } from "@/types/hr";
import type { Employee } from "@/types/hr";
import boomaaLogoUrl from "@/assets/boomaa-logo.jpg";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function makeCell(text: string, opts?: { bold?: boolean; width?: number; alignment?: typeof AlignmentType[keyof typeof AlignmentType]; shading?: string; colspan?: number }) {
  return new TableCell({
    borders,
    margins: cellMargins,
    width: opts?.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    columnSpan: opts?.colspan,
    shading: opts?.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: opts?.alignment || AlignmentType.LEFT,
      children: [new TextRun({ text, bold: opts?.bold, size: 20, font: "Arial" })],
    })],
  });
}

async function fetchImageBuffer(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export async function generatePayslipDocx(record: PayrollSummary, emp: Employee) {
  const logoBuffer = await fetchImageBuffer(boomaaLogoUrl);
  const periodLabel = `${MONTHS[record.month]} ${record.year}`;

  // Salary breakdown (standard Indian ratios)
  const gross = record.netPayable;
  const basic = Math.round(gross * 0.50);
  const hra = Math.round(gross * 0.20);
  const conveyance = Math.round(gross * 0.10);
  const special = gross - basic - hra - conveyance;

  // Deductions (placeholder zeroes — no deduction data currently)
  const tds = 0;
  const pf = 0;
  const profTax = 0;
  const loanAdv = 0;
  const totalDeductions = tds + pf + profTax + loanAdv;
  const netPay = gross - totalDeductions;

  const lopDays = record.unpaidLeaves + record.absentDays;

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 },
        },
      },
      children: [
        // Logo
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new ImageRun({
            type: "jpg",
            data: logoBuffer,
            transformation: { width: 160, height: 80 },
            altText: { title: "Boomaa Logo", description: "Boomaa Consultants Logo", name: "logo" },
          })],
        }),
        // Company Name
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80 },
          children: [new TextRun({ text: "Boomaa Consultants Pvt Ltd", bold: true, size: 24, font: "Arial" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Head Office: #840, Poonamallee High Road, Arumbakkam, Chennai - 600 106", size: 18, font: "Arial" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "www.boomaaconsultants.in", size: 18, font: "Arial", color: "0000FF" })],
        }),
        // Period
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 200 },
          children: [new TextRun({ text: `Pay Slip for the period ${periodLabel}`, bold: true, size: 22, font: "Arial" })],
        }),
        // Employee Info Table
        new Table({
          width: { size: 9840, type: WidthType.DXA },
          columnWidths: [2200, 2710, 2200, 2730],
          rows: [
            new TableRow({ children: [
              makeCell("Employee Information", { bold: true, colspan: 2, shading: "D9E2F3", width: 4910 }),
              makeCell("Employment Details", { bold: true, colspan: 2, shading: "D9E2F3", width: 4930 }),
            ]}),
            new TableRow({ children: [
              makeCell("Name:", { bold: true, width: 2200 }),
              makeCell(emp.name, { width: 2710 }),
              makeCell("Designation:", { bold: true, width: 2200 }),
              makeCell(emp.designation, { width: 2730 }),
            ]}),
            new TableRow({ children: [
              makeCell("Employee ID:", { bold: true, width: 2200 }),
              makeCell(emp.id, { width: 2710 }),
              makeCell("Date of Joining:", { bold: true, width: 2200 }),
              makeCell(emp.joiningDate, { width: 2730 }),
            ]}),
            new TableRow({ children: [
              makeCell("Bank Name:", { bold: true, width: 2200 }),
              makeCell(emp.bankName || "—", { width: 2710 }),
              makeCell("Paid Days:", { bold: true, width: 2200 }),
              makeCell(String(record.payableDays), { width: 2730 }),
            ]}),
            new TableRow({ children: [
              makeCell("Account No:", { bold: true, width: 2200 }),
              makeCell(emp.accountNumber || "—", { width: 2710 }),
              makeCell("LOP Days:", { bold: true, width: 2200 }),
              makeCell(String(lopDays), { width: 2730 }),
            ]}),
          ],
        }),
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        // Earnings & Deductions Table
        new Table({
          width: { size: 9840, type: WidthType.DXA },
          columnWidths: [3200, 1710, 3200, 1730],
          rows: [
            new TableRow({ children: [
              makeCell("Earnings Description", { bold: true, shading: "D9E2F3", width: 3200 }),
              makeCell("Amount (₹)", { bold: true, shading: "D9E2F3", alignment: AlignmentType.RIGHT, width: 1710 }),
              makeCell("Deductions Description", { bold: true, shading: "D9E2F3", width: 3200 }),
              makeCell("Amount (₹)", { bold: true, shading: "D9E2F3", alignment: AlignmentType.RIGHT, width: 1730 }),
            ]}),
            new TableRow({ children: [
              makeCell("Basic Salary", { width: 3200 }),
              makeCell(basic.toLocaleString("en-IN"), { alignment: AlignmentType.RIGHT, width: 1710 }),
              makeCell("Income Tax (TDS)", { width: 3200 }),
              makeCell(tds.toLocaleString("en-IN"), { alignment: AlignmentType.RIGHT, width: 1730 }),
            ]}),
            new TableRow({ children: [
              makeCell("House Rent Allowance (HRA)", { width: 3200 }),
              makeCell(hra.toLocaleString("en-IN"), { alignment: AlignmentType.RIGHT, width: 1710 }),
              makeCell("Provident Fund (PF)", { width: 3200 }),
              makeCell(pf.toLocaleString("en-IN"), { alignment: AlignmentType.RIGHT, width: 1730 }),
            ]}),
            new TableRow({ children: [
              makeCell("Conveyance Allowance", { width: 3200 }),
              makeCell(conveyance.toLocaleString("en-IN"), { alignment: AlignmentType.RIGHT, width: 1710 }),
              makeCell("Professional Tax", { width: 3200 }),
              makeCell(profTax.toLocaleString("en-IN"), { alignment: AlignmentType.RIGHT, width: 1730 }),
            ]}),
            new TableRow({ children: [
              makeCell("Special Allowance", { width: 3200 }),
              makeCell(special.toLocaleString("en-IN"), { alignment: AlignmentType.RIGHT, width: 1710 }),
              makeCell("Salary Advance / Loans", { width: 3200 }),
              makeCell(loanAdv.toLocaleString("en-IN"), { alignment: AlignmentType.RIGHT, width: 1730 }),
            ]}),
            new TableRow({ children: [
              makeCell("Gross Earnings", { bold: true, width: 3200 }),
              makeCell(`₹ ${gross.toLocaleString("en-IN")}`, { bold: true, alignment: AlignmentType.RIGHT, width: 1710 }),
              makeCell("Total Deductions", { bold: true, width: 3200 }),
              makeCell(`₹ ${totalDeductions.toLocaleString("en-IN")}`, { bold: true, alignment: AlignmentType.RIGHT, width: 1730 }),
            ]}),
            new TableRow({ children: [
              makeCell("Total Net Payable:", { bold: true, width: 3200 }),
              makeCell(`₹ ${netPay.toLocaleString("en-IN")}`, { bold: true, colspan: 3, width: 6640 }),
            ]}),
          ],
        }),
        // Footer
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [new TextRun({
            text: "This is a system-generated document and does not require a physical signature.",
            italics: true, size: 18, font: "Arial", color: "666666",
          })],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Payslip_${emp.id}_${MONTHS[record.month]}_${record.year}.docx`);
}
