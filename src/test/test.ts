import {Logger} from '../index';

describe('Logger methods', () => {
	let logger: Logger;
	it('create', () => {
		logger = new Logger("test");
	});
	it("info", ()=>{
		logger.info("message", {});
	});
	it("warn", ()=>{
		logger.warn("attention", {});
	});
	it("error", ()=>{
		logger.error("oops!", new Error("test"));
	});
	it("level", ()=>{
		logger.level = 'debug';
		expect(logger.level).toEqual('debug');
	});
	it("debug", ()=>{
		logger.debug("x=1");
	});
	it("fatal", () => {
		logger.error(new Error("Fatality"));
	});
	it("dashline", () => {
		logger.dashline(5);
	});
	it("child", () => {
		const child = logger.child("child");
		expect(child).toBeInstanceOf(Logger);
		expect(child.name).toEqual("test.child");
	});
	it("time", ()=>{
		const time = logger.time("duration");
		expect(typeof(time)).toEqual("function");
		time();
	});
});
