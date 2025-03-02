import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import config from './config';

const { serviceName } = config.tracing;

const provider = new NodeTracerProvider();

const exporter = new JaegerExporter({
  serviceName,
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

console.log('Tracing initialized');
