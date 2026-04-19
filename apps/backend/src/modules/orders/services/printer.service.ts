import { exec } from "child_process";
import fs from "fs";
import path from "path";

const removeAccents = (str: string): string => {
  if (!str) return str;
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export class PrinterService {
  static async printKitchenTicket(comandaInfo: any) {
    // Definición de comandos ESC/POS
    const INIT = [0x1b, 0x40];
    const DOUBLE_SIZE = [0x1d, 0x21, 0x11]; // Doble ancho y doble alto (0x11 = 17 en decimal)
    const NORMAL_SIZE = [0x1d, 0x21, 0x00];
    const BOLD_ON = [0x1b, 0x45, 0x01];
    const BOLD_OFF = [0x1b, 0x45, 0x00];
    const CENTER = [0x1b, 0x61, 0x01];
    const LEFT = [0x1b, 0x61, 0x00];
    const CUT = [0x1d, 0x56, 0x00];

    // Construcción del ticket
    let chunks: Buffer[] = [];

    // 1. Encabezado
    chunks.push(Buffer.from(INIT));
    chunks.push(Buffer.from(CENTER));
    chunks.push(Buffer.from(DOUBLE_SIZE));
    chunks.push(Buffer.from("COMANDA COCINA\n"));
    chunks.push(Buffer.from(NORMAL_SIZE));
    chunks.push(Buffer.from(`Sub-Orden: ${removeAccents(comandaInfo.label)}\n`));
    chunks.push(Buffer.from(`Fecha: ${new Date().toLocaleString()}\n`));
    chunks.push(Buffer.from("--------------------------------\n"));

    // 2. Items
    chunks.push(Buffer.from(LEFT));
    comandaInfo.items.forEach((item: any) => {
      // Cantidad y Producto en Negrita y ligeramente más grandes si quieres, 
      // pero para 58mm el DOUBLE_SIZE puede ser MUY grande. 
      // Usemos negrita para el producto:
      chunks.push(Buffer.from(BOLD_ON));
      chunks.push(Buffer.from(`${item.quantity}x ${(removeAccents(item.productName).toUpperCase())}\n`));
      chunks.push(Buffer.from(BOLD_OFF));

      // 3. Notas (Más oscuras con Negrita)
      if (item.notes) {
        chunks.push(Buffer.from(BOLD_ON));
        chunks.push(Buffer.from(`   * NOTA: ${removeAccents(item.notes)}\n`));
        chunks.push(Buffer.from(BOLD_OFF));
      }
      chunks.push(Buffer.from("\n")); // Espacio entre items
    });

    // 4. Finalización
    chunks.push(Buffer.from("--------------------------------\n"));
    chunks.push(Buffer.from("\n\n\n\n\n")); // Espacio para corte
    chunks.push(Buffer.from(CUT));

    const comandos = Buffer.concat(chunks);
    const tempFile = path.join(__dirname, `comanda_${Date.now()}.bin`);

    try {
      fs.writeFileSync(tempFile, comandos);
      const command = `copy /b "${tempFile}" "\\\\127.0.0.1\\Comanda"`;

      exec(command, (error, stdout, stderr) => {
        if (error) console.error("❌ Error:", stderr || error.message);
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      });
    } catch (err) {
      console.error("Error de sistema:", err);
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
}

  static async printReceipt(receiptInfo: any) {
    // Definición de comandos RAW
    const INIT = [0x1b, 0x40];
    const DOUBLE_SIZE = [0x1d, 0x21, 0x11]; // Doble ancho y alto
    const NORMAL_SIZE = [0x1d, 0x21, 0x00];
    const BOLD_ON = [0x1b, 0x45, 0x01];
    const BOLD_OFF = [0x1b, 0x45, 0x00];
    const CENTER = [0x1b, 0x61, 0x01];
    const LEFT = [0x1b, 0x61, 0x00];
    const CUT = [0x1d, 0x56, 0x00];

    const chunks: Buffer[] = [];

    // 1. Encabezado - KPRICHOS (Grande y centrado)
    chunks.push(Buffer.from(INIT));
    chunks.push(Buffer.from(CENTER));
    chunks.push(Buffer.from(DOUBLE_SIZE));
    chunks.push(Buffer.from(BOLD_ON));
    chunks.push(Buffer.from("KPRICHOS\n"));
    chunks.push(Buffer.from(NORMAL_SIZE)); // Regresar a normal
    chunks.push(Buffer.from(BOLD_OFF));
    
    // 2. Información del Recibo
    chunks.push(Buffer.from("--------------------------------\n"));
    chunks.push(Buffer.from(BOLD_ON));
    chunks.push(Buffer.from("RECIBO DE PAGO\n"));
    chunks.push(Buffer.from(BOLD_OFF));
    chunks.push(Buffer.from(`Sub-Orden: ${removeAccents(receiptInfo.label)}\n`));
    chunks.push(Buffer.from(`Fecha: ${new Date().toLocaleString()}\n`));
    chunks.push(Buffer.from("--------------------------------\n"));

    // 3. Ítems
    chunks.push(Buffer.from(LEFT));
    receiptInfo.items.forEach((item: any) => {
        // Formato: 1x PRODUCTO: $10.00
        const itemLine = `${item.quantity}x ${removeAccents(item.productName)}: $${item.totalPrice}\n`;
        chunks.push(Buffer.from(itemLine));
        
        if (item.notes) {
            // Notas en negrita para resaltar
            chunks.push(Buffer.from(BOLD_ON));
            chunks.push(Buffer.from(`   *Nota: ${removeAccents(item.notes)}\n`));
            chunks.push(Buffer.from(BOLD_OFF));
        }
    });

    // 4. Total (Grande y resaltado)
    chunks.push(Buffer.from("--------------------------------\n"));
    chunks.push(Buffer.from(CENTER));
    chunks.push(Buffer.from(DOUBLE_SIZE));
    chunks.push(Buffer.from(BOLD_ON));
    chunks.push(Buffer.from(`TOTAL: $${receiptInfo.total}\n`));
    chunks.push(Buffer.from(NORMAL_SIZE));
    chunks.push(Buffer.from(BOLD_OFF));

    // 5. Pie de página y corte
    chunks.push(Buffer.from(CENTER));
    chunks.push(Buffer.from("\nGracias por su compra\n"));
    chunks.push(Buffer.from("\n\n\n\n\n"));
    chunks.push(Buffer.from(CUT));

    const comandos = Buffer.concat(chunks);
    const tempFile = path.join(__dirname, `recibo_${Date.now()}.bin`);

    try {
        fs.writeFileSync(tempFile, comandos);

        // Usamos el nombre compartido que ya configuraste
        const command = `copy /b "${tempFile}" "\\\\127.0.0.1\\Comanda"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("❌ Error al imprimir recibo:", stderr || error.message);
            } else {
                console.log("✅ ¡Recibo impreso con éxito!");
            }
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        });
    } catch (err) {
        console.error("Error de sistema al imprimir recibo:", err);
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
}
}
