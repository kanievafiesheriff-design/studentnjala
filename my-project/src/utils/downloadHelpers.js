export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(content, filename, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

export function printElement(element, title = "NUNA Document") {
  if (!element) return;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { margin: 0; padding: 24px; font-family: Arial, sans-serif; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>${element.outerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 400);
}

export function mapAnnouncement(item) {
  return {
    id: item._id,
    title: item.title,
    content: item.content,
    category: item.category,
    author: item.author || "NUNA Admin",
    date: item.createdAt,
    pinned: !!item.pinned,
    urgent: !!item.urgent,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
  };
}

export function mapApplication(item) {
  const hospital =
    typeof item.hospital === "object" && item.hospital
      ? item.hospital
      : { hospital: "Hospital", location: "" };

  return {
    id: item._id,
    hospitalId: hospital._id || item.hospital,
    hospitalName: hospital.hospital || "Hospital",
    location: hospital.location || "",
    department: item.department,
    preferredStartDate: item.preferredStartDate,
    reason: item.reason,
    status: item.status,
    appliedAt: item.appliedAt || item.createdAt,
    adminNote: item.adminNote,
    studentName: item.student?.name,
    email: item.student?.email,
  };
}
