import yargs from "yargs";
import {App} from "./app";
import {CronJob} from "cron";
import debug from 'debug';

const log = debug('tempest:main');

yargs
    .command('start [crontime]', 'Start the scrapper using on cron format', yargs => {
        yargs.positional('crontime', {
            describe: 'Cron format (* * * * * *)',
            default: '0 0 0 * * 0'
        })
        yargs.option('run-oninit', {
            type: "boolean",
            description: "Run on init"
        })
    }, start)
    .command('once', 'Start the scrapper only once', () => {
    }, once)
    .argv;

interface IBaseArgs{}

interface IStartArgs extends IBaseArgs{
    crontime: string,
    runOninit?: boolean
}

function start(argv: IStartArgs) {
    log('creating cronjob');
    new CronJob({
        cronTime: argv.crontime,
        onTick: ()=>once(),
        runOnInit: argv.runOninit,
        start: true
    });
}

function once() {
    log('Start process');
    const app = new App();
    return app.start()
        .then(()=>{
            console.log((new Date()).toISOString()+'::Process Done');
        }).catch(err => {
            console.error((new Date()).toISOString()+'::Process Error');
            console.error(err);
        });
}
