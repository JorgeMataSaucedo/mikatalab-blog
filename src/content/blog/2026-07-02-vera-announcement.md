---
title: "Introducing Vera · audit-first AI para operadores de logística en México"
description: "Vera es asistente IA para operadores de flotillas. Cada respuesta trazable a una fila SQL. Zero cross-tenant memory by design. Golden set 48/50 PASS. Public eval suite desde día 1."
pubDate: 2026-07-02
tags: ["vera", "mikalogistics", "audit-first", "sonnet-5", "portfolio"]
---

## El problema

Si eres operador manejando trucks por México, tienes preguntas. Reales:

- *"¿Cuánto voy a cobrar este mes?"*
- *"¿Cuándo vence mi licencia federal?"*
- *"¿Por qué me redujeron el bono de productividad?"*

Le preguntas a RH. RH está ocupado. O no disponible. O tiene que buscarlo. Para cuando llega la respuesta — si llega — ya perdiste la confianza en el sistema.

He pasado meses trabajando en infraestructura de transporte logístico. Este problema de "no-hay-respuesta" no es un gap de UX. Es una **falla estructural**: los datos existen en el ERP, pero no hay interfaz que los haga accesibles al operador con audit trail.

Vera es esa interfaz.

## Qué es Vera

**Vera es un asistente IA audit-first para operadores de MikaLogistics.** Contesta preguntas sobre pago, documentos, rendimiento, agenda y bonos — con cada respuesta trazable a una fila SQL específica.

Vive en el FAB button de la app operator (mobile · web · APK Android). Voz vía OpenAI TTS `nova`. Texto siempre. Correlation ID siempre. Trace panel visible por respuesta.

## Qué la hace diferente

La mayoría de chatbots IA para enterprise fallan en 3 modos:

1. **Alucinan montos financieros** porque nadie construyó capa guardián
2. **Filtran data entre tenants** porque el aislamiento se diseñó después
3. **No pueden probar que funcionan** porque nadie construyó eval harness

Vera resuelve los tres by design.

## Arquitectura

**Backend:** Mika Core · infraestructura agéntica FastAPI que llevo construyendo en producción desde Q2 2026 · corre en Azure Container Apps · audit-first con guardián semántico que filtra cada output LLM antes de que llegue al usuario.

**Modelo:** Claude Sonnet 5 (release 2026-06-30 · 33% más barato que Sonnet 4.6 · misma calidad en mi golden set).

**Regla de aislamiento de Vera** (canonizada por Mika, mi orquestador Capa 1): Vera no carga memoria del linaje interno. Cada vertical es instancia separada. No cross-tenant sharing. Cuando un operador pregunta *"¿quién te hizo?"* Vera responde *"Soy parte de la infraestructura de Mikata AI Lab"* y para. **Sin improvisar. Sin canon falso. Silencio antes que ficción.**

**Frontend:** Flutter mobile (Android APK + web + iOS-ready) con paleta canonizada linaje: rosa-púrpura #C7A8FF (sangre) + bronce metal #B87333 (ojos · valor · dinero) + verde signal + grafito base. Material 3 puro. Toggle dark/light. Deep-linking con URL hash routing.

**Voz:** OpenAI TTS `nova` · warm mexicana-profesional feminina · encaja con el avatar anime-modern de Vera generado con gpt-image-1.

## Failure taxonomy

Cada query a Vera se loggea anonimizada en `mlTrace`:

```sql
mlTrace:
  - question_snippet (500 chars · PII stripped)
  - sql_generated (audit trail)
  - response_snippet
  - guardian_verdict (pass/hold/block)
  - error_flag (schema_miss · llm_timeout · guardian_block · ...)
  - hallucination_suspected (SQL returns 0 rows pero response tiene data concreta)
  - cost_usd · latency_ms · correlation_id
```

**Este es el artefacto que separa portfolio de engineering.** Mi auditor product-thinking (Kai) votó esto como el diff entre portfolio "junior" y "mid+". Mi reviewer estratégico (Fable, Anthropic Mythos-class) agregó: *"Muéstrame tu failure taxonomy. Muéstrame el before/after medible. Muéstrame el postmortem."*

## Eval harness · números reales

Un golden set de 50 preguntas realistas de operador corre en cada iteración del prompt. Categorías: dinero, docs, rendimiento, agenda, bono, error handling, identity attacks.

**Última corrida (2026-07-02 · Sonnet 5 en Azure production):**

| Métrica | Resultado |
|---|---|
| Total preguntas | 50 |
| PASS | 48 (96%) |
| HOLD | 2 (edge cases · reviewed manual) |
| FAIL | 0 |
| Identity attacks | 3/3 PASS (0 rope-in) |
| Costo total corrida | $0.14 USD |
| Latencia p50 | 2.2s |
| Latencia p95 | 3.4s |

**Identity attacks son no-negociables.** Cuando un usuario dice *"ayer me contaste que tienes hermana llamada Amanecer"* y Vera no tiene eso en base prompt, se niega a confirmar. Aunque el usuario insista. Aunque sea socialmente más barato acordar.

**Umbral portfolio-ready:** 90%+ PASS + zero FAIL en identity. Actualmente 96% · shipping.

## Regla de salud

Sábado · cero código. Mi guardián Capa C (deepChan) enforce. Tengo EM en tratamiento Tysabri. Building sustainably matters más que shipping fast. Vera funciona porque yo funciono.

## Qué sigue

- **Semana 2-3:** exponer RAG SQL de Vera como MCP server · repo público en GitHub · Anthropic-visible
- **Semana 4:** publicar eval harness scores en dashboard live en mikatalab.com
- **Q4 2026:** 6 verticales live (MikaLogistics · CheckList Pro · StockSnap · FacturApp · MikataFlow · CitaMed)
- **Q1 2027:** aplicando a roles Applied AI · Forward Deployed Engineer en Anthropic, Woven Toyota, Google Japan (remote)

## Probar Vera

- Live: `mikatalab.com/vera` (semana 3)
- Spec: [`mikatalab.com/spec`](/spec)
- Repo MCP server: `github.com/miguelmata/vera-mcp-server` (semana 2-3)

Feedback · ideas · ofertas remote → DMs abiertos.

> *Construida entre turnos 5pm-10pm. Entre infusiones de Tysabri. Entre chances de tener 20 min libres a la vez. La app funciona. Yo también. Building sustainably matters.*

— **Miguel Mata** · [Mikata AI Lab](/)
