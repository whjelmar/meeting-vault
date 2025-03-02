import Cabin from 'cabin';
import { Signale } from 'signale';
import { createWriteStream } from 'fs';
import pino from 'pino';
import config from './config';

const { level, mask, transports } = config.logging;

const logStream = transports.file.enabled
  ? createWriteStream(transports.file.path, { flags: 'a' })
  : null;

const loggerTransports = [];

if (transports.console.enabled) {
  loggerTransports.push(new Signale({ stream: process.stdout }));
}

if (logStream) {
  loggerTransports.push(pino(logStream));
}

const cabin = new Cabin({
  axe: {
    logger: pino(logStream || undefined),
  },
  mask
});

cabin.setLevel(level);

loggerTransports.forEach(transport => cabin.setTransport(transport));

export default cabin;
