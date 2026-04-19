import { exec } from "child_process";
import fs from "fs";
import path from "path";

export class PrinterService {
  static async printKitchenTicket(comandaInfo: any) {
    // 1. Los comandos ESC/POS (Inicializar + Texto + Corte)
    // Usamos un Buffer para asegurar que los bytes no se alteren
    const comandos = Buffer.concat([
      Buffer.from([0x1b, 0x40]), // Inicializar
      Buffer.from("   COMANDA DE COCINA\n"),
      Buffer.from("--------------------------------\n"),
      Buffer.from(`Sub-Orden: ${comandaInfo.label}\n`),
      Buffer.from(`Fecha: ${new Date().toLocaleString()}\n`),
      Buffer.from("--------------------------------\n"),
      ...comandaInfo.items.map((item: any) =>
        Buffer.from(
          `${item.quantity}x ${item.productName}\n${item.notes ? `   *Nota: ${item.notes}\n` : ""}`,
        ),
      ),
      Buffer.from("\n\n\n\n\n"), // Espacios para poder cortar
      Buffer.from([0x1d, 0x56, 0x00]), // Comando de corte (si tiene)
    ]);

    const tempFile = path.join(__dirname, `comanda_${Date.now()}.bin`);

    try {
      // 2. Guardamos el archivo en binario puro
      fs.writeFileSync(tempFile, comandos);

      // 3. Enviamos a la impresora usando el nombre compartido "Comanda"
      // Nota: Usamos localhost para no depender del nombre del PC
      const command = `copy /b "${tempFile}" "\\\\127.0.0.1\\Comanda"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(
            "❌ Error al imprimir comanda:",
            stderr || error.message,
          );
        } else {
          console.log("✅ ¡Comanda enviada a la impresora!");
        }
        // Borrar temporal
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      });
    } catch (err) {
      console.error("Error de sistema al imprimir comanda:", err);
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
  }

  static async printReceipt(receiptInfo: any) {
    const comandos = Buffer.concat([
      Buffer.from([0x1b, 0x40]), // Inicializar
      Buffer.from("   LA CASA DEL BORONDO\n"),
      Buffer.from("--------------------------------\n"),
      Buffer.from(`Recibo de Pago\n`),
      Buffer.from(`Sub-Orden: ${receiptInfo.label}\n`),
      Buffer.from(`Fecha: ${new Date().toLocaleString()}\n`),
      Buffer.from("--------------------------------\n"),
      ...receiptInfo.items.map((item: any) =>
        Buffer.from(
          `${item.quantity}x ${item.productName}: $${item.totalPrice}\n${item.notes ? `   *Nota: ${item.notes}\n` : ""}`,
        ),
      ),
      Buffer.from("--------------------------------\n"),
      Buffer.from(`TOTAL: $${receiptInfo.total}\n`),
      Buffer.from("\n\n\n\n\n"),
      Buffer.from([0x1d, 0x56, 0x00]),
    ]);

    const tempFile = path.join(__dirname, `recibo_${Date.now()}.bin`);

    try {
      fs.writeFileSync(tempFile, comandos);

      // Si la impresora de recibos se llama "Caja" o "Recibo", asumo "Comanda" para simplificar,
      // pero el usuario puede ajustar el nombre de recurso compartido.
      const command = `copy /b "${tempFile}" "\\\\127.0.0.1\\Comanda"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(
            "❌ Error al imprimir recibo:",
            stderr || error.message,
          );
        } else {
          console.log("✅ ¡Recibo enviado a la impresora!");
        }
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      });
    } catch (err) {
      console.error("Error de sistema al imprimir recibo:", err);
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
  }
}
