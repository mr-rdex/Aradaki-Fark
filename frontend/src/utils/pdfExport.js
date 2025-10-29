import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateComparisonPDF = (car1, car2) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Aradaki Fark', 105, 15, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Araç Karşılaştırma Raporu', 105, 25, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString('tr-TR');
  doc.text(`Rapor Tarihi: ${date}`, 105, 32, { align: 'center' });
  
  // Car Names
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`${car1.ArabaMarka} ${car1.CarModel}`, 50, 45, { align: 'center' });
  doc.text('VS', 105, 45, { align: 'center' });
  doc.text(`${car2.ArabaMarka} ${car2.CarModel}`, 160, 45, { align: 'center' });
  
  // Comparison Table
  const tableData = [
    ['Özellik', `${car1.ArabaMarka} ${car1.CarModel}`, `${car2.ArabaMarka} ${car2.CarModel}`],
    ['Paket', car1.CarPack, car2.CarPack],
    ['Yıl', car1.CarYear.toString(), car2.CarYear.toString()],
    ['Yakıt Tipi', car1.CarFuelType, car2.CarFuelType],
    ['Motor Hacmi', `${car1.CarEngineCapacity} cc`, `${car2.CarEngineCapacity} cc`],
    ['Beygir Gücü', `${car1.CarHorsePower} HP`, `${car2.CarHorsePower} HP`],
    ['Araç Tipi', car1.CarType, car2.CarType],
    ['Maksimum Hız', `${car1.CarTopSpeed} km/s`, `${car2.CarTopSpeed} km/s`],
    ['0-100 Hızlanma', `${car1.CarAcceleration} saniye`, `${car2.CarAcceleration} saniye`],
    ['Şanzıman', car1.CarTransmission, car2.CarTransmission],
    ['Yakıt Tüketimi', `${car1.CarEconomy} L/100km`, `${car2.CarEconomy} L/100km`],
    ['Ağırlık', `${car1.CarWeight} kg`, `${car2.CarWeight} kg`],
    ['Yükseklik', `${car1.CarHeight} mm`, `${car2.CarHeight} mm`],
    ['Genişlik', `${car1.CarWidth} mm`, `${car2.CarWidth} mm`],
    ['Çekiş Sistemi', car1.CarDriveTrain, car2.CarDriveTrain],
    ['Bagaj Kapasitesi', `${car1.CarBaggageLT} L`, `${car2.CarBaggageLT} L`],
  ];
  
  // Add brake distance if available
  if (car1.CarBrakeMetre || car2.CarBrakeMetre) {
    tableData.push([
      'Fren Mesafesi',
      car1.CarBrakeMetre ? `${car1.CarBrakeMetre} m` : '-',
      car2.CarBrakeMetre ? `${car2.CarBrakeMetre} m` : '-'
    ]);
  }
  
  // Add price
  const formatPrice = (price) => {
    if (!price) return 'Belirtilmemiş';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  tableData.push([
    'Fiyat',
    formatPrice(car1.CarPrice),
    formatPrice(car2.CarPrice)
  ]);
  
  // Add rating
  tableData.push([
    'Kullanıcı Puanı',
    car1.averageRating > 0 ? `${car1.averageRating} ⭐ (${car1.reviewCount})` : 'Henüz yok',
    car2.averageRating > 0 ? `${car2.averageRating} ⭐ (${car2.reviewCount})` : 'Henüz yok'
  ]);
  
  doc.autoTable({
    startY: 55,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 70 },
      2: { cellWidth: 70 }
    },
    margin: { left: 10, right: 10 }
  });
  
  // Footer
  const finalY = doc.lastAutoTable.finalY || 280;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Bu rapor AradakiFark.com tarafından oluşturulmuştur.', 105, finalY + 10, { align: 'center' });
  doc.text('Detaylı bilgi için: aradakifark.com', 105, finalY + 15, { align: 'center' });
  
  // Save PDF
  const fileName = `karsilastirma_${car1.ArabaMarka}_${car1.CarModel}_vs_${car2.ArabaMarka}_${car2.CarModel}.pdf`;
  doc.save(fileName);
};
