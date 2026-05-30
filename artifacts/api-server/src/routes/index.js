"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const youtube_1 = __importDefault(require("./youtube"));
const email_1 = __importDefault(require("./email"));
const chat_1 = __importDefault(require("./chat"));
const router = (0, express_1.Router)();
router.use(health_1.default);
router.use(youtube_1.default);
router.use(email_1.default);
router.use(chat_1.default);
exports.default = router;
