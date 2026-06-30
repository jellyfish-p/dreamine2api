import path from 'path';
import _util from 'util';

import 'colors';
import _ from 'lodash';
import fs from 'fs-extra';
import { format as dateFormat } from 'date-fns';

import { readAppConfig } from '../config/app-config';
import util from './util';

const isVercelEnv = process.env.VERCEL;

function loggerConfig() {
    try {
        const config = readAppConfig();
        return {
            debug: process.env.DEBUG === "1" || process.env.DREAMINE_DEBUG === "1",
            logDirPath: path.resolve(config.system.log_dir || "./logs"),
            logWriteInterval: 200,
        };
    } catch {
        return {
            debug: process.env.DEBUG === "1" || process.env.DREAMINE_DEBUG === "1",
            logDirPath: path.resolve("./logs"),
            logWriteInterval: 200,
        };
    }
}

const runtimeConfig = loggerConfig();

class LogWriter {

    #buffers: Buffer[] = [];

    constructor() {
        !isVercelEnv && fs.ensureDirSync(runtimeConfig.logDirPath);
        !isVercelEnv && this.work();
    }

    push(content: string) {
        const buffer = Buffer.from(content);
        this.#buffers.push(buffer);
    }

    writeSync(buffer: Buffer) {
        !isVercelEnv && fs.appendFileSync(path.join(runtimeConfig.logDirPath, `/${util.getDateString()}.log`), buffer);
    }

    async write(buffer: Buffer) {
        !isVercelEnv && await fs.appendFile(path.join(runtimeConfig.logDirPath, `/${util.getDateString()}.log`), buffer);
    }

    flush() {
        if(!this.#buffers.length) return;
        !isVercelEnv && fs.appendFileSync(path.join(runtimeConfig.logDirPath, `/${util.getDateString()}.log`), Buffer.concat(this.#buffers));
    }

    work() {
        if (!this.#buffers.length) return setTimeout(this.work.bind(this), runtimeConfig.logWriteInterval);
        const buffer = Buffer.concat(this.#buffers);
        this.#buffers = [];
        this.write(buffer)
        .finally(() => setTimeout(this.work.bind(this), runtimeConfig.logWriteInterval))
        .catch(err => console.error("Log write error:", err));
    }

}

class LogText {

    /** @type {string} 日志级别 */
    level: string;
    /** @type {string} 日志文本 */
    text: string;
    /** @type {string} 日志来源 */
    source: any;
    /** @type {Date} 日志发生时间 */
    time = new Date();

    constructor(level: string, ...params: any[]) {
        this.level = level;
        this.text = _util.format.apply(null, params);
        this.source = this.#getStackTopCodeInfo();
    }

    #getStackTopCodeInfo() {
        const unknownInfo = { name: "unknown", codeLine: 0, codeColumn: 0 };
        const stackArray = new Error().stack!.split("\n");
        const text = stackArray[4];
        if (!text)
            return unknownInfo;
        const match = text.match(/at (.+) \((.+)\)/) || text.match(/at (.+)/);
        if (!match || !_.isString(match[2] || match[1]))
            return unknownInfo;
        const temp = (match[2] || match[1])!;
        const _match = temp.match(/([a-zA-Z0-9_\-\.]+)\:(\d+)\:(\d+)$/);
        if (!_match)
            return unknownInfo;
        const [, scriptPath, codeLine, codeColumn] = _match as any;
        return {
            name: scriptPath ? scriptPath.replace(/.js$/, "") : "unknown",
            path: scriptPath || null,
            codeLine: parseInt(codeLine || 0),
            codeColumn: parseInt(codeColumn || 0)
        };
    }

    toString() {
        return `[${dateFormat(this.time, "yyyy-MM-dd HH:mm:ss.SSS")}][${this.level}][${this.source.name}<${this.source.codeLine},${this.source.codeColumn}>] ${this.text}`;
    }

}

class Logger {

    /** @type {Object} 系统配置 */
    config = {};
    /** @type {Object} 日志级别映射 */
    static Level = {
        Success: "success",
        Info: "info",
        Log: "log",
        Debug: "debug",
        Warning: "warning",
        Error: "error",
        Fatal: "fatal"
    };
    /** @type {Object} 日志级别文本颜色 */
    static LevelColor: Record<string, string> = {
        [Logger.Level.Success]: "green",
        [Logger.Level.Info]: "brightCyan",
        [Logger.Level.Log]: "white",
        [Logger.Level.Debug]: "white",
        [Logger.Level.Warning]: "brightYellow",
        [Logger.Level.Error]: "brightRed",
        [Logger.Level.Fatal]: "red"
    };
    #writer: LogWriter;

    constructor() {
        this.#writer = new LogWriter();
    }

    #colorize(content: string, level: string) {
        const color = Logger.LevelColor[level];
        if (!color) return content;
        const colored = (content as any)[color];
        return _.isString(colored) ? colored : content;
    }

    header() {
        this.#writer.writeSync(Buffer.from(`\n\n===================== LOG START ${dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss.SSS")} =====================\n\n`));
    }

    footer() {
        this.#writer.flush();
        this.#writer.writeSync(Buffer.from(`\n\n===================== LOG END ${dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss.SSS")} =====================\n\n`));
    }

    success(...params: any[]) {
        const content = new LogText(Logger.Level.Success, ...params).toString();
        console.info(this.#colorize(content, Logger.Level.Success));
        this.#writer.push(content + "\n");
    }

    info(...params: any[]) {
        const content = new LogText(Logger.Level.Info, ...params).toString();
        console.info(this.#colorize(content, Logger.Level.Info));
        this.#writer.push(content + "\n");
    }

    log(...params: any[]) {
        const content = new LogText(Logger.Level.Log, ...params).toString();
        console.log(this.#colorize(content, Logger.Level.Log));
        this.#writer.push(content + "\n");
    }

    debug(...params: any[]) {
        if(!runtimeConfig.debug) return;
        const content = new LogText(Logger.Level.Debug, ...params).toString();
        console.debug(this.#colorize(content, Logger.Level.Debug));
        this.#writer.push(content + "\n");
    }

    warn(...params: any[]) {
        const content = new LogText(Logger.Level.Warning, ...params).toString();
        console.warn(this.#colorize(content, Logger.Level.Warning));
        this.#writer.push(content + "\n");
    }

    error(...params: any[]) {
        const content = new LogText(Logger.Level.Error, ...params).toString();
        console.error(this.#colorize(content, Logger.Level.Error));
        this.#writer.push(content + "\n");
    }

    fatal(...params: any[]) {
        const content = new LogText(Logger.Level.Fatal, ...params).toString();
        console.error(this.#colorize(content, Logger.Level.Fatal));
        this.#writer.push(content + "\n");
    }

}

export default new Logger();
