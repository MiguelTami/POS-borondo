import { PaymentService } from "../services/payment.service";
import { Request, Response } from "express";
import { CreatePaymentDTO } from "../types/payment.types";

export class PaymentController {

    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    createPayment = async (req: Request, res: Response) => {
        const rawData = req.validatedBody;
        const subOrderId = rawData.subOrderId;
        const shiftId = rawData.shiftId;
        const method = rawData.method
        try {
            const payment = await this.paymentService.createPayment(subOrderId, shiftId, method);
            res.status(201).json(payment);
        } catch (error) {
            console.error("Error al crear el pago:", error.message);
            if (error.message === "No se pueden agregar pagos a una sub-orden que está cancelada o pagada" || 
                error.message === "No se pueden agregar pagos a una sub-orden que no ha sido enviada al cajero"||
                error.message === "SubOrden no encontrada") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al crear el pago' });
        }
    }
}