import os
import logging

logger = logging.getLogger(__name__)


def setup_telemetry(app):
    """Configura métricas Prometheus y trazas OpenTelemetry para la app."""
    _setup_prometheus(app)
    _setup_tracing(app)


def _setup_prometheus(app):
    try:
        from prometheus_fastapi_instrumentator import Instrumentator
        Instrumentator(
            should_group_status_codes=False,
            should_ignore_untemplated=True,
            should_instrument_requests_inprogress=True,
            inprogress_labels=True,
        ).instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)
        logger.info("Prometheus metrics habilitado en /metrics")
    except ImportError:
        logger.warning("prometheus_fastapi_instrumentator no instalado, métricas deshabilitadas")


def _setup_tracing(app):
    otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
    if not otlp_endpoint:
        return

    try:
        from opentelemetry import trace
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
        from opentelemetry.sdk.resources import Resource, SERVICE_NAME
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

        resource = Resource.create({SERVICE_NAME: os.getenv("OTEL_SERVICE_NAME", "brisa-backend")})
        provider = TracerProvider(resource=resource)
        exporter = OTLPSpanExporter(endpoint=f"{otlp_endpoint}/v1/traces")
        provider.add_span_processor(BatchSpanProcessor(exporter))
        trace.set_tracer_provider(provider)

        FastAPIInstrumentor.instrument_app(app)
        logger.info(f"OpenTelemetry tracing habilitado → {otlp_endpoint}")
    except ImportError:
        logger.warning("Paquetes OpenTelemetry no instalados, tracing deshabilitado")
