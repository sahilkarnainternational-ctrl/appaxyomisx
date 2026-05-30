"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
router.post("/send-report", async (req, res) => {
    const { to, parentName, studentName, reportHtml, reportText } = req.body;
    if (!to || !reportHtml) {
        res.status(400).json({ success: false, message: "Missing required fields: to, reportHtml" });
        return;
    }
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (!gmailUser || !gmailPass) {
        res.status(503).json({
            success: false,
            message: "Email service not configured. Please copy the report and share it manually. To enable emails, add GMAIL_USER and GMAIL_APP_PASSWORD secrets.",
        });
        return;
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: { user: gmailUser, pass: gmailPass },
        });
        await transporter.sendMail({
            from: `"Axyomis-X" <${gmailUser}>`,
            to,
            subject: `📚 Daily Learning Report — ${studentName} · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            text: reportText,
            html: reportHtml,
        });
        req.log.info({ to, studentName }, "Parent report email sent");
        res.json({ success: true, message: `Report sent to ${to}` });
    }
    catch (err) {
        req.log.error({ err }, "Failed to send parent report email");
        res.status(500).json({ success: false, message: `Failed to send: ${err.message}. Try copying the report instead.` });
    }
});
exports.default = router;
