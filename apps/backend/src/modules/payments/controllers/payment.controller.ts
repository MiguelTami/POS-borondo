import { PaymentService } from "../services/payment.service";
import { Request, Response } from "express";
import { CreatePaymentDTO } from "../types/payment.types";

export class PaymentController {

    private service: PaymentService;

    constructor() {
        this.service = new PaymentService();
    }

    getPayments = async (req: Request, res: Response) => {
        try {
            const filters = req.validatedQuery;
            const payments = await this.service.getPayments(filters);
            res.status(200).json(payments);
        } catch (error) {
            console.error("Error al obtener los pagos:", error.message);
            if (error.message === "La fecha de inicio no puede ser mayor que la fecha de fin") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al obtener los pagos' });
        }
    }

    createPayment = async (req: Request, res: Response) => {
        const rawData = req.validatedBody;
        const subOrderId = rawData.subOrderId;
        const shiftId = rawData.shiftId;
        const method = rawData.method;
        const printReceipt = rawData.printReceipt;
        const cashierId = req.user!.id;
        try {
            const payment = await this.service.createPayment(subOrderId, shiftId, method, cashierId, printReceipt);
            res.status(201).json(payment);
        } catch (error) {
            console.error("Error al crear el pago:", error.message);
            if (error.message === "No se pueden agregar pagos a una sub-orden que está cancelada o pagada" || 
                error.message === "No se pueden agregar pagos a una sub-orden que no ha sido enviada a cocina" ||
                error.message === "Solo se pueden agregar pagos al turno activo") {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "SubOrden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al crear el pago' });
        }
    }

    getPaymentById = async (req: Request, res: Response) => {
        const paymentId = req.validatedParams.paymentId;
        try {
            const payment = await this.service.getPaymentById(paymentId);
            res.status(200).json(payment);
        } catch (error) {
            console.error("Error al obtener el pago:", error.message);
            if (error.message === "Pago no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al obtener el pago' });
        }
    }

    getPaymentBySubOrder = async (req: Request, res: Response) => {
        const subOrderId = req.validatedParams.subOrderId;
        try {
            const payment = await this.service.getPaymentBySubOrder(subOrderId);
            res.status(200).json(payment);
        } catch (error) {
            console.error("Error al obtener el pago:", error.message);
            if (error.message === "Pago no encontrado" || error.message === "SubOrden no encontrada") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al obtener el pago' });
        }
    }

    updatePayment = async (req: Request, res: Response) => {
        const paymentId = req.validatedParams.paymentId;
        const method = req.validatedBody.method;
        try {
            const payment = await this.service.updatePayment(paymentId, method);
            res.status(200).json(payment);
        } catch (error) {
            console.error("Error al actualizar el pago:", error.message);
            if (error.message === "Pago no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al actualizar el pago' });
        }
    }

    deletePayment = async (req: Request, res: Response) => {
        const paymentId = req.validatedParams.paymentId;
        try {
            await this.service.deletePayment(paymentId);
            res.status(200).json({ message: 'Pago eliminado correctamente' });
        } catch (error) {
            console.error("Error al eliminar el pago:", error.message);
            if (error.message === "Pago no encontrado") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "No se pueden eliminar pagos de una orden que ya ha sido pagada o cancelada") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al eliminar el pago' });
        }
    }
}