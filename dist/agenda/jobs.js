"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobs = void 0;
const utils_1 = require("../utils");
const database_1 = require("./database");
/**
 * Finds all jobs matching 'query'
 * @name Agenda#jobs
 * @function
 * @param [query] object for DB
 * @param [sort] object for DB
 * @param [limit] number of documents to return from DB
 * @param [number] of documents to skip in DB
 * @returns resolves when fails or passes
 */
const getJobs = function (query, sort = ["id", "DESC"], limit = 0, skip = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield database_1.jobs.findAll({
            where: query,
            limit: limit,
            order: sort,
            offset: skip,
        }); // eslint-disable-line;
        return result.map((job) => (0, utils_1.createJob)(this, job));
    });
};
exports.getJobs = getJobs;
//# sourceMappingURL=jobs.js.map