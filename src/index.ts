"use strict";

const DAY: number = 24 * 60 * 60000;

function timeDiffString(start: number, end: number){
	let diff: number = Math.abs(start - end);
	const days: number = Math.floor(diff / DAY);
	diff = diff - (days * DAY);
	let result: string = (new Date(diff)).toISOString().slice(-13, -1);
	if (days) result = `${days} days, ${result}`;
	return result;
}

type LEVEL_CODE = "info" | "error" | "warn" | "debug" | "fatal";
type LEVEL_ITEM = {
	color: string,
	text: string,
	method: string
};

type LEVEL_OBJ = {
	[k in LEVEL_CODE]: LEVEL_ITEM;
}

const LEVELS: LEVEL_OBJ = {
	info: { color: "\x1b[32m", text: '[INFO]', method: 'info' },
	error: { color: "\x1b[91m", text: '[ERROR]', method: 'error' },
	warn: { color: "\x1b[33m", text: '[WARN]', method: 'info' },
	debug: { color: "\x1b[36m", text: '[DEBUG]', method: 'info' },
	fatal: { color: "\x1b[35m", text: '[FATAL]', method: 'error' }
};

function fdp(part: number){
	return part.toString().padStart(2, "0");
}

function color_log(name: string, level_code: LEVEL_CODE, ...args: any[]) {
	const d = new Date();
	const level: LEVEL_ITEM = LEVELS[level_code];

	let s = `${level.color}[${d.getFullYear()}-${fdp(d.getMonth() + 1)}-${fdp(d.getDate())}T${fdp(d.getHours())}:${fdp(d.getMinutes())}:${fdp(d.getSeconds())}.${d.getMilliseconds().toString().padStart(3, "0")}] ${level.text} ${name} - \x1b[39m`;

	if (typeof (args[0]) == 'string') s += args.shift();
	console[level.method](s, ...args);
}

export class Logger {
	readonly name: string;
	private _b_debug = false;

	constructor(name: string){
		if (!name) throw new Error(`name required`);
		this.name = name;
		return this;
	}

	info(...args: any[]): this {
		color_log(this.name, "info", ...args);
		return this;
	}

	warn(...args: any[]): this {
		color_log(this.name, "warn", ...args);
		return this;
	}

	error(...args: any[]): this {
		color_log(this.name, "error", ...args);
		return this;
	}

	debug(...args: any[]): this {
		if (this._b_debug) color_log(this.name, "debug", ...args);
		return this;
	}

	fatal(...args: any[]): this {
		color_log(this.name, "fatal", ...args);
		return this;
	}

	dashline(len = 100): this {
		len = len || 100;
		if (len < 0) throw new Error(`Invalid dashline length`);
		console.log("".padStart(len, "-"));
		return this;
	}

	get level(): 'debug' | 'info' { return this._b_debug ? 'debug' : 'info'; }

	set level(value: 'debug' | 'info') {
		if (value === 'debug'){
			this._b_debug = true;
		} else if (value === 'info'){
			this._b_debug = false;
		} else {
			this.warn('level', value, 'not supported');
		}
	}

	child(name: string): Logger {
		if (!name) throw new Error(`Invalid child name`);
		const result: Logger = new Logger(`${this.name}.${name}`);
		if (this._b_debug) result.level = 'debug';
		return result;
	}

	time(name: string, level: LEVEL_CODE = 'debug'): ()=>void {
		if (!name) throw new Error(`Invalid time name`);

		level = level || 'debug';

		if (level === 'debug' && !this._b_debug){
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			return ()=>{};
		}

		const start = Date.now();

		this[level](name, 'started');

		let finished = false;

		return ()=>{
			if (finished) throw new Error(`Double call of finish for ${this.name}.${name}`);
			finished = true;
			this.debug(name, 'finished', timeDiffString(start, Date.now()));
		};
	}
}
